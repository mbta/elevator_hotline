const lambda = require("../index.js");
const data = require("./data.js");
const pify = require("aws-lambda-pify");

const api_client = require("../src/api_client.js");
const no_outages = {
  blue: "Currently there are no outages reported for the  blue line ",
  commuter: "Currently there are no outages reported for the  commuter rail ",
  green: "Currently there are no outages reported for the  green line ",
  orange: "Currently there are no outages reported for the  orange line ",
  red: "Currently there are no outages reported for the  red line ",
  silver: "Currently there are no outages reported for the  silver line ",
  status: 200,
};

const north_example =
  "North Station .  elevator closure Example header. example description";

test("if http client fails. lambda returns back a status 500", () => {
  const spy = jest
    .spyOn(api_client, "get")
    .mockImplementation(() => Promise.reject());
  console.log = jest.fn();

  const fn = pify(lambda.handler);
  return fn({}).then((result) => {
    expect(console.log).toHaveBeenCalledWith("Error: undefined");
    expect(result).toStrictEqual({ status: 500 });
  });
});

test("if http client gets non api data. lambda returns back a status 500", () => {
  const spy = jest
    .spyOn(api_client, "get")
    .mockImplementation(() => Promise.resolve({ status: 500 }));
  console.log = jest.fn();
  const fn = pify(lambda.handler);

  return fn({}).then((result) => {
    expect(console.log).toHaveBeenCalledWith(
      "Error: TypeError: Cannot read property 'filter' of undefined"
    );
    expect(result).toStrictEqual({ status: 500 });
  });
});

test("if http client gets no alerts responds all lines okay.", () => {
  const spy = jest.spyOn(api_client, "get").mockImplementation((url) => {
    if (url.pathname == "/alerts") {
      return Promise.resolve(data.no_alerts());
    } else if (url.pathname == "/stops") {
      return Promise.resolve(data.no_route());
    }
  });
  console.log = jest.fn();
  const fn = pify(lambda.handler);

  return fn({}).then((result) => {
    expect(console.log).toHaveBeenCalledWith(
      "Error: alerts returned no alerts when called, probably a problem."
    );
    expect(result).toStrictEqual(no_outages);
  });
});

test("render one alert", () => {
  const spy = jest.spyOn(api_client, "get").mockImplementation((url) => {
    if (url.pathname == "/alerts") {
      return Promise.resolve(data.one_alert());
    } else if (url.pathname == "/stops") {
      const route = url.searchParams.get("filter[route]");
      if (route == data.green()) {
        return Promise.resolve(data.green_route());
      } else {
        return Promise.resolve(data.no_route());
      }
    }
  });

  const fn = pify(lambda.handler);
  return fn({}).then((result) => {
    expect(result).toStrictEqual({
      blue: no_outages.blue,
      commuter: no_outages.commuter,
      green: north_example,
      orange: no_outages.orange,
      red: no_outages.red,
      silver: no_outages.silver,
      status: no_outages.status,
    });
  });
});

test("render one alert across multiple lines", () => {
  const spy = jest.spyOn(api_client, "get").mockImplementation((url) => {
    if (url.pathname == "/alerts") {
      return Promise.resolve(data.one_alert());
    } else if (url.pathname == "/stops") {
      const route = url.searchParams.get("filter[route]");
      if (route == data.green()) {
        return Promise.resolve(data.green_route());
      } else if (route == data.orange()) {
        return Promise.resolve(data.orange_route());
      } else {
        return Promise.resolve(data.no_route());
      }
    }
  });

  const fn = pify(lambda.handler);
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
  const spy = jest.spyOn(api_client, "get").mockImplementation((url) => {
    if (url.pathname == "/alerts") {
      return Promise.resolve(data.many_alerts());
    } else if (url.pathname == "/stops") {
      const route = url.searchParams.get("filter[route]");
      if (route == data.green()) {
        return Promise.resolve(data.green_route());
      } else if (route == data.orange()) {
        return Promise.resolve(data.orange_route());
      } else {
        return Promise.resolve(data.no_route());
      }
    }
  });

  const fn = pify(lambda.handler);
  return fn({}).then((result) => {
    expect(result).toStrictEqual({
      blue: no_outages.blue,
      commuter: no_outages.commuter,
      green:
        "North Station .  elevator closure Example header3. example description3 elevator closure Example header. example description. Symphony .  elevator closure Example header2. example description2",
      orange:
        "North Station .  elevator closure Example header3. example description3 elevator closure Example header. example description",
      red: no_outages.red,
      silver: no_outages.silver,
      status: no_outages.status,
    });
  });
});

test("only show alerts for elevator or escalator closure", () => {
  const spy = jest.spyOn(api_client, "get").mockImplementation((url) => {
    if (url.pathname == "/alerts") {
      return Promise.resolve(data.not_alert());
    } else if (url.pathname == "/stops") {
      const route = url.searchParams.get("filter[route]");
      if (route == data.green()) {
        return Promise.resolve(data.green_route());
      } else if (route == data.orange()) {
        return Promise.resolve(data.orange_route());
      } else {
        return Promise.resolve(data.no_route());
      }
    }
  });

  const fn = pify(lambda.handler);
  return fn({}).then((result) => {
    expect(result).toStrictEqual(no_outages);
  });
});

test("warn on unmatched alert, but still return correctly", () => {
  const spy = jest.spyOn(api_client, "get").mockImplementation((url) => {
    if (url.pathname == "/alerts") {
      return Promise.resolve(data.unmatched_alert());
    } else if (url.pathname == "/stops") {
      const route = url.searchParams.get("filter[route]");
      if (route == data.green()) {
        return Promise.resolve(data.green_route());
      } else if (route == data.orange()) {
        return Promise.resolve(data.orange_route());
      } else {
        return Promise.resolve(data.no_route());
      }
    }
  });

  console.log = jest.fn();

  const fn = pify(lambda.handler);
  return fn({}).then((result) => {
    expect(console.log).toHaveBeenCalledWith(
      'Error: Alert for a station not in routes {"id":"338974","description":"escalator closure Example header. example description","stations":["place-south"],"updatedAt":1575039547000}'
    );
    expect(result).toStrictEqual(no_outages);
  });
});

test("warn on empty list of stations returned from api.", () => {
  const spy = jest.spyOn(api_client, "get").mockImplementation((url) => {
    if (url.pathname == "/alerts") {
      return Promise.resolve(data.no_alerts());
    } else if (url.pathname == "/stops") {
      const route = url.searchParams.get("filter[route]");
      if (route == data.green()) {
        return Promise.resolve(data.green_route());
      } else if (route == data.orange()) {
        return Promise.resolve(data.orange_route());
      } else {
        return Promise.resolve(data.no_route());
      }
    }
  });

  console.log = jest.fn();

  const fn = pify(lambda.handler);
  return fn({}).then((result) => {
    expect(console.log).toHaveBeenCalledWith(
      "Error: blue returned no stations when called."
    );
    expect(result).toStrictEqual(no_outages);
  });
});
