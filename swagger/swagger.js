const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Issues API",
      description: "Issues API Information",
      contact: {
        name: "tonimatoni",
      },
      servers: ["http://localhost:3000"],
    },
  },
  apis: [`${__dirname}/../routes/*.js`],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);

exports.ui = swaggerUi;
exports.docs = swaggerDocs;
