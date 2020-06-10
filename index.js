const lambda = require("./src/lambda.js");

("use strict");

exports.handler = function (event, context) {
  if (process.env.NODE_ENV !== "prod" && process.env.NODE_ENV !== "dev") {
    require("dotenv").config();
  }

  return lambda.run(event, context);
};
