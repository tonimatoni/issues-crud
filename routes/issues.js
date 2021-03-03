var express = require("express");
var router = express.Router();

/**
 * @swagger
 * /issues:
 *   get:
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 */
router.get("/", function (req, res, next) {
  res.send("test");
});

module.exports = router;
