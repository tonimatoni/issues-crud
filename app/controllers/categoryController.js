const Category = require("../models/Category").model;

/**
 * Function that gets all categories from DB.
 * @function categoryGetAll
 * @param {Request<ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>} req - Request object from post method.
 * @param {Request<ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>} res - Response object.
 * @returns {String} categories - All categories as json response.
 */

exports.categoryGetAll = async (req, res) => {
  const categories = await Category.find({})
    .select({ title: 1, _id: 1 })
    .exec();
  res.status(200).json(categories);
};

/**
 * Deletes issue from category.
 * @function deleteIssueFromCategory
 * @param {String} issueID
 * @param {String} categoryID
 *
 */

exports.deleteIssueFromCategory = async (issueID, categoryID = null) => {
  if (categoryID)
    await Category.updateOne(
      { _id: categoryID },
      { $pull: { issues_ids: issueID } }
    ).exec();
  return;
};
