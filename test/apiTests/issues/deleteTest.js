const chai = require("chai");
const chaiHttp = require("chai-http");
var dotenv = require("dotenv");
dotenv.config({ path: process.cwd() + "/test.env" });
const app = require("../../../app.js");

const Issue = require("../../../app/models/Issue").model;
const Category = require("../../../app/models/Category").model;

// Add some data before testing
Category.create({ title: "DeleteTestCategory" })
  .then((data) => {
    Issue.create({
      title: "DeleteTestTitle",
      description: "Some description",
      category_id: data._id,
    });
    Issue.create({
      title: "DeleteTestTitle",
      description: "Some description",
      category_id: data._id,
    });
    Issue.create({
      title: "DeleteTestTitle",
      description: "Some description",
      category_id: data._id,
    });

    // Assertion style
    chai.should();

    chai.use(chaiHttp);

    describe("Issues DELETE route", () => {
      describe("DELETE /issues/delete/:id", () => {
        it("It should DELETE issue by ID", (done) => {
          Issue.findOne()
            .exec()
            .then((data) => {
              chai
                .request(app)
                .delete("/issues/delete/" + data._id)
                .end((err, res) => {
                  res.should.have.status(202);
                  done();
                });
            })
            .catch((err) => console.log(err));
        });
        it("It should NOT DELETE issue (id is invalid)", (done) => {
          chai
            .request(app)
            .delete("/issues/delete/adsfaskwai12")
            .end((err, res) => {
              res.should.have.status(404);
              done();
            });
        });

        it("It should NOT DELETE issue (ID is empty)", (done) => {
          chai
            .request(app)
            .delete("/issues/delete")
            .end((err, res) => {
              res.should.have.status(404);
              done();
            });
        });
      });
    });
  })
  .catch((err) => console.log(err));
