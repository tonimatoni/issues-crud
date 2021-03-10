const Joi = require("joi");

exports.modelID = Joi.object().keys({
  id: Joi.string().alphanum().length(24).optional(),
});
