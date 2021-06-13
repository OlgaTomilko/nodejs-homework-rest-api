const Joi = require("joi");
const { HttpCode } = require("../../../helpers/constants");

const schemaAddContact = Joi.object({
  name: Joi.string().alphanum().min(2).max(30).required(),

  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),

  phone: [Joi.string(), Joi.number()],

  favorite: Joi.boolean(),
}).min(2);

const schemaUpdateContact = Joi.object({
  name: Joi.string().alphanum().min(2).max(30).optional(),

  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .optional(),

  phone: [Joi.string(), Joi.number()],

  favorite: Joi.boolean(),
}).min(1);

const schemaUpdateStatusContact = Joi.object({
  favorite: Joi.boolean().required(),
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

module.exports.validateAddContact = (req, _res, next) => {
  return validate(schemaAddContact, req.body, next);
};
module.exports.validateUpdateContact = (req, _res, next) => {
  return validate(schemaUpdateContact, req.body, next);
};
module.exports.validateUpdateStatusContact = (req, _res, next) => {
  return validate(schemaUpdateStatusContact, req.body, next);
};
