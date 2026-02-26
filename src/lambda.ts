import * as Sentry from "@sentry/node";
import * as alerts from "./alerts";
import * as routes from "./routes";

type Line = "red" | "orange" | "green" | "blue" | "silver" | "commuter";
type RouteId = string;
type StopId = string;

type AlertWithExtras = alerts.Alert & {
  name?: string | null;
  station?: string;
};

function config(item: string) {
  return process.env[item]!;
}

function getLine(line: string, line_id: Line) {
  return config(line)
    .split(",")
    .map((item) => {
      return { line: item.trim(), id: line_id };
    });
}

function defaultMessage(line: string) {
  return ["<speak>", config("OPERATIONAL_MESSAGE"), line, "</speak>"].join(" ");
}

function lifecycle_order(lifecycle: string) {
  if (lifecycle == "NEW") return 4;
  if (lifecycle == "ONGOING_UPCOMING") return 3;
  if (lifecycle == "ONGOING") return 2;
  if (lifecycle == "UPCOMING") return 1;
  return 0;
}

function type_order(type: string) {
  if (type == "elevator closure") return 3;
  if (type == "escalator closure") return 2;
  if (type == "access issue") return 1;
  return 0;
}

function compare_types(a: AlertWithExtras, b: AlertWithExtras) {
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

const lambda = async function () {
  const route_ids = [
    getLine("LINE_RED", "red"),
    getLine("LINE_ORANGE", "orange"),
    getLine("LINE_GREEN", "green"),
    getLine("LINE_BLUE", "blue"),
    getLine("LINE_SILVER", "silver"),
    getLine("LINE_COMMUTER", "commuter"),
  ].reduce((acc, val) => [...acc, ...val], []);

  const routes_table = route_ids.reduce(
    (acc, route) => {
      acc[route.line] = route.id;
      return acc;
    },
    {} as Record<RouteId, Line>
  );

  const alertsResponse = await alerts.get(config("API_KEY"));

  const routesResponses = await Promise.all(
    alertsResponse.entities.map((entity) =>
      routes.get(config("API_KEY"), entity)
    )
  );

  const stops = routesResponses.reduce(
    (acc, response) => {
      acc[response.stop] = {
        name: response.name,
        routes: Object.keys(
          response.routes.reduce(
            (acc, route) => {
              acc[routes_table[route]] = true;
              return acc;
            },
            {} as Record<Line, true>
          )
        ) as Line[],
      };
      return acc;
    },
    {} as Record<StopId, { name: string | null; routes: Line[] }>
  );

  const lines = alertsResponse.alerts.reduce(
    (acc, alert: AlertWithExtras) => {
      alert.station = alert.entities.find((entity) => {
        if (stops[entity].routes.length != 0) {
          return stops[entity].routes.some((route) => route in acc);
        }
        return false;
      });

      if (alert.station && stops[alert.station]) {
        alert.name = stops[alert.station].name;
        stops[alert.station].routes.map((route) => {
          if (route in acc) {
            acc[route].push(alert);
          }
        });
      } else {
        const message = "Alert for a station not in routes";
        console.log(`Error: ${message} ${JSON.stringify(alert)}`);
        Sentry.captureMessage(message, { extra: alert, level: "error" });
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
    } as Record<Line, AlertWithExtras[]>
  );

  const output = {
    status: "200",
    red: defaultMessage("red line"),
    orange: defaultMessage("orange line"),
    green: defaultMessage("green line"),
    blue: defaultMessage("blue line"),
    silver: defaultMessage("silver line"),
    commuter: defaultMessage("commuter rail"),
  };

  (Object.keys(lines) as Line[]).forEach((line) => {
    lines[line].sort((a, b) => compare_types(a, b));

    if (lines[line].length != 0) output[line] = "<speak>";

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

    if (lines[line].length != 0) output[line] = output[line] + " </speak>";
  });

  return output;
};

export default lambda;
