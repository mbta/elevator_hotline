const lambda = require("./src/lambda.js");
const Sentry = require("@sentry/node");
const secret = require("./src/secret.js");

("use strict");

function initHandler(lambdaHandler) {
  if (process.env.NODE_ENV !== "prod" && process.env.NODE_ENV !== "dev") {
    const dotenv = require("dotenv");
    const fs = require("fs");

    dotenv.config();
    if (fs.existsSync(".env.override")) {
      const envConfig = dotenv.parse(fs.readFileSync(".env.override"));
      for (const k in envConfig) {
        process.env[k] = envConfig[k];
      }
    }
  }

  const dsn = process.env.SENTRY_DSN;
  Sentry.init({ dsn: dsn });

  return async (event, context) => {
    try {
      if (process.env.NODE_ENV == "prod" || process.env.NODE_ENV == "dev") {
        process.env.API_KEY = await secret.get(
          "elevator-hotline-" + process.env.NODE_ENV + "-api-v3-key"
        );
      }

      return await lambdaHandler(event, context);
    } catch (error) {
      console.log("Error: " + error);
      Sentry.captureException(error);
      await Sentry.flush(2000);
    }
    context.succeed({ status: 500 });
  };
}

exports.handler = initHandler((event, context) => {
  return lambda.run(event, context);
});
