var express = require("express");
var router = express.Router();

const categoryController = require("../app/controllers/categoryController.js");

router.get("/get", categoryController.categoryGetAll);
router.post("/post", categoryController.categoryPostHandler);
router.put("/update", categoryController.categoryAddIssueHandler);

module.exports = router;
