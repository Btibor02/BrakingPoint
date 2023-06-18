/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:8080",
    chromeWebSecurity: false,
    specPattern: "cypress/e2e/**/*.spec.*",
    supportFile: "cypress/support/e2e.ts",
    video: false,
    screenshotOnRunFailure: false,
    // setupNodeEvents(on, config) {
    //   // implement node event listeners here
    // },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
