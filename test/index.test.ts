import type { Context, Handler } from "aws-lambda";
import context from "aws-lambda-mock-context";
import { promisify } from "node:util";
import { handler } from "../src/index";
import * as api_client from "../src/api_client";
import * as data from "./data";

const pifyHandler = (fn: Handler) => {
  // The claimed return type of `context` doesn't include the mock-specific
  // `Promise` field, which this helper uses, so a type assertion is needed
  const ctx = context({ timeout: 0.5 }) as Context & { Promise: unknown };
  return (event: unknown) =>
    Promise.race([promisify(fn)(event, ctx), ctx.Promise]);
};

const no_outages = {
  blue: "<speak> Currently there are no outages reported for the  blue line </speak>",
  commuter:
    "<speak> Currently there are no outages reported for the  commuter rail </speak>",
  green:
    "<speak> Currently there are no outages reported for the  green line </speak>",
  orange:
    "<speak> Currently there are no outages reported for the  orange line </speak>",
  red: "<speak> Currently there are no outages reported for the  red line </speak>",
  silver:
    "<speak> Currently there are no outages reported for the  silver line </speak>",
  status: "200",
};

const north_example =
  '<speak><emphasis level="moderate"> North Station </emphasis> ongoing elevator closure <break time="1s"/> Example header. . example description <break time="1s"/> </speak>';

const quincy_adams_example =
  '<speak><emphasis level="moderate"> Quincy Adams </emphasis> ongoing elevator closure <break time="1s"/> Example header. . example description <break time="1s"/> </speak>';

test("if http client fails. lambda returns back a status 500", () => {
  jest.spyOn(api_client, "get").mockImplementation(() => Promise.reject());
  console.log = jest.fn();

  const fn = pifyHandler(handler);
  return fn({}).then((result) => {
    expect(console.log).toHaveBeenCalledWith("Error: undefined");
    expect(result).toStrictEqual({ status: "500" });
  });
});

test("if http client gets no alerts responds all lines okay.", () => {
  jest.spyOn(api_client, "get").mockImplementation((url) => {
    if (url.pathname == "/alerts") {
      return Promise.resolve(data.no_alerts());
    } else if (url.pathname == "/routes") {
      return Promise.resolve(data.no_station());
    } else return Promise.reject();
  });

  const fn = pifyHandler(handler);
  return fn({}).then((result) => {
    expect(result).toStrictEqual(no_outages);
  });
});

test("render one alert", () => {
  jest.spyOn(api_client, "get").mockImplementation((url) => {
    console.log(url);
    if (url.pathname == "/alerts") {
      return Promise.resolve(data.one_alert());
    } else if (url.pathname == "/routes") {
      const route = url.searchParams.get("filter[stop]");
      if (route == data.quincy_adams().included[0].id) {
        return Promise.resolve(data.quincy_adams());
      } else {
        return Promise.resolve(data.no_station());
      }
    } else return Promise.reject();
  });

  const fn = pifyHandler(handler);
  return fn({}).then((result) => {
    expect(result).toStrictEqual({
      blue: no_outages.blue,
      commuter: no_outages.commuter,
      green: no_outages.green,
      orange: no_outages.orange,
      red: quincy_adams_example,
      silver: no_outages.silver,
      status: no_outages.status,
    });
  });
});

test("render one alert across multiple lines", () => {
  jest.spyOn(api_client, "get").mockImplementation((url) => {
    if (url.pathname == "/alerts") {
      return Promise.resolve(data.one_alert());
    } else if (url.pathname == "/routes") {
      const route = url.searchParams.get("filter[stop]");
      if (route == data.north_station().included[0].id) {
        return Promise.resolve(data.north_station());
      } else {
        return Promise.resolve(data.no_station());
      }
    } else return Promise.reject();
  });
  console.log = jest.fn();

  const fn = pifyHandler(handler);
  return fn({}).then((result) => {
    expect(result).toStrictEqual({
      blue: no_outages.blue,
      commuter: no_outages.commuter,
      green: north_example,
      orange: north_example,
      red: no_outages.red,
      silver: no_outages.silver,
      status: no_outages.status,
    });
  });
});

