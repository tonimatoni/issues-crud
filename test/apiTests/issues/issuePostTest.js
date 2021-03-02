const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../../app.js");

// Assertion style
chai.should();

chai.use(chaiHttp);

describe("Issues POST route", () => {
  /**
   *
   */

  describe("POST /issues/post", () => {
    it("It should POST a new issue", (done) => {
      const issue = {
        title: "Test1Title",
        description: "Test1Description",
        attachments: null,
      };
      chai
        .request(app)
        .post("/issues/post")
        .send(issue)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("message");
          res.body.message.should.equal("Added issue Test1Title successfully.");
          done();
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
          res.body.should.be.a("object");
          res.body.should.have.property("error");
          res.body.error.should.equal("Description must not be empty!");
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
          res.body.should.be.a("object");
          res.body.should.have.property("error");
          res.body.error.should.equal("Title must not be empty!");
          done();
        });
    });
  });
});
