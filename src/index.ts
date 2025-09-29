import type {
  ConnectContactFlowEvent,
  ConnectContactFlowHandler,
  Context,
} from "aws-lambda";
import * as Sentry from "@sentry/node";
import lambda from "./lambda";
import * as secret from "./secret";

function initHandler(lambdaHandler: typeof lambda) {
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

  return async (event: ConnectContactFlowEvent, context: Context) => {
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
    context.succeed({ status: "500" });
    return { status: "500" };
  };
}

export const handler: ConnectContactFlowHandler = initHandler(lambda);
