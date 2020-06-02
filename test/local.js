let lambda = require("../index.js");
let context = function () {
  return {
    succeed: function (result) {
      console.log(result);
    },
    fail: function (err) {
      console.log(err);
    },
    done: function (err, result) {
      console.log(err, result);
    },
  };
};

let thisContext = new context();

lambda.handler({}, thisContext);
