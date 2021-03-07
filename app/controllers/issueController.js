const Issue = require("../models/Issue").model;
const commentsValidator = require("../models/Issue").commentsValidator;
const updateValidator = require("../models/Issue").updateValidator;

/**
 * Function that adds new comment to an issue.
 * @function commentPostHandler
 * @param {Request<ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>} req - Request object from post method.
 * @param {Request<ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>} res - Response object.
 *
 */

exports.commentPostHandler = async (req, res) => {
  try {
    const toValidate = {
      issue_id: req.params.id,
      comment: req.body.comment,
    };
    commentsValidator.validate(toValidate, {});

    const errorMessage = commentsValidator.validate(toValidate).error;
    if (errorMessage) {
      res.status(400).json({ error: errorMessage.message });
      return;
    }

    // Finds issue by it's ID, and updates by pushing new value into comments array
    await Issue.updateOne(
      { _id: toValidate.issue_id },
      {
        $push: {
          comments: { comment: toValidate.comment },
        },
      }
    );
    res
      .status(200)
      .json("Successfully added a comment to issue " + toValidate.issue_id);
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

    if (issue.status === "finished") {
      res.status(400).json("Couldn't update issue");
      return;
    }
    issue.finished_at = new Date();
    issue.status = "finished";
    issue.save();

    res.status(200).json("Status set to 'finished'");
  } catch (error) {
    console.log(error);
  }
};
