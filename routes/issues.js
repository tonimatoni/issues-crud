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

router.post(
  "/post",
  uploadController.upload.array("attachments", 10),
  issueController.issuePostHandler
);

module.exports = router;
