const alerts = require("./alerts.js");
const routes = require("./routes.js");

function config(item) {
  return process.env[item];
}

function getLine(line, line_id) {
  return config(line)
    .split(",")
    .map((item) => {
      return [item.trim(), line_id];
    });
}

function defaultMessage(line) {
  return `<speak> ${config("OPERATIONAL_MESSAGE")} ${line} </speak>`;
}

function lifecycle_order(lifecycle) {
  if (lifecycle == "NEW") return 4;
  if (lifecycle == "ONGOING_UPCOMING") return 3;
  if (lifecycle == "ONGOING") return 2;
  if (lifecycle == "UPCOMING") return 1;
  return 0;
}

function type_order(type) {
  if (type == "elevator closure") return 3;
  if (type == "escalator closure") return 2;
  if (type == "access issue") return 1;
}

function compare_types(a, b) {
  const a_type_order = type_order(a.type);
  const b_type_order = type_order(b.type);
  if (a_type_order != b_type_order) {
    return b_type_order - a_type_order;
  } else {
    const a_lifecycle_order = lifecycle_order(a.lifecycle);
    const b_lifecycle_order = lifecycle_order(b.lifecycle);
    if (a_lifecycle_order > b_lifecycle_order) {
      return b_lifecycle_order - a_lifecycle_order;
    } else {
      // most recently updated first
      return b.updatedAt - a.updatedAt;
    }
  }
}
function time(name, fn) {
  const start = process.hrtime();
  const result = fn();
  const [seconds, nanoseconds] = process.hrtime(start);
  console.log(name, " took ", seconds, "s, ", nanoseconds / 1000000, "ms");
  return result;
}

const RED = Symbol("red");
const ORANGE = Symbol("orange");
const GREEN = Symbol("green");
const BLUE = Symbol("blue");
const SILVER = Symbol("silver");
const COMMUTER = Symbol("commuter");

exports.run = function (event, context) {
  const route_ids = [
    getLine("LINE_RED", RED),
    getLine("LINE_ORANGE", ORANGE),
    getLine("LINE_GREEN", GREEN),
    getLine("LINE_BLUE", BLUE),
    getLine("LINE_SILVER", SILVER),
    getLine("LINE_COMMUTER", COMMUTER),
  ].reduce((acc, val) => [...acc, ...val], []);

  const routes_table = new Map(route_ids);

  return alerts.get(config("API_KEY")).then((alertsResponse) => {
    const routeQueries = alertsResponse.entities.map((entity) =>
      routes.get(config("API_KEY"), entity).then((response) => [
        response.stop,
        {
          stop: response.stop,
          name: response.name,
          routes: new Set(
            response.routes.map((route) => routes_table.get(route))
          ),
        },
      ])
    );
    return Promise.all(routeQueries).then((responses) => {
      const stops = new Map(responses);
      const lines = alertsResponse.alerts.reduce(
        (acc, alert) => {
          const station = alert.entities.find((entity) => {
            const stop = stops.get(entity);
            if (stop && stop.routes.size != 0) {
              for (let route of stop.routes) {
                if (acc.has(route)) {
                  return true;
                }
              }
            }
            return false;
          });
          if (station) {
            const stop = stops.get(station);
            alert.stopName = stop.name;
            for (let route of stop.routes) {
              if (acc.has(route)) {
                acc.get(route).push(alert);
              }
            }
          } else {
            console.log(
              "Error: Alert for a station not in routes " +
                JSON.stringify(alert)
            );
          }
          return acc;
        },
        new Map([
          [RED, []],
          [ORANGE, []],
          [GREEN, []],
          [BLUE, []],
          [SILVER, []],
          [COMMUTER, []],
        ])
      );

      let output = {
        status: 200,
        red: defaultMessage("red line"),
        orange: defaultMessage("orange line"),
        green: defaultMessage("green line"),
        blue: defaultMessage("blue line"),
        silver: defaultMessage("silver line"),
        commuter: defaultMessage("commuter rail"),
      };
      for (let [line, alerts] of lines) {
        alerts.sort((a, b) => compare_types(a, b));
        const speech = alerts.map(
          (alert) =>
            `<emphasis level="moderate"> ${
              alert.stopName
            } </emphasis> ${alert.lifecycle.toLowerCase()} ${
              alert.type
            } <break time="1s"/> ${alert.description}`
        );
        if (speech.length) {
          output[line.description] = `<speak>${speech.join("")} </speak>`;
        }
      }
      context.succeed(output);
      return output;
    });
  });
};
