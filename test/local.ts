const { handler } = require("../src/index");

handler({}, { succeed: console.log, fail: console.log, done: console.log });
