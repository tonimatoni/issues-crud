const Issue = require("../models/Issue").model;
// Validators
const issueValidator = require("../models/Issue").validator;
const commentsValidator = require("../models/Issue").commentsValidator;
const updateValidator = require("../models/Issue").updateValidator;
// Validators
const issueStatus = require("../constants/enums").issueStatusEnum;
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
  if (req.files) {
    attachments = req.files.map((file) => {
      return {
        path: "http://localhost:3000/issueAttachments/" + file.filename,
        contentType: "application/octet-stream",
      };
    });
  }
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

/**
 * Function that adds new comment to an issue.
 * @function commentPostHandler
 * @param {Request<ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>} req - Request object from post method.
 * @param {Request<ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>} res - Response object.
 *
 */

exports.commentPostHandler = async (req, res) => {
  try {
    const params = {
      issue_id: req.params.id,
      comment: req.body.comment,
    };

    const errorMessage = commentsValidator.validate(params).error;
    if (errorMessage) {
      res.status(400).json({ error: errorMessage.message });
      return;
    }

    // Finds issue by it's ID, and updates by pushing new value into comments array
    await Issue.updateOne(
      { _id: params.issue_id },
      {
        $push: {
          comments: { comment: params.comment },
        },
      }
    );
    res
      .status(200)
      .json("Successfully added a comment to issue " + params.issue_id);
  } catch (error) {
    console.log(error);
  }
};

/** Function that update an existing issue, allowing only changes in title and description.
 * @function updateIssueHandler
 * @param {Request<ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>} req - Request object from post method.
 * @param {Request<ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>} res - Response object.
 *
 */

exports.updateIssueHandler = async (req, res) => {
  try {
    const issue_id = req.params.id;
    let errors = {};

    let issue = await Issue.findById(issue_id);
    const errorMessage = updateValidator.validate(req.body).error;

    // Adds errors to "errors" object.
    if (errorMessage) {
      errorMessage.details.forEach((d) => {
        errors[d.context.key] = true;
      });

      // IF BOTH errors exist
      if (errorMessage.details.length === 2) {
        res.status(400).json("Error during update");
        return;
      }
    }

    // Checks if error exists before updating
    if (!errors.title) issue.title = req.body.title;
    if (!errors.description) issue.description = req.body.description;
    issue.save();
    res.status(200).json("Updated successfully");
  } catch (error) {
    console.log(error);
  }
};

/** Sets the issue to finished status and it's date to current.
 * @function issueSetDoneHandler
 * @param {Request<ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>} req - Request object from post method.
 * @param {Request<ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>} res - Response object.
 *
 */

exports.issueSetDoneHandler = async (req, res) => {
  try {
    const issue_id = req.params.id;
    const issue = await Issue.findById(issue_id);
    if (!issue) {
      res.status(404).json("Issue not found");
      return;
    }

    if (issue.status === issueStatus.FINISHED) {
      res.status(400).json("Couldn't update issue");
      return;
    }
    issue.finished_at = new Date();
    issue.status = issueStatus.FINISHED;
    issue.save();

    res.status(200).json(`Status set to '${issueStatus.FINISHED}'`);
  } catch (error) {
    console.log(error);
  }
};
