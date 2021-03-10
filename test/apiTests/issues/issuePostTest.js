const chai = require("chai");
const chaiHttp = require("chai-http");
var dotenv = require("dotenv");
dotenv.config({ path: process.cwd() + "/test.env" });
const app = require("../../../app.js");
const Category = require("../../../app/models/Category").model;

// Assertion style
chai.should();

chai.use(chaiHttp);

describe("Issues POST route", () => {
  /**
   *
   */

  describe("POST /issues/post", () => {
    it("It should POST a new issue", (done) => {
      Category.findOne()
        .select({ _id: 1 })
        .exec()
        .then((data) => {
          const issue = {
            title: "Test1Title",
            description: "Test1Description",
            attachments: null,
            category_id: data._id,
          };
          chai
            .request(app)
            .post("/issues/post")
            .send(issue)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a("object");
              res.body.should.have.property("message");
              res.body.message.should.equal(
                "Added issue Test1Title successfully."
              );
              done();
            });
        });
    });
    it("It should NOT POST a new issue (no description)", (done) => {
      const issue = {
        title: "Test2Title",
        attachments: null,
      };
      chai
        .request(app)
        .post("/issues/post")
        .send(issue)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
    it("It should NOT POST a new issue (title field is empty)", (done) => {
      const issue = {
        title: "",
        description: "SomeDescriptionTest3",
        attachments: null,
      };
      chai
        .request(app)
        .post("/issues/post")
        .send(issue)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
    it("It should NOT POST a new issue (category is empty)", (done) => {
      const issue = {
        title: "SomeTitle",
        description: "SomeDescriptionTest3",
        attachments: null,
      };
      chai
        .request(app)
        .post("/issues/post")
        .send(issue)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });
});
