import * as client from "./api_client";

function cleanUpText(input: string) {
  return input
    .replace("to/from", "to or from")
    .replace("/", " ")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
    .replace(/\b([sS][tT])\b/g, "street")
    .replace(/\b([iI][nN][bB])\b\./g, "inbound")
    .replace(/\r\n\r\n/g, ' <break time="1s"/> ')
    .replace(/\r\n/g, ' <break time="1s"/> ');
}

type RouteType = number | null;

type APIAlertAttributes = {
  description: string | null;
  effect: string;
  header: string;
  informed_entity: { stop: string | null; route_type: RouteType, route: string | null}[];
  lifecycle: string;
  updated_at: string;
};

type StopId = string;

export type Alert = {
  id: string;
  type: string;
  lifecycle: string;
  description: string;
  entities: Entity[];
  updatedAt: number;
};

type Entity = {
  stop_name: string;
  route: Line;
}

type Response = {
  alerts: Alert[];
};


type RouteId = string;
type Line = "red" | "orange" | "green" | "blue" | "silver" | "commuter";

function config(item: string) {
  return process.env[item]!;
}

function getLine(line: string, line_id: Line) {
  return config(line)
    .split(",")
    .map((item) => {
      return { line: item.trim(), id: line_id };
    });
}  const route_ids = [
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


export const get = (apiKey: string): Promise<Response> => {
  const url = new URL("/alerts", client.base());
  url.searchParams.append(
    "fields[alert]",
    "updated_at,effect,description,header,informed_entity,lifecycle"
  );
  url.searchParams.append("fields[route]", "id");
  url.searchParams.append("include", "stops");
  url.searchParams.append("api_key", apiKey);

  return client.get(url).then((response) => {
    const stops = response.included!.filter((included) => included.type == "stop").reduce(
    (acc, stop) => {
      if ((stop.attributes.location_type === 1) && stop.attributes.name) {
        acc[stop.id] = stop.attributes.name as string | null;
      }
      return acc;
    },
    {} as Record<StopId, string | null>
  );
    const alerts = response.data
      .filter((alert) => {
        return (
          alert.attributes.effect === "ELEVATOR_CLOSURE" ||
          alert.attributes.effect === "ESCALATOR_CLOSURE" ||
          alert.attributes.effect === "ACCESS_ISSUE"
        );
      })
      .map((alert) => {
        const attributes = alert.attributes as APIAlertAttributes;
        const description = [
          cleanUpText(attributes.header),
          ".",
          cleanUpText(attributes.description ?? ""),
          '<break time="1s"/>',
        ].join(" ");

        const entityMap = new Map<string, Entity>();
        attributes.informed_entity
          .forEach((entity) => {
            const stopName = stops[entity.stop!];
            const line = routes_table[entity.route!];
            const key = `${stopName}-${line!}`;
            if (stopName && line && !entityMap.has(key)) {
              console.log( { stop_name: stopName!, route: entity.route!, stop_id: entity.stop!, route_type: entity.route_type! });
              entityMap.set(key, { stop_name: stopName!, route: line });
            }
          });
        const alert_entities = Array.from(entityMap.values());

        console.log(entityMap);
        return {
          id: alert.id,
          type: attributes.effect.toLowerCase().replace("_", " "),
          lifecycle: attributes.lifecycle,
          description: description,
          entities: alert_entities,
          updatedAt: new Date(attributes.updated_at).getTime(),
        };
      })
      .filter((alert) => alert.entities.length > 0);
    return {
      alerts: alerts,
    };
  });
};
