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
  describe("\nPUT /issues/:id", () => {
    it("It should UPDATE an issue by setting it's finished_at to current date", async () => {
      const issue = await generateIssue();

      chai
        .request(app)
        .put(`/issues/${issue._id}`)
        .end((err, res) => {
          if (err) return Promise.reject(err);
          res.should.have.status(200);
          return Promise.resolve();
        });
    });

    it("It should NOT UPDATE an isuse (already finished)", async () => {
      const issue = await Issue.create({
        title: "Some title",
        description: "some description",
        status: "finished",
      });
      chai
        .request(app)
        .put(`/issues/${issue._id}`)
        .end((err, res) => {
          if (err) return Promise.reject(err);
          res.should.have.status(400);
          return Promise.resolve();
        });
    });
  });
  it("It should NOT UPDATE an issue (ID not found)", async () => {
    chai
      .request(app)
      .put(`/issues/41224d776a326fb40f000001`)
      .end((err, res) => {
        if (err) return Promise.reject(err);
        res.should.have.status(404);
        return Promise.resolve();
      });
  });

  describe("\nPUT /issues/:id/update", () => {
    it("It should UPDATE description of an issue ", async () => {
      const issue = await generateIssue();

      chai
        .request(app)
        .put(`/issues/${issue._id}/update`)
        .send({
          description: "Some new updated description",
          title: "",
        })
        .end((err, res) => {
          if (err) return Promise.reject(err);
          res.should.have.status(200);
          return Promise.resolve();
        });
    });
    it("It should UPDATE title of an issue ", async () => {
      const issue = await generateIssue();

      chai
        .request(app)
        .put(`/issues/${issue._id}/update`)
        .send({
          description: "",
          title: "Some new title",
        })
        .end((err, res) => {
          if (err) return Promise.reject(err);
          res.should.have.status(200);
          return Promise.resolve();
        });
    });
    it("It should UPDATE both title and description of an issue ", async () => {
      const issue = await generateIssue();

      chai
        .request(app)
        .put(`/issues/${issue._id}/update`)
        .send({
          description: "Some updated description",
          title: "Some new title",
        })
        .end((err, res) => {
          if (err) return Promise.reject(err);
          res.should.have.status(200);
          return Promise.resolve();
        });
    });
    it("It should NOT UPDATE an issue", async () => {
      const issue = await generateIssue();

      chai
        .request(app)
        .put(`/issues/${issue._id}/update`)
        .send({
          description: "",
          title: "",
        })
        .end((err, res) => {
          if (err) return Promise.reject(err);
          res.should.have.status(400);
          return Promise.resolve();
        });
    });
  });
});
