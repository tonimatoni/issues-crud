const chai = require("chai");
const chaiHttp = require("chai-http");
var dotenv = require("dotenv");
dotenv.config({ path: process.cwd() + "/test.env" });
const app = require("../../../app.js");
const Category = require("../../../app/models/Category").model;
const Issue = require("../../../app/models/Issue").model;

const generateIssue = async () => {
  const category = await Category.create({ title: "UpdateTestCategory" });
  return Issue.create({
    title: "UpdateTestTitle",
    description: "Some description",
    category_id: category._id,
  });
};
// Assertion style
chai.should();

chai.use(chaiHttp);

describe("Issues PUT route", () => {
  describe("\nPOST /issues/:id/comment/post", () => {
    it("It should POST a new comment to an issue", async () => {
      const issue = await generateIssue();

      chai
        .request(app)
        .post(`/issues/${issue._id}/comment/post`)
        .send({ comment: "Some comment for testing purposes" })
        .end((err, res) => {
          if (err) return Promise.reject(err);
          res.should.have.status(200);
          return Promise.resolve();
        });
    });
    it("It should NOT POST a new comment to an issue (only aphanumeric characters are allowed in id)", (done) => {
      chai
        .request(app)
        .post(`/issues/someID@!sad/comment/post`)
        .send({ comment: "Some comment for testing purposes" })
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
    it("It should NOT POST a new comment to an issue (empty comment)", async () => {
      const issue = await generateIssue();

      chai
        .request(app)
        .post(`/issues/${issue._id}/comment/post`)
        .send({ comment: "" })
        .end((err, res) => {
          if (err) return Promise.reject(err);
          res.should.have.status(400);
          return Promise.resolve();
        });
    });
    it("It should NOT POST a new comment to an issue (bad issue ID length)", async () => {
      const issue = await generateIssue();

      chai
        .request(app)
        .post(`/issues/${issue._id}aa/comment/post`)
        .send({ comment: "Some comment for testing purposes" })
        .end((err, res) => {
          if (err) return Promise.reject(err);
          res.should.have.status(400);
          return Promise.resolve();
        });
    });
  });
});
