var express = require("express");
var router = express.Router();

const issueController = require("../app/controllers/issueController");
/**
 * @swagger
 * /issues/get:
 *   get:
 *     summary: Gets all of the issues.
 *     description: Use to request for all issues
 *     tags:
 *       - issues
 *     responses:
 *       '200':
 *         description: A list of all issues,
 *         content:
 *           application/json:
 *             type: object
 *             properties:
 *               issues:
 *                 type: array
 *                 title:
 *                   type: string
 *                   description: Issue title
 *                   example: Take out trash
 *                 _id:
 *                   type: string
 *                   description: Issue ID
 *                   example: dsaffasd3241oplea3
 */
router.get("/get", issueController.issueReadHandler);

/**
 * @swagger
 * /issues/get-by-category:
 *   get:
 *     summary: Retrieve a list of all issues that belongs to a group
 *     tags:
 *     - issues
 *     parameters:
 *       - in: query
 *         name: category_id
 *         type: String
 *         description: ID of category that we're fetching issues
 *     responses:
 *       '200':
 *         description: A list of all issues for a specified category,
 *         content:
 *            application/json:
 *             type: object
 *             properties:
 *               issues:
 *                 type: array
 *                 title:
 *                   type: string
 *                   description: Issue title
 *                   example: Take out trash
 *                 _id:
 *                   type: string
 *                   description: Issue ID
 *                   example: dsaffasd3241oplea3
 *                 description:
 *                   type: string
 *                   description: Issue description
 *                   example: Take out trash today, after breakfast.
 *                 created_at:
 *                   type: date
 *                   description: Issue ID
 *                   example: Date when issue is created.
 *                 finished_at:
 *                   type: date
 *                   description: Date when issue is finished.
 *                 status:
 *                   type: string
 *                   description: Status of issue (pending or finished)
 *                   example: pending
 *                 comments:
 *                   type: array
 *                 attachments:
 *                   type: array
 *                 __v:
 *                   type: number
 *       '400':
 *         description: Can't find category by that ID or category_id is empty
 *         type: String
 */
router.get("/get-by-category", issueController.issueReadByCategory);

module.exports = router;
