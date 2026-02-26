import { handler } from "../src/index";
import { call } from "./mock";

(async () => {
  try {
    console.log(await call(handler));
  } catch (error) {
    console.error(error);
  }
})();