test("render multiple alerts across multiple lines", () => {
  jest.spyOn(api_client, "get").mockImplementation((url) => {
    if (url.pathname == "/alerts") {
      return Promise.resolve(data.many_alerts());
    } else if (url.pathname == "/routes") {
      const route = url.searchParams.get("filter[stop]");
      if (route == data.north_station().included[0].id) {
        return Promise.resolve(data.north_station());
      } else if (route == data.quincy_adams().included[0].id) {
        return Promise.resolve(data.quincy_adams());
      } else {
        return Promise.resolve(data.no_station());
      }
    } else return Promise.reject();
  });

  const fn = pifyHandler(handler);
  return fn({}).then((result) => {
    expect(result).toStrictEqual({
      blue: no_outages.blue,
      commuter: no_outages.commuter,
      green: north_example,
      orange: north_example,
      red: quincy_adams_example,
      silver: no_outages.silver,
      status: no_outages.status,
    });
  });
});

test("only show alerts for elevator or escalator closure", () => {
  jest.spyOn(api_client, "get").mockImplementation((url) => {
    if (url.pathname == "/alerts") {
      return Promise.resolve(data.not_alert());
    } else if (url.pathname == "/routes") {
      const route = url.searchParams.get("filter[stop]");
      if (route == data.north_station().included[0].id) {
        return Promise.resolve(data.north_station());
      } else {
        return Promise.resolve(data.no_station());
      }
    } else return Promise.reject();
  });

  const fn = pifyHandler(handler);
  return fn({}).then((result) => {
    expect(result).toStrictEqual(no_outages);
  });
});

test("warn on unmatched alert, but still return correctly", () => {
  jest.spyOn(api_client, "get").mockImplementation((url) => {
    if (url.pathname == "/alerts") {
      return Promise.resolve(data.unmatched_alert());
    } else if (url.pathname == "/routes") {
      const route = url.searchParams.get("filter[stop]");
      if (route == data.north_station().included[0].id) {
        return Promise.resolve(data.north_station());
      } else {
        return Promise.resolve(data.no_station());
      }
    } else return Promise.reject();
  });
  console.log = jest.fn();

  const fn = pifyHandler(handler);
  return fn({}).then((result) => {
    expect(console.log).toHaveBeenCalledWith(
      'Error: Alert for a station not in routes {"id":"338974","type":"escalator closure","lifecycle":"ONGOING","description":"Example header. . example description <break time=\\"1s\\"/>","entities":["place-south"],"updatedAt":1575039547000}'
    );
    expect(result).toStrictEqual(no_outages);
  });
});

test("render multiple alerts across multiple lines to test sorting", () => {
  jest.spyOn(api_client, "get").mockImplementation((url) => {
    if (url.pathname == "/alerts") {
      return Promise.resolve(data.many_alerts_for_sort());
    } else if (url.pathname == "/routes") {
      const route = url.searchParams.get("filter[stop]");
      if (route == data.north_station().included[0].id) {
        return Promise.resolve(data.north_station());
      } else if (route == data.quincy_adams().included[0].id) {
        return Promise.resolve(data.quincy_adams());
      } else if (route == data.nowhere().included[0].id) {
        return Promise.resolve(data.nowhere());
      } else if (route == data.quincy_center().included[0].id) {
        return Promise.resolve(data.quincy_center());
      } else {
        return Promise.resolve(data.no_station());
      }
    } else return Promise.reject();
  });

  const fn = pifyHandler(handler);
  return fn({}).then((result) => {
    expect(result).toStrictEqual({
      blue: no_outages.blue,
      commuter: no_outages.commuter,
      green:
        '<speak><emphasis level="moderate"> North Station </emphasis> new elevator closure <break time="1s"/> Example header1. . example description new <break time="1s"/><emphasis level="moderate"> North Station </emphasis> ongoing elevator closure <break time="1s"/> Example header4. . example description <break time="1s"/> </speak>',
      orange:
        '<speak><emphasis level="moderate"> North Station </emphasis> new elevator closure <break time="1s"/> Example header1. . example description new <break time="1s"/><emphasis level="moderate"> North Station </emphasis> ongoing elevator closure <break time="1s"/> Example header4. . example description <break time="1s"/> </speak>',
      red: '<speak><emphasis level="moderate"> Quincy Adams </emphasis> ongoing elevator closure <break time="1s"/> Example header6. . example description <break time="1s"/><emphasis level="moderate"> Quincy Adams </emphasis> ongoing elevator closure <break time="1s"/> Example header5. . example description5 <break time="1s"/><emphasis level="moderate"> Quincy Center </emphasis> ongoing_upcoming escalator closure <break time="1s"/> Example header2. . example description2 <break time="1s"/><emphasis level="moderate"> Quincy Center </emphasis> ongoing_upcoming access issue <break time="1s"/> Example header3. . example description3 <break time="1s"/> </speak>',
      silver: no_outages.silver,
      status: no_outages.status,
    });
  });
});
