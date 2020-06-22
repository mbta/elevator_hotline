const lambda = require("./src/lambda.js");
const Sentry = require("@sentry/node");

("use strict");

function initHandler(lambdaHandler) {
  if (process.env.NODE_ENV !== "prod" && process.env.NODE_ENV !== "dev") {
    require("dotenv").config();
  }
  const dsn = process.env.SENTRY_DSN;
  Sentry.init({ dsn: dsn });

  return async (event, context) => {
    try {
      console.log("WORK");
      return await lambdaHandler(event, context);
    } catch (error) {
      console.log("WORKWORK");
      Sentry.captureException(error);
      await Sentry.flush(2000);
    }
    context.succeed({ status: 500 });
  };
}

exports.handler = initHandler((event, context) => {
  return lambda.run(event, context);
});
