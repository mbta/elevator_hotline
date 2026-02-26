import type {
  Callback,
  ConnectContactFlowEvent,
  ConnectContactFlowHandler,
  ConnectContactFlowResult,
  Context,
} from "aws-lambda";

const event: ConnectContactFlowEvent = {
  Name: "ContactFlowEvent",
  Details: {
    ContactData: {
      Attributes: {},
      Channel: "VOICE",
      ContactId: "",
      CustomerEndpoint: null,
      InitialContactId: "",
      InitiationMethod: "INBOUND",
      InstanceARN: "",
      PreviousContactId: "",
      Queue: null,
      SystemEndpoint: null,
      MediaStreams: {
        Customer: {
          Audio: null,
        },
      },
    },
    Parameters: {},
  },
};

const context: Context = {
  awsRequestId: "request-id",
  callbackWaitsForEmptyEventLoop: true,
  done: () => {
    throw new Error("deprecated");
  },
  fail: () => {
    throw new Error("deprecated");
  },
  functionName: "elevator-hotline",
  functionVersion: "$LATEST",
  getRemainingTimeInMillis: () => 1000,
  invokedFunctionArn:
    "arn:aws:lambda:us-east-1:123456789012:function:elevator-hotline:$LATEST",
  logGroupName: "/aws/lambda/$LATEST",
  logStreamName: "2020-01-01/[$LATEST]/test",
  memoryLimitInMB: "128",
  succeed: () => {
    throw new Error("deprecated");
  },
};

const callback: Callback<ConnectContactFlowResult> = () => undefined;

export const call = (handler: ConnectContactFlowHandler) =>
  handler(event, context, callback);
