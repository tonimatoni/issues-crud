var express = require("express");
var router = express.Router();

var categoryController = require("../app/controllers/categoryController");

router.get("/get", categoryController.categoryGetAll);

module.exports = router;
