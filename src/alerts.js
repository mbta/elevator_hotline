const client = require("./api_client.js");

function emptyStringIfNull(input) {
  return input ? input : "";
}

function cleanUpText(input) {
  return input
    .replace("/", " ")
    .replace(/\b([sS][tT])\b/g, "street")
    .replace(/\r\n/g, " . ");
}

exports.get = () => {
  const url = new URL("/alerts", client.base());
  url.searchParams.append(
    "fields[alert]",
    "updated_at,effect,description,header,informed_entity"
  );
  url.searchParams.append("fields[activity]", "ALL");
  return client.get(url).then((response) => {
    return {
      id: "alerts",
      alerts: response.data
        .filter((alert) => {
          return (
            alert.attributes.effect === "ELEVATOR_CLOSURE" ||
            alert.attributes.effect === "ESCALATOR_CLOSURE"
          );
        })
        .map((alert) => {
          const attributes = alert.attributes;
          const description = [
            attributes.effect.toLowerCase().replace("_", " "),
            cleanUpText(emptyStringIfNull(attributes.header)),
            ".",
            cleanUpText(emptyStringIfNull(attributes.description)),
          ].join(" ");

          const stations = attributes.informed_entity.map(
            (station) => station.stop
          );

          return {
            id: alert.id,
            description: description,
            stations: stations,
            updatedAt: new Date(attributes.updated_at).getTime(),
          };
        }),
    };
  });
};
