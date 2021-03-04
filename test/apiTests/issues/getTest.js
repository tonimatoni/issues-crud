const chai = require("chai");
const chaiHttp = require("chai-http");
var dotenv = require("dotenv");
dotenv.config({ path: process.cwd() + "/test.env" });
const app = require("../../../app.js");

const Issue = require("../../../app/models/Issue");
const Category = require("../../../app/models/Category");

// Add some data before testing
Category.create({ title: "TestTitle" })
  .then((data) => {
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
  /**
   *
   */

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
    it("It should GET issues by category ID", async () => {
      var category = await Category.findOne().exec();
      chai
        .request(app)
        .get("/issues/get-by-category?category_id=" + category._id)
        .send()
        .end((err, res) => {
          res.should.have.status(200);
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
    it("It should NOT GET issues by category ID (bad ID)", (done) => {
      chai
        .request(app)
        .get("/issues/get-by-category")
        .send("category123")
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
    it("It should NOT GET issues by category ID (empty ID)", (done) => {
      chai
        .request(app)
        .get("/issues/get-by-category")
        .send("")
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });
});
