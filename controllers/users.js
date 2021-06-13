const jwt = require("jsonwebtoken");
require("dotenv").config();
const Users = require("../model/users");
const { HttpCode } = require("../helpers/constants");
const UploadAvatar = require("../services/upload-avatars-local");
const EmailService = require("../services/email");
const {
  CreateSenderNodemailer,
  CreateSenderSendgrid,
} = require("../services/sender-email");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const AVATARS_OF_USERS = process.env.AVATARS_OF_USERS;

const reg = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email);
    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        status: "Conflict",
        code: HttpCode.CONFLICT,
        message: "Email in use",
      });
    }
    const newUser = await Users.create(req.body);
    const { email, subscription, avatarURL, verifyToken } = newUser;
    // TODO send email
    try {
      const emailService = new EmailService(
        process.env.NODE_ENV,
        // new CreateSenderSendgrid()
        new CreateSenderNodemailer()
      );
      await emailService.sendVerifyPasswordEmail(
        verifyToken,
        email,
        subscription
      );
    } catch (e) {
      console.log(e.message);
    }

    return res.status(HttpCode.CREATED).json({
      status: "Created",
      code: HttpCode.CREATED,
      data: {
        user: {
          email,
          subscription,
          avatarURL,
        },
      },
    });
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password, subscription } = req.body;
    const user = await Users.findByEmail(email);
    const isValidPassword = await user?.validPassword(password);

    if (!user || !isValidPassword) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: "Unauthorized",
        code: HttpCode.UNAUTHORIZED,
        message: "Email or password is wrong",
      });
    }

    if (!user.verify) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: "Unauthorized",
        code: HttpCode.UNAUTHORIZED,
        message: "Check email for verification",
      });
    }

    const payload = { id: user.id };
    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "2h" });
    await Users.updateToken(user.id, token);
    return res.status(HttpCode.OK).json({
      status: "OK",
      code: HttpCode.OK,
      data: {
        token,
        user: {
          email,
          subscription,
        },
      },
    });
  } catch (e) {
    next(e);
  }
};

const logout = async (req, res, next) => {
  await Users.updateToken(req.user.id, null);
  return res.status(HttpCode.NO_CONTENT).json({});
};

const avatars = async (req, res, next) => {
  try {
    const id = req.user.id;
    const uploads = new UploadAvatar(AVATARS_OF_USERS);
    const avatarUrl = await uploads.saveAvatarToStatic({
      idUser: id,
      pathFile: req.file.path,
      name: req.file.filename,
      oldFile: req.user.avatarURL,
    });
    await Users.updateAvatar(id, avatarUrl);
    return res.json({
      status: "success",
      code: HttpCode.OK,
      data: { avatarUrl },
    });
  } catch (error) {
    next(error);
  }
};

const current = async (req, res, next) => {
  try {
    const { email, subscription, avatarURL } = req.user;
    return res.status(HttpCode.OK).json({
      status: "OK",
      code: HttpCode.OK,
      data: {
        user: {
          email,
          subscription,
          avatarURL,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const subscription = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await Users.updateSubscription(userId, req.body);
    if (user) {
      return res
        .status(200)
        .json({ status: "success", code: 200, data: { user } });
    }
    return res
      .status(404)
      .json({ status: "error", code: 404, message: "Not Found" });
  } catch (error) {
    next(error);
  }
};

const verify = async (req, res, next) => {
  try {
    const user = await Users.getUserByVerifyToken(req.params.verificationToken);
    console.log(req.params.verificationToken);
    if (user) {
      await Users.updateVerifyToken(user.id, true, null);
      return res.status(HttpCode.OK).json({
        status: "success",
        code: HttpCode.OK,
        message: "Verification successful",
      });
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: "error",
      code: HttpCode.NOT_FOUND,
      message: "User not found",
    });
  } catch (error) {
    next(error);
  }
};

const repeatSendEmailVerify = async (req, res, next) => {
  const user = await Users.findByEmail(req.body.email);
  if (user) {
    const { subscription, email, verifyToken, verify } = user;
    if (!verify) {
      try {
        const emailService = new EmailService(
          process.env.NODE_ENV,
          new CreateSenderNodemailer()
        );
        await emailService.sendVerifyPasswordEmail(
          verifyToken,
          email,
          subscription
        );
        return res.status(HttpCode.OK).json({
          status: "success",
          code: HttpCode.OK,
          message: "Verification email sent",
        });
      } catch (error) {
        console.log(error.message);
        return next(error);
      }
    }
    return res.status(HttpCode.BAD_REQUEST).json({
      status: "Bad Request",
      code: HttpCode.BAD_REQUEST,
      message: "Verification has already been passed",
    });
  }
  return res.status(HttpCode.NOT_FOUND).json({
    status: "error",
    code: HttpCode.NOT_FOUND,
    message: "User not found",
  });
};

module.exports = {
  reg,
  login,
  logout,
  current,
  subscription,
  avatars,
  verify,
  repeatSendEmailVerify,
};
