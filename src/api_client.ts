import https from "node:https";

type JSONArray = Array<JSON>;
type JSONObject = { [key: string]: JSON };
type JSON = null | string | number | boolean | JSONArray | JSONObject;

type JSONAPICollection = {
  data: JSONAPIResource[];
  included?: JSONAPIResource[];
};

type JSONAPIResource = {
  id: string;
  type: string;
  attributes: Record<string, JSON>;
};

export const base = function () {
  return process.env.MBTA_API;
};

export const get = async function (url: URL): Promise<JSONAPICollection> {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk.toString()));
      res.on("error", reject);
      res.on("end", () => {
        if (res.statusCode == 200) {
          resolve(JSON.parse(body));
        } else {
          reject(res.statusMessage);
        }
      });
    });
    req.on("error", reject);
    req.end();
  });
};
