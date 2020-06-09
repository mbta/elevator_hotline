const https = require("https");

exports.base = function () {
  return process.env.MBTA_API;
};

exports.get = async function (url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk.toString()));
      res.on("error", reject);
      res.on("end", () => {
        if (res.statusCode >= 200 && res.statusCode <= 299) {
          resolve(JSON.parse(body));
        } else {
          reject(res.body);
        }
      });
    });
    req.on("error", reject);
    req.end();
  });
};
