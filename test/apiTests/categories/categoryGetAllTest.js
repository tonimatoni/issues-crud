const chai = require("chai");
const chaiHttp = require("chai-http");
var dotenv = require("dotenv");
dotenv.config({ path: process.cwd() + "/test.env" });
const app = require("../../../app.js");

// Assertion style
chai.should();

chai.use(chaiHttp);

describe("Category GET route", () => {
  describe("GET /categories/get", () => {
    it("It should GET all the categories", (done) => {
      chai
        .request(app)
        .get("/categories/get")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          done();
        });
    });
    it("It should NOT GET all the categories (/category/get) ", (done) => {
      chai
        .request(app)
        .get("/category/get")
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
});
