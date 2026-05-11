import { expect, jest, test } from "@jest/globals";
import { handler } from "../src/index";
import * as api_client from "../src/api_client";
import * as data from "./data";
import { call } from "./mock";

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

test("logs error if http client fails", async () => {
  console.log = jest.fn();
  const msg = "Service Unavailable";
  jest.spyOn(api_client, "get").mockImplementation(() => Promise.reject(msg));

  try {
    await call(handler);
  } catch (error) {
    expect(error).toEqual(msg);
  }

  expect(console.log).toHaveBeenCalledWith(`Error: ${msg}`);
});

test("if http client gets no alerts responds all lines okay", async () => {
  jest.spyOn(api_client, "get").mockImplementation((url) => {
    if (url.pathname == "/alerts") {
      return Promise.resolve(data.no_alerts());
    } else return Promise.reject();
  });

  expect(await call(handler)).toStrictEqual(no_outages);
});

test("if http client gets a bus station alert, responds all lines okay", async () => {
  jest.spyOn(api_client, "get").mockImplementation((url) => {
    if (url.pathname == "/alerts") {
      return Promise.resolve(data.bus_station_alert());
    } else return Promise.reject();
  });

  expect(await call(handler)).toStrictEqual(no_outages);
});

test("filter out alerts with unsupported routes", async () => {
  jest.spyOn(api_client, "get").mockImplementation((url) => {
    if (url.pathname == "/alerts") {
      return Promise.resolve(data.unsupported_route_alert());
    } else return Promise.reject();
  });

  expect(await call(handler)).toStrictEqual(no_outages);
});

test("render one alert", async () => {
  jest.spyOn(api_client, "get").mockImplementation((url) => {
    if (url.pathname == "/alerts") {
      return Promise.resolve(data.one_alert());
    } else return Promise.reject();
  });

  expect(await call(handler)).toStrictEqual({
    blue: no_outages.blue,
    commuter: no_outages.commuter,
    green: no_outages.green,
    orange: no_outages.orange,
    red: quincy_adams_example,
    silver: no_outages.silver,
    status: no_outages.status,
  });
});

test("render one alert across multiple lines", async () => {
  jest.spyOn(api_client, "get").mockImplementation((url) => {
    if (url.pathname == "/alerts") {
      return Promise.resolve(data.one_alert_multiple_lines());
    } else return Promise.reject();
  });

  expect(await call(handler)).toStrictEqual({
    blue: no_outages.blue,
    commuter: no_outages.commuter,
    green: north_example,
    orange: north_example,
    red: no_outages.red,
    silver: no_outages.silver,
    status: no_outages.status,
  });
});

test("render multiple alerts across multiple lines", async () => {
  jest.spyOn(api_client, "get").mockImplementation((url) => {
    if (url.pathname == "/alerts") {
      return Promise.resolve(data.many_alerts());
    } else return Promise.reject();
  });

  expect(await call(handler)).toStrictEqual({
    blue: no_outages.blue,
    commuter: no_outages.commuter,
    green: north_example,
    orange: north_example,
    red: quincy_adams_example,
    silver: no_outages.silver,
    status: no_outages.status,
  });
});

test("only show alerts for elevator or escalator closure", async () => {
  jest.spyOn(api_client, "get").mockImplementation((url) => {
    if (url.pathname == "/alerts") {
      return Promise.resolve(data.not_alert());
    } else return Promise.reject();
  });

  expect(await call(handler)).toStrictEqual(no_outages);
});

test("sorts multiple alerts across multiple lines correctly", async () => {
  jest.spyOn(api_client, "get").mockImplementation((url) => {
    if (url.pathname == "/alerts") {
      return Promise.resolve(data.many_alerts_for_sort());
    } else return Promise.reject();
  });

  expect(await call(handler)).toStrictEqual({
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
