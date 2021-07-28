const client = require("./api_client.js");

function emptyStringIfNull(input) {
  return input ? input : "";
}

function cleanUpText(input) {
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
    .replace(/\r\n(\r\n)?/g, ' <break time="1s"/> ');
}

const ALERTS_TO_USE = new Set([
  "ELEVATOR_CLOSURE",
  "ESCALATOR_CLOSURE",
  "ACCESS_ISSUE",
]);

exports.get = (apiKey) => {
  const url = new URL("/alerts", client.base());
  url.searchParams.append(
    "fields[alert]",
    "updated_at,effect,description,header,informed_entity,lifecycle"
  );
  url.searchParams.append("fields[activity]", "ALL");
  url.searchParams.append("api_key", apiKey);

  return client.get(url).then((response) => {
    let alert_entities = new Set();
    const alerts = response.data
      .filter((alert) => ALERTS_TO_USE.has(alert.attributes.effect))
      .map((alert) => {
        const attributes = alert.attributes;
        const description = `${cleanUpText(
          emptyStringIfNull(attributes.header)
        )} . ${cleanUpText(
          emptyStringIfNull(attributes.description)
        )} <break time="1s"/>`;

        const entities = attributes.informed_entity.map((entity) => {
          alert_entities.add(entity.stop);
          return entity.stop;
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
      id: "alerts",
      alerts: alerts,
      entities: [...alert_entities],
    };
  });
};
