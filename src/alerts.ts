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

type APIAlertAttributes = {
  description: string | null;
  effect: string;
  header: string;
  informed_entity: { stop: string | null }[];
  lifecycle: string;
  updated_at: string;
};

type StopId = string;

export type Alert = {
  id: string;
  type: string;
  lifecycle: string;
  description: string;
  entities: StopId[];
  updatedAt: number;
};

type Response = {
  alerts: Alert[];
  entities: StopId[];
};

export const get = (apiKey: string): Promise<Response> => {
  const url = new URL("/alerts", client.base());
  url.searchParams.append(
    "fields[alert]",
    "updated_at,effect,description,header,informed_entity,lifecycle"
  );
  url.searchParams.append("fields[activity]", "ALL");
  url.searchParams.append("api_key", apiKey);

  return client.get(url).then((response) => {
    let alert_entities: Record<string, null> = {};
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

        const entities = attributes.informed_entity.map((entity) => {
          alert_entities[entity.stop!] = null;
          return entity.stop!;
        });

        return {
          id: alert.id,
          type: attributes.effect.toLowerCase().replace("_", " "),
          lifecycle: attributes.lifecycle,
          description: description,
          entities: entities,
          updatedAt: new Date(attributes.updated_at).getTime(),
        };
      });
    if (alerts.length == 0) {
      console.log(
        "Error: alerts returned no alerts when called, probably a problem."
      );
    }
    return {
      alerts: alerts,
      entities: Object.keys(alert_entities),
    };
  });
};
