const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../../app.js");

// Assertion style
chai.should();

chai.use(chaiHttp);

describe("Category POST route", () => {
  describe("POST /categories/post", () => {
    it("It should POST a new category", (done) => {
      const category = {
        title: "Category1Test",
      };
      chai
        .request(app)
        .post("/categories/post")
        .send(category)
        .end((err, res) => {
          res.should.have.status(201);
          done();
        });
    });
    it("It should NOT POST a new category", (done) => {
      const category = {
        title: "Category1Test",
      };
      chai
        .request(app)
        .post("/categories/post")
        .send(category)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    it("It should NOT POST a new category (no title)", (done) => {
      const category = {
        title: "",
      };
      chai
        .request(app)
        .post("/issues/post")
        .send(category)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have.property("error");
          res.body.error.should.equal("Title cannot be empty!");
          done();
        });
    });
  });
});
