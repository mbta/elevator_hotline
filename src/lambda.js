const alerts = require("./alerts.js");
const routes = require("./routes.js");

function config(item) {
  return process.env[item];
}

function getLine(line, line_id) {
  return config(line)
    .split(",")
    .map((item) => {
      return { line: item.trim(), id: line_id };
    });
}

function defaultMessage(line) {
  return ["<speak>", config("OPERATIONAL_MESSAGE"), line, "</speak>"].join(" ");
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
  if (type_order(a.type) > type_order(b.type)) {
    return -1;
  } else if (type_order(a.type) < type_order(b.type)) {
    return 1;
  } else {
    if (lifecycle_order(a.lifecycle) > lifecycle_order(b.lifecycle)) {
      return -1;
    } else if (lifecycle_order(a.lifecycle) < lifecycle_order(b.lifecycle)) {
      return 1;
    } else {
      if (a.updatedAt > b.updatedAt) {
        return -1;
      } else if (b.updatedAt > a.updatedAt) {
        return 1;
      } else {
        return 0;
      }
    }
  }
}

exports.run = function (event, context) {
  const operational = config("OPERATIONAL_MESSAGE");
  const route_ids = [
    getLine("LINE_RED", "red"),
    getLine("LINE_ORANGE", "orange"),
    getLine("LINE_GREEN", "green"),
    getLine("LINE_BLUE", "blue"),
    getLine("LINE_SILVER", "silver"),
    getLine("LINE_COMMUTER", "commuter"),
  ].reduce((acc, val) => [...acc, ...val], []);

  const routes_table = route_ids.reduce((acc, route) => {
    acc[route.line] = route.id;
    return acc;
  }, {});

  return alerts.get(config("API_KEY")).then((alertsResponse) => {
    const requests = alertsResponse.entities.map((entity) =>
      routes.get(config("API_KEY"), entity)
    );
    return Promise.all(requests).then((requests) => {
      const stops = requests.reduce((acc, response) => {
        acc[response.stop] = {
          name: response.name,
          routes: Object.keys(
            response.routes.reduce((acc, route) => {
              acc[routes_table[route]] = true;
              return acc;
            }, {})
          ),
        };
        return acc;
      }, {});

      const lines = alertsResponse.alerts.reduce(
        (acc, alert) => {
          alert.station = alert.entities.find((entity) => {
            return stops[entity].routes.length != 0;
          });
          if (stops[alert.station]) {
            alert.name = stops[alert.station].name;
            stops[alert.station].routes.map((route) => acc[route].push(alert));
          } else {
            console.log(
              "Error: Alert for a station not in routes " +
                JSON.stringify(alert)
            );
          }
          return acc;
        },
        {
          red: [],
          orange: [],
          green: [],
          blue: [],
          silver: [],
          commuter: [],
        }
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
      Object.keys(lines).map((line) => {
        lines[line].sort((a, b) => compare_types(a, b));
        if (lines[line].length != 0) {
          output[line] = "<speak>";
        }
        lines[line].map(
          (alert) =>
            (output[line] = [
              output[line],
              '<emphasis level="moderate"> ',
              alert.name,
              " </emphasis> ",
              alert.lifecycle.toLowerCase(),
              " ",
              alert.type,
              ' <break time="1s"/> ',
              alert.description,
            ].join(""))
        );
        if (lines[line].length != 0) {
          output[line] = output[line] + " </speak>";
        }
      });
      context.succeed(output);
      return output;
    });
  });
};
