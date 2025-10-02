import type {
  ConnectContactFlowEvent,
  ConnectContactFlowResult,
  Context,
} from "aws-lambda";
import context from "aws-lambda-mock-context";
import { handler } from "../src/index";

type MockContext = Context & {
  Promise: Promise<ConnectContactFlowResult>;
};

const mockEvent: ConnectContactFlowEvent = {
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

const mockContext = context({ timeout: 1 }) as MockContext;

handler(mockEvent, mockContext, () => undefined);

mockContext.Promise.then(console.log).catch(console.log);
