const Joi = require("joi");

const schemaRegistration = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),

  password: Joi.string().alphanum().min(2).max(30).required(),
}).min(2);

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
