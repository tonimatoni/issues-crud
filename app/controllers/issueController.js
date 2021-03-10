const Issue = require("../models/Issue").model;
const issueValidator = require("../models/Issue").validator;
const deleteIssueFromCategory = require("./categoryController")
  .deleteIssueFromCategory;
const idValidator = require("../validator.js").modelID;

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

/**
 * Reads all issues from the MongoDB.
 * @function issueReadHandler
 * @param {Request<ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>} req - Request object from post method.
 * @param {Request<ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>} res - Response object.
 */

exports.issueReadHandler = async (req, res) => {
  const issues = await Issue.find({}).select({ title: 1, _id: 1 }).exec();
  res.status(200).json(issues);
};

/**
 * Reads all issues by provided category ID from the MongoDB.
 * @function issueReadByCategory
 * @param {Request<ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>} req - Request object from post method.
 * @param {Request<ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>} res - Response object.
 */

exports.issueReadByCategory = async (req, res) => {
  var issues = [];
  const validate = { id: req.query.category_id };
  const errorMessage = idValidator.validate(validate).error;
  if (errorMessage) {
    console.log(errorMessage.details);
    res.status(400).json({ error: errorMessage.message });
    return;
  }
  try {
    issues = await Issue.find({
      category_id: req.query.category_id,
    }).exec();
  } catch (error) {
    console.log(error);
    return;
  }

  if (issues.length != 0) {
    res.status(200).json(issues);
    return;
  }
  res.status(404).json("No issues in that category!");
};

/**
 * Deletes an issue by it's ID which is found in URL path as parameter
 * @function issueDeleteById
 * @param {Request<ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>} req - Request object from post method.
 * @param {Request<ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>} res - Response object.
 */

exports.issueDeleteById = async (req, res) => {
  let issue = {};
  const errorMessage = idValidator.validate(req.params).error;
  if (errorMessage) {
    console.log(errorMessage.details);
    res.status(400).json({ error: errorMessage.message });
    return;
  }
  try {
    issue = await Issue.findById(req.params.id).exec();
  } catch (error) {
    console.log(error);
    return;
  }

  if (!issue) {
    res.status(404).json("Can't find issue by that ID");
    return;
  }

  await deleteIssueFromCategory(req.params.id, issue.category_id);

  if ((await Issue.deleteOne({ _id: req.params.id }).exec()).deletedCount) {
    res.status(202).json("Deleted record successfully!");
    return;
  }
};
