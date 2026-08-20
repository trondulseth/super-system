import { initStudio } from "./app.js";
import { staticBackend } from "./backend-static.js";

void initStudio(staticBackend, {
  saveLabel: "Download theme",
  demoBanner:
    "Browser demo — changes stay in this browser and download as super-system.json. Use npx @super-system/cli studio in a project for local editing."
});
