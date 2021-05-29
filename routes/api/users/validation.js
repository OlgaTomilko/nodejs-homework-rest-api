const Joi = require("joi");

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

const validate = async (schema, body, next) => {
  try {
    await schema.validateAsync(body);
    next();
  } catch (err) {
    next({ status: 400, message: `Field: ${err.message.replace(/''/g, "")}` });
  }
};

module.exports.validateRegistration = (req, _res, next) => {
  return validate(schemaRegistration, req.body, next);
};
module.exports.validateUpdateSubscription = (req, _res, next) => {
  return validate(schemaSubscription, req.body, next);
};
