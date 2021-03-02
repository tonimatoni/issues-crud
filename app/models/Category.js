const mongoose = require("mongoose");

const CategorySchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  issues_ids: [String],
});

module.exports = mongoose.model("Categories", CategorySchema);
