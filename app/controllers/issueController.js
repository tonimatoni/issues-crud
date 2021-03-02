const Issue = require("../models/Issue");

/**
 * Function that adds new issue to the MongoDB.
 * @function issuePostHandler
 * @param {Request<ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>} req - Request object from post method.
 * @param {Request<ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>} res - Response object.
 */

exports.issuePostHandler = (req, res) => {
  if (!req.body.title) {
    res.status(400).json({ error: "Title must not be empty!" });
    return;
  }
  if (!req.body.description) {
    res.status(400).json({ error: "Description must not be empty!" });
    return;
  }
  var attachments = null;
  if (req.files)
    attachments = req.files.map((file) => {
      return {
        path: "http://localhost:3000/issueAttachments/" + file.filename,
        contentType: "application/octet-stream",
      };
    });

  const issue = new Issue({
    title: req.body.title,
    description: req.body.description,
    attachments: attachments,
  });

  issue
    .save()
    .then((data) => {
      res
        .status(200)
        .json({ message: `Added issue ${data.title} successfully.` });
    })
    .catch((err) => {
      res.status(400).json({ error: "Error while adding an issue \n" + err });
    });
};

/**
 * Renders view "create.ejs" that has form for post method.
 * @function createFormHandler
 */

exports.createFormHandler = async (req, res) => {
  res.render("create");
};
