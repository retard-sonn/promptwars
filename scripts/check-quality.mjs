import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const violations = [];
async function inspect(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) await inspect(file);
    else if (/\.(ts|tsx|css)$/.test(entry.name)) {
      const lines = (await readFile(file, "utf8")).split("\n").length;
      if (lines >= 300)
        violations.push(`${file}:${lines} exceeds the 300-line project limit`);
    }
  }
}
await inspect("src");
if (violations.length) {
  console.error(violations.join("\n"));
  process.exitCode = 1;
} else {
  console.log("Quality check passed.");
}
