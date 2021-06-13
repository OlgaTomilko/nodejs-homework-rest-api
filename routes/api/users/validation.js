const Joi = require("joi");
const { HttpCode } = require("../../../helpers/constants");

const schemaRegistration = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),

  password: Joi.string().alphanum().min(2).max(30).required(),
});

const schemaSubscription = Joi.object({
  subscription: Joi.any().valid("starter", "pro", "business").required(),
});

const schemaRepeatEmailVerify = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
});

const validate = async (schema, body, next) => {
  try {
    await schema.validateAsync(body);
    next();
  } catch (err) {
    next({
      status: HttpCode.BAD_REQUEST,
      message: `Field: ${err.message.replace(/''/g, "")}`,
    });
  }
};

module.exports.validateRegistration = (req, _res, next) => {
  return validate(schemaRegistration, req.body, next);
};
module.exports.validateUpdateSubscription = (req, _res, next) => {
  return validate(schemaSubscription, req.body, next);
};
module.exports.validateRepeatEmailVerify = (req, _res, next) => {
  return validate(schemaRepeatEmailVerify, req.body, next);
};
