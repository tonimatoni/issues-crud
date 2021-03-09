const Category = require("../models/Category").model;
const categoryValidator = require("../models/Category").validator;

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
/** Function that tries to add new category to the DB.
 * @function categoryPostHandler
 * @param {Request<ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>} req - Request object from post method.
 * @param {Request<ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>} res - Response object.
 */
exports.categoryPostHandler = async (req, res) => {
  const errorMessage = categoryValidator.validate(req.body).error;
  if (errorMessage) {
    res.status(400).json({ error: errorMessage.details });
    return;
  }

  let ctg = await findCategoryByTitle(req.body.title);
  if (ctg) {
    res.status(200).json(ctg._id);
    return;
  }

  const category = new Category({
    title: req.body.title,
  });
  try {
    let data = await category.save();
    res.status(201).json(data._id);
  } catch (error) {
    res.status(400).json({ error: "Error while creating a category \n" + err });
  }
};

/**
 * Updates category by pushing new issue_id into "issues" property
 * @function categoryAddIssueHandler
 * @param {Request<ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>} req - Request object from post method.
 * @param {Request<ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>} res - Response object.
 */

exports.categoryAddIssueHandler = async (req, res) => {
  const category = await Category.findById(req.body.category_id);
  category.issues_ids.push(req.body.issue_id);
  try {
    await category.save();
    res.status(200).json("Successfully added issue to the category!");
  } catch (error) {
    res.status(400);
  }
};

/**
 * Finds and returns a category by its title.
 * @function findCategoryByTitle
 * @param {String} title
 * @returns {Promise<Document<any>>} Promise of a category
 */

const findCategoryByTitle = async (title) => {
  return Category.findOne({ title: title }).exec() || false;
};
