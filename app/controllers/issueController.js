const Issue = require("../models/Issue").model;
const issueValidator = require("../models/Issue").validator;

/**
 * Function that adds new issue to the MongoDB.
 * @function issuePostHandler
 * @param {Request<ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>} req - Request object from post method.
 * @param {Request<ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>} res - Response object.
 *
 */

exports.issuePostHandler = (req, res) => {
  var attachments = null;
  if (req.files)
    attachments = req.files.map((file) => {
      return {
        path: "http://localhost:3000/issueAttachments/" + file.filename,
        contentType: "application/octet-stream",
      };
    });
  const errorMessage = issueValidator.validate(req.body).error;
  if (errorMessage) {
    res.status(400).json({ error: errorMessage.details });
    return;
  }
  const issue = new Issue({
    title: req.body.title,
    description: req.body.description,
    attachments: attachments,
    category_id: req.body.category_id,
  });

  issue
    .save()
    .then((data) => {
      res.status(200).json({
        message: `Added issue ${data.title} successfully.`,
        id: data._id,
        category_id: data.category_id,
      });
    })
    .catch((err) => {
      res.status(400).json({ error: "Error while adding an issue \n" + err });
    });
};
