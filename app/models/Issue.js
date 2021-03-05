const mongoose = require("mongoose");
const Joi = require("joi");

const IssueSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  comments: [
    {
      type: String,
      created_at: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
  created_at: {
    type: Date,
    default: Date.now(),
  },
  finished_at: {
    type: Date,
    default: null,
  },
  attachments: [
    {
      path: { type: String, default: null },
      contentType: { type: String, default: null },
    },
  ],
  status: {
    type: String,
    enum: ["pending", "finished"],
    default: "pending",
  },
  category_id: {
    type: String,
  },
});

exports.model = mongoose.model("Issues", IssueSchema);

exports.validator = Joi.object().keys({
  title: Joi.string().alphanum().min(4).max(30).required(),
  description: Joi.string().alphanum().min(4).max(200).required(),
  category_id: Joi.string().alphanum().min(4).max(200).required(),
  attachments: Joi.optional(),
});
