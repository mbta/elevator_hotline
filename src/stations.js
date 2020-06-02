const client = require("./api_client.js");

exports.get = (line, routes) => {
  const url = new URL("/stops", client.base());
  url.searchParams.append("fields[stop]", "name");
  url.searchParams.append("filter[route]", routes.join(","));

  return client.get(url).then((response) => {
    const stations = response.data.map((station) => {
      return { id: station.id, name: station.attributes.name };
    });
    return { id: line, stations: stations };
  });
};
