import { Alert, get as getAlerts } from "./alerts";
import { Line } from "./routes";

type AlertWithStopName = Alert & {
  stop_name?: string | null;
};

function config(item: string) {
  return process.env[item]!;
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
  const alertsResponse = await getAlerts(config("API_KEY"));

  const alertsByLine = alertsResponse.reduce(
    (acc, alert: Alert) => {
      alert.entities.forEach((entity) => {
        const alertWithStop: AlertWithStopName = {
          ...alert,
          stop_name: entity.stop_name,
        };
        acc[entity.line].push(alertWithStop);
      });

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

  (Object.keys(alertsByLine) as Line[]).forEach((line) => {
    alertsByLine[line].sort((a, b) => compare_types(a, b));

    if (alertsByLine[line].length !== 0) output[line] = "<speak>";

    alertsByLine[line].map(
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

    if (alertsByLine[line].length !== 0)
      output[line] = output[line] + " </speak>";
  });

  return output;
};

export default lambda;
