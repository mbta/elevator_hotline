import type { ConnectContactFlowHandler } from "aws-lambda";
import * as Sentry from "@sentry/node";
import lambda from "./lambda";
import * as secret from "./secret";

export const handler: ConnectContactFlowHandler = async () => {
  const dsn = process.env.SENTRY_DSN;
  Sentry.init({ dsn: dsn });

  try {
    if (process.env.NODE_ENV !== "local") {
      process.env.API_KEY = await secret.get(
        "elevator-hotline-" + process.env.NODE_ENV + "-api-v3-key"
      );
    }

    return await lambda();
  } catch (error) {
    console.log("Error: " + error);
    Sentry.captureException(error);
    await Sentry.flush(2000);
    throw error;
  }
};
