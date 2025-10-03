import type {
  ConnectContactFlowEvent,
  ConnectContactFlowHandler,
  Context,
} from "aws-lambda";
import * as Sentry from "@sentry/node";
import lambda from "./lambda";
import * as secret from "./secret";

function initHandler(lambdaHandler: typeof lambda) {
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
