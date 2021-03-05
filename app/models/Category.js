const mongoose = require("mongoose");
const Joi = require("joi");

const CategorySchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  issues_ids: [String],
});

exports.model = mongoose.model("Categories", CategorySchema);

exports.validator = Joi.object().keys({
  title: Joi.string().alphanum().min(4).max(30).required(),
});
