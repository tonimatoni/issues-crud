const chai = require("chai");
const chaiHttp = require("chai-http");
var dotenv = require("dotenv");
dotenv.config({ path: process.cwd() + "/test.env" });
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
          done();
        });
    });
  });
});
