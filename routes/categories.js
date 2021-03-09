var express = require("express");
var router = express.Router();

const categoryController = require("../app/controllers/categoryController.js");
/**
 * @swagger
 * /categories/get:
 *   get:
 *     summary: Gets all of the categories.
 *     description: Use to request for all categoies
 *     tags:
 *       - categories
 *     responses:
 *       '200':
 *         description: A list of all categories,
 *         content:
 *           application/json:
 *             type: object
 *             properties:
 *               categories:
 *                 type: array
 *                 title:
 *                   type: string
 *                   description: Category title
 *                   example: To do
 */

router.get("/get", categoryController.categoryGetAll);

/**
 * @swagger
 * /categories/post:
 *   post:
 *     summary: Creates a new Category
 *     description: Use to post new record in categories collection
 *     tags:
 *       - categories
 *     parameters:
 *       - in: formData
 *         name: title
 *         type: string
 *         description: Category title to add to DB.
 *         required: true
 *         example: To do
 *     responses:
 *       '201':
 *         description: Created a new category, returns ID of it.
 *         content:
 *           application/json:
 *             type: String
 *       '200':
 *         description: If exists in database, returns it's ID,
 *         content:
 *           application/json:
 *             type: String
 *       '400':
 *         description: When trying to add issue without title or description,
 *         content:
 *           application/json:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *
 */
router.post("/post", categoryController.categoryPostHandler);
/**
 * @swagger
 * /categories/update:
 *   put:
 *     summary: Updates specifig category by adding a new issue to it
 *     tags:
 *       - categories
 *     parameters:
 *       - in: formData
 *         name: issue_id
 *         type: string
 *         description: Issue ID that should be added to category.
 *         required: true
 *       - in: formData
 *         name: category_id
 *         type: string
 *         description: Category ID that the issue should be added to.
 *         required: true
 *     responses:
 *       '200':
 *         description: Issue ID is added to the category.
 *         content:
 *           application/json:
 *             type: String
 *       '400':
 *         description: Error trying to add new issue to the category.
 *
 */
router.put("/update", categoryController.categoryAddIssueHandler);

module.exports = router;
