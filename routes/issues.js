var express = require("express");
var router = express.Router();

const issueController = require("../app/controllers/issueController");

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
 *     summary: Creates a new comment for an issue
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

module.exports = router;
