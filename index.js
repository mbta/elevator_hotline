const lambda = require("./src/lambda.js");

("use strict");

exports.handler = function (event, context) {
  if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
  }

  return lambda.run(event, context);
};
