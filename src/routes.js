const client = require("./api_client.js");

exports.get = (apiKey, stop) => {
  const url = new URL("/routes", client.base());
  url.searchParams.append("fields[route]", "id");
  url.searchParams.append("fields[stop]", "name");
  url.searchParams.append("filter[stop]", stop);
  url.searchParams.append("include", "stop");
  url.searchParams.append("api_key", apiKey);
  return client.get(url).then((response) => {
    let station = null;
    if (response.included && response.included.length != 0) {
      station = response.included.map(
        (included) => included.attributes.name
      )[0];
    }

    const allRoutes = response.data.map((route) => route.id);
    return { stop: stop, name: station, routes: allRoutes };
  });
};
