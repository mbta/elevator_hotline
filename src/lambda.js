const alerts = require("./alerts.js");
const stations = require("./stations.js");

function config(item) {
  return process.env[item];
}

function getLine(line) {
  return config(line)
    .split(",")
    .map((item) => item.trim());
}

function defaultMessage(line) {
  return [config("OPERATIONAL_MESSAGE"), line, ""].join(" ");
}

function mergeAlertsAndStationsData(responses) {
  return responses.reduce(
    (acc, response) => {
      if (response.id === "alerts") {
        if (response.alerts.length == 0) {
          console.log(
            "Error: alerts returned no alerts when called, probably a problem."
          );
        }
        acc.alerts = response.alerts;
      } else {
        if (response.stations.length == 0) {
          console.log(
            "Error: " + response.id + " returned no stations when called."
          );
        }
        response.stations.map((station) => {
          if (!(station.id in acc.stations)) {
            acc.stations[station.id] = [];
          }
          acc.stations[station.id].push({
            line: response.id,
            name: station.name,
          });
        });
      }
      return acc;
    },
    { stations: {} }
  );
}

function groupAlertsByLineAndStation(data) {
  // Sort alerts to line and specific station. Put multiple alerts for a station into one object
  // alerts are sorted by date newest first.
  const processed = data.alerts.reduce((acc, alert) => {
    for (var i = 0; i < alert.stations.length; i++) {
      if (alert.stations[i] in data.stations) {
        alert.found = true;
        data.stations[alert.stations[i]].map((station) => {
          const line = station.line;
          if (!(line in acc)) {
            acc[line] = {};
          }
          if (!(station.name in acc[line])) {
            acc[line][station.name] = {
              line: line,
              name: station.name,
              descriptions: [alert.description],
              updatedAt: alert.updatedAt,
            };
          } else {
            if (acc[line][station.name].updatedAt > alert.updatedAt) {
              acc[line][station.name].descriptions.push(alert.description);
            } else {
              acc[line][station.name].descriptions.unshift(alert.description);
              acc[line][station.name].updatedAt = alert.updatedAt;
            }
          }
        });
      }
    }
    return acc;
  }, {});

  data.alerts.map((alert) => {
    if (alert.found != true) {
      console.log(
        "Error: Alert for a station not in routes " + JSON.stringify(alert)
      );
    }
  });
  return processed;
}

function finalSort(data) {
  const defaults = {
    status: 200,
    red: defaultMessage("red line"),
    orange: defaultMessage("orange line"),
    green: defaultMessage("green line"),
    blue: defaultMessage("blue line"),
    silver: defaultMessage("silver line"),
    commuter: defaultMessage("commuter rail"),
  };

  // Sort alerts for a line by date and format final output
  return Object.keys(data).reduce((acc, line) => {
    const line_alerts = Object.values(data[line])
      .sort((a, b) => {
        a = a.updatedAt;
        b = b.updatedAt;
        return a > b ? -1 : a < b ? 1 : 0;
      })
      .map((station) =>
        [station.name, ". ", station.descriptions.join(". ")].join(" ")
      )
      .join(". ");

    if (line_alerts !== "") {
      acc[line] = line_alerts;
    }
    return acc;
  }, defaults);
}

exports.run = function (event, context) {
  const operational = config("OPERATIONAL_MESSAGE");
  const requests = [
    alerts.get(),
    stations.get("red", getLine("LINE_RED")),
    stations.get("orange", getLine("LINE_ORANGE")),
    stations.get("green", getLine("LINE_GREEN")),
    stations.get("blue", getLine("LINE_BLUE")),
    stations.get("silver", getLine("LINE_SILVER")),
    stations.get("commuter", getLine("LINE_COMMUTER")),
  ];

  return Promise.all(requests)
    .then((responses) => {
      const mbtaData = mergeAlertsAndStationsData(responses);
      const groupData = groupAlertsByLineAndStation(mbtaData);
      const output = finalSort(groupData);

      context.succeed(output);
    })
    .catch((error) => {
      console.log("Error: " + error);
      context.succeed({ status: 500 });
    });
};
