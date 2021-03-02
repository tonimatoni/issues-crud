const mongoose = require("mongoose");

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
});

module.exports = mongoose.model("Issues", IssueSchema);
