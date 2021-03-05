const Issue = require("../models/Issue").model;
const deleteIssueFromCategory = require("./categoryController")
  .deleteIssueFromCategory;

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
 * @function issueReadHandler
 * @param {Request<ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>} req - Request object from post method.
 * @param {Request<ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>} res - Response object.
 */

exports.issueReadByCategory = async (req, res) => {
  var issues = [];
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
