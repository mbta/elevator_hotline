import * as Sentry from "@sentry/node";
import { Alert, get as getAlerts } from "./alerts";

type Line = "red" | "orange" | "green" | "blue" | "silver" | "commuter";
type RouteId = string;

type AlertWithStopName = Alert & {
  stop_name?: string | null;
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

function compare_types(a: Alert, b: Alert) {
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

  const alertsResponse = await getAlerts(config("API_KEY"));

  const lines = alertsResponse.alerts.reduce(
    (acc, alert: AlertWithStopName) => {        
      alert.entities.map((entity) => {
          alert.stop_name = entity.stop_name;
            acc[entity.route].push(alert);

    })

      return acc;
    },
    {
      red: [],
      orange: [],
      green: [],
      blue: [],
      silver: [],
      commuter: [],
    } as Record<Line, AlertWithStopName[]>
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
          alert.stop_name,
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
