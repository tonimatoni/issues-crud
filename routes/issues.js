var express = require("express");
var router = express.Router();

const issueController = require("../app/controllers/issueController.js");
const uploadController = require("../app/controllers/uploadController.js");

/**
 * @swagger
 * /issues/post:
 *   post:
 *     summary: Creates a new Issue
 *     description: Use to post new record in issues collection
 *     tags:
 *       - issues
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: title
 *         required: true
 *         type: string
 *         description: Title of issue to be created.
 *         example: Talk to CEO.
 *       - in: formData
 *         name: description
 *         type: string
 *         required: true
 *         description: Description of issue to be created.
 *         example: Talk about the current opportunities in company.
 *       - in: formData
 *         name: attachments
 *         type: file
 *         description: Files associated with the issue.
 *       - in: formData
 *         name: category_id
 *         type: string
 *         description: ID of category that issue belongs to.
 *     responses:
 *       '200':
 *         description: Created new record,
 *         content:
 *           application/json:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *               id:
 *                 type: string
 *               category_id:
 *                 type: string
 *       '400':
 *         description: When trying to add issue without title or description,
 *         content:
 *           application/json:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 */

router.post("/post", uploadController.upload, issueController.issuePostHandler);

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
 *       '404':
 *         description: Can't find category by that ID
 *         type: String
 */
router.get("/get-by-category", issueController.issueReadByCategory);
/**
 * @swagger
 * /issues/delete/{id}:
 *   delete:
 *     summary: Deletes an issue by it's ID
 *     tags:
 *     - issues
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: String
 *         required: true
 *         description: ID of issue to delete
 *     responses:
 *       '202':
 *         description: Successfully deleted an issue,
 *         content:
 *           application/json:
 *             type: string
 *       '404':
 *         description: Can't find issue by that ID
 *         content:
 *           application/json:
 *             type: String
 */
router.delete("/delete/:id", issueController.issueDeleteById);
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
 * /issues/{id}/comment/post:
 *   post:
 *     summary: Creates a new comment for an issue
 *     tags:
 *       - comments
 *     parameters:
 *       - in: formData
 *         name: comment
 *         required: true
 *         type: string
 *         description: Text of a comment.
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Issue ID, length must be 24.
 *     responses:
 *       '200':
 *         description: Created new record,
 *         content:
 *           application/json:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *               id:
 *                 type: string
 *               category_id:
 *                 type: string
 *       '400':
 *         description: When validation fails.
 *         content:
 *           application/json:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 */
router.post("/:id/comment/post", issueController.commentPostHandler);

/**
 * @swagger
 * /issues/{id}/update:
 *   put:
 *     summary: Changes title and description.
 *     tags:
 *       - issues
 *     parameters:
 *       - in: formData
 *         name: title
 *         required: true
 *         type: string
 *         description: Updated value of title.
 *         example: Talk to CEO.
 *       - in: formData
 *         name: description
 *         type: string
 *         required: true
 *         description: Updated value of description.
 *         example: Talk about the current opportunities in company.
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *         description: Issue ID.
 *         example: 6035860f29bd8e207c878f6c
 *     responses:
 *       '200':
 *         description: Update an existing issue
 *         content:
 *           application/json:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *               id:
 *                 type: string
 *               category_id:
 *                 type: string
 *       '400':
 *         description: When updating without both title and description,
 *         content:
 *           application/json:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 */
router.put("/:id/update", issueController.updateIssueHandler);

/**
 * @swagger
 * /issues/{id}:
 *   put:
 *     summary: Sets an issue to status finished.
 *     tags:
 *       - issues
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of issue to be updated.
 *     responses:
 *       '200':
 *         description: Update an existing issue
 *         content:
 *           application/json:
 *             type: String
 *       '400':
 *         description: When updating without both title and description.
 *         content:
 *           application/json:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *       '404':
 *         description: When can't find issue by specified ID.
 *         content:
 *           application/json:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 */
router.put("/:id", issueController.issueSetDoneHandler);

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
 *       '404':
 *         description: Can't find category by that ID
 *         type: String
 */
router.get("/get-by-category", issueController.issueReadByCategory);
/**
 * @swagger
 * /issues/delete/{id}:
 *   delete:
 *     summary: Deletes an issue by it's ID
 *     tags:
 *     - issues
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: String
 *         required: true
 *         description: ID of issue to delete
 *     responses:
 *       '202':
 *         description: Successfully deleted an issue,
 *         content:
 *           application/json:
 *             type: string
 *       '404':
 *         description: Can't find issue by that ID
 *         content:
 *           application/json:
 *             type: String
 */
router.delete("/delete/:id", issueController.issueDeleteById);
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

module.exports = router;
