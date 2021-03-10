const chai = require("chai");
const chaiHttp = require("chai-http");
var dotenv = require("dotenv");
dotenv.config({ path: process.cwd() + "/test.env" });
const app = require("../../../app.js");

const Issue = require("../../../app/models/Issue").model;
const Category = require("../../../app/models/Category").model;

// Add some data before testing
Category.create({ title: "TestTitle" })
  .then((data) => {
    console.log(data._id);
    Issue.create({
      title: "GetTestTitle",
      description: "Some description",
      category_id: data._id,
    });
    Issue.create({
      title: "GetTestTitle",
      description: "Some description",
      category_id: data._id,
    });
    Issue.create({
      title: "GetTestTitle",
      description: "Some description",
      category_id: data._id,
    });
    Issue.create({
      title: "GetTestTitle",
      description: "Some description",
      category_id: data._id,
    });
  })
  .catch((err) => console.log(err));

// Assertion style
chai.should();

chai.use(chaiHttp);

describe("Issues GET route", () => {
  describe("GET /issues/get", () => {
    it("It should GET all issues", (done) => {
      chai
        .request(app)
        .get("/issues/get")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          done();
        });
    });

    it("It should NOT GET issues", (done) => {
      chai
        .request(app)
        .get("/issues/getAll")
        .send()
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
    describe("GET /issues/get-by-category", () => {
      it("It should NOT GET issues by category ID (bad ID)", (done) => {
        chai
          .request(app)
          .get("/issues/get-by-category")
          .query({ category_id: "60480f8635f3ab250010a57c" })
          .end((err, res) => {
            res.should.have.status(404);
            done();
          });
      });
    });
    it("It should NOT GET issues by category ID (empty ID)", (done) => {
      chai
        .request(app)
        .get("/issues/get-by-category")
        .query("")
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
    it("It should GET issues by category ID", (done) => {
      Category.findOne()
        .exec()
        .then((data) => {
          console.log(data._id);
          chai
            .request(app)
            .get("/issues/get-by-category?category_id=" + data._id)
            .end((err, res) => {
              res.should.have.status(200);
              done();
            });
        });
    });
  });
});
