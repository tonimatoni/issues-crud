var express = require("express");
var router = express.Router();

const issueController = require("../app/controllers/issueController.js");
const uploadController = require("../app/controllers/uploadController.js");

router.post(
  "/post",
  uploadController.upload.array("attachments", 10),
  issueController.issuePostHandler
);

module.exports = router;
