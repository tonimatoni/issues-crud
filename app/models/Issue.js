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
      comment: {
        type: String,
        required: true,
      },
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
  title: Joi.string().min(4).max(30).required(),
  description: Joi.string().min(4).max(200).required(),
  category_id: Joi.string().alphanum().length(24).required(),
  attachments: Joi.optional(),
});

exports.commentsValidator = Joi.object().keys({
  comment: Joi.string().min(4).max(200).required(),
  issue_id: Joi.string().alphanum().length(24).required(),
});

exports.updateValidator = Joi.object()
  .keys({
    title: Joi.string().min(4).max(30).optional(),
    description: Joi.string().min(4).max(200).optional(),
  })
  .options({
    abortEarly: false,
  });
