const Issue = require("../models/Issue");

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
  const issues = await Issue.find({
    category_id: req.query.category_id,
  }).exec();
  if (issues.length != 0) {
    res.status(200).json(issues);
    return;
  }
  res.status(404).json("Can't find that category ID");
};
