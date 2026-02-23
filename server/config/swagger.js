const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "ConnectSphere API",
      version: "1.0.0",
      description: "API documentation for ConnectSphere social media platform",
      contact: {
        name: "Sharath",
        email: "[sharath@gm.com]",
        url: "https://yourwebsite.com",
      },
    },
    servers: [
      {
        url: "http://localhost:8080",
        description: "Development server",
      },
      {
        url: "https://api.connectsphere.com",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  // Path to the API docs
  apis: [
    path.join(__dirname, "../Routes/*.js"),
    path.join(__dirname, "../server.js"),
  ],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = { swaggerUi, swaggerDocs };
