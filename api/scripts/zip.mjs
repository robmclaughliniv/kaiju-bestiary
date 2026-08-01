import { execSync } from "node:child_process";
import { existsSync } from "node:fs";

if (!existsSync("dist/index.mjs")) {
  console.error("Run npm run build first");
  process.exit(1);
}

execSync("zip -j api.zip dist/index.mjs", { stdio: "inherit" });
console.log("Created api/api.zip");
