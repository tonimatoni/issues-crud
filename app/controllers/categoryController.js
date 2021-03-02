const Category = require("../models/Category");

/**
 * Function that gets all categories from DB.
 * @function categoryGetAll
 * @param {Request<ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>} req - Request object from post method.
 * @param {Request<ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>} res - Response object.
 * @returns {String} categories - All categories as json response.
 */

exports.categoryGetAll = async (req, res) => {
  const categories = await Category.find({})
    .select({ title: 1, _id: 0 })
    .exec();
  res.status(200).json(categories);
};

exports.categoryPostHandler = async (req, res) => {
  if (!req.body.title) {
    res.status(400).json({ error: "Title cannot be empty!" });
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

  category
    .save()
    .then((data) => {
      res.status(201).json(data._id);
    })
    .catch((err) => {
      res
        .status(400)
        .json({ error: "Error while creating a category \n" + err });
    });
};

const findCategoryByTitle = (title) => {
  return Category.findOne({ title: title }).exec();
};

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
