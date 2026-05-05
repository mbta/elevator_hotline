import * as client from "./api_client";
import { routesToLine, Line } from "./routes";

type APIAlertAttributes = {
  description: string | null;
  effect: string;
  header: string;
  informed_entity: { stop: string; route: string | null }[];
  lifecycle: string;
  updated_at: string;
};

type StopId = string;

type StopToName = Record<StopId, string>;

type Entity = {
  stop_name: string;
  line: Line;
};

export type Alert = {
  id: string;
  type: string;
  lifecycle: string;
  description: string;
  entities: Entity[];
  updatedAt: number;
};

const validAlertEffects = [
  "ELEVATOR_CLOSURE",
  "ESCALATOR_CLOSURE",
  "ACCESS_ISSUE",
];

export const get = (apiKey: string): Promise<Alert[]> => {
  const url = new URL("/alerts", client.base());
  url.searchParams.append(
    "fields[alert]",
    "updated_at,effect,description,header,informed_entity,lifecycle"
  );
  url.searchParams.append("fields[route]", "id");
  url.searchParams.append("include", "stops");
  url.searchParams.append("api_key", apiKey);

  return client.get(url).then((response) => {
    // Map parent station IDs to stop name to use when rendering alerts
    const stopsToName = response.included
      ? response
          .included!.filter((included) => included.type == "stop")
          .reduce((acc, stop) => {
            if (stop.attributes.location_type === 1 && stop.attributes.name) {
              acc[stop.id] = stop.attributes.name as string;
            }
            return acc;
          }, {} as StopToName)
      : {};

    return response.data
      .filter((alert) => {
        const attributes = alert.attributes as APIAlertAttributes;
        return validAlertEffects.includes(attributes.effect);
      })
      .map((alert) => {
        const attributes = alert.attributes as APIAlertAttributes;
        const description = [
          cleanUpText(attributes.header),
          ".",
          cleanUpText(attributes.description ?? ""),
          '<break time="1s"/>',
        ].join(" ");

        // Find each unique Stop and Line affected by the alert,
        // and filter down to only include those Entities
        const entityMap = new Map<string, Entity>();
        attributes.informed_entity.forEach((entity) => {
          const stopName = stopsToName[entity.stop];
          const line = routesToLine[entity.route!];
          const key = `${stopName}-${line}`;
          if (stopName && line && !entityMap.has(key)) {
            entityMap.set(key, { stop_name: stopName!, line: line });
          }
        });

        return {
          id: alert.id,
          type: attributes.effect.toLowerCase().replace("_", " "),
          lifecycle: attributes.lifecycle,
          description: description,
          entities: Array.from(entityMap.values()),
          updatedAt: new Date(attributes.updated_at).getTime(),
        };
      })
      .filter((alert) => alert.entities.length > 0);
  });
};

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
