const jwt = require("jsonwebtoken");
require("dotenv").config();
const Users = require("../model/users");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const reg = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email);
    if (user) {
      return res.status(409).json({
        status: "Conflict",
        code: 409,
        message: "Email in use",
      });
    }
    const newUser = await Users.create(req.body);
    // const { id, name, email } = newUser;
    const { email } = newUser;
    return res.status(201).json({
      status: "Created",
      code: 201,
      data: {
        user: {
          // id,
          // name,
          email,
          subscription: "starter",
        },
      },
    });
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findByEmail(email);
    const isValidPassword = await user?.validPassword(password);

    if (!user || !isValidPassword) {
      return res.status(401).json({
        status: "Unauthorized",
        code: 401,
        message: "Email or password is wrong",
      });
    }
    const payload = { id: user.id };
    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "2h" });
    await Users.updateToken(user.id, token);
    return res.status(200).json({
      status: "OK",
      code: 200,
      data: {
        token,
        user: {
          email,
          subscription: "starter",
        },
      },
    });
  } catch (e) {
    next(e);
  }
};

const logout = async (req, res, next) => {};

module.exports = {
  reg,
  login,
  logout,
};
