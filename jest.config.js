import { createDefaultPreset } from "ts-jest";

/** @type {import("jest").Config} **/
const config = {
  ...createDefaultPreset(),
  testEnvironment: "node",
};

export default config;
