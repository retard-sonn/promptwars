import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const roots = ["src", "docs", "README.md"];
const extensions = new Set([".ts", ".tsx", ".js", ".mjs", ".css", ".json", ".md"]);
const banned = [
  "seamless",
  "elevate",
  "unleash",
  "empower",
  "cutting-edge",
  "revolutionize",
  "next-gen",
  "supercharge",
  "leverage",
  "robust",
  "harness",
  "powered by AI",
  "peace of mind",
  "stay safe out there",
  "world-class",
  "state-of-the-art",
  "in today's digital world",
];
const patterns = [
  { label: "em dash", expression: /\u2014/g },
  { label: "en dash", expression: /\u2013/g },
  ...banned.map((word) => ({
    label: `banned phrase: ${word}`,
    expression: new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi"),
  })),
];
const failures = [];

async function filesAt(target) {
  const entries = await readdir(target, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(target, entry.name);
    if (entry.isDirectory()) files.push(...(await filesAt(fullPath)));
    else if (extensions.has(path.extname(entry.name))) files.push(fullPath);
  }
  return files;
}

for (const root of roots) {
  let files;
  try {
    const stat = await import("node:fs/promises").then(({ stat }) => stat(root));
    files = stat.isDirectory() ? await filesAt(root) : [root];
  } catch {
    continue;
  }
  for (const file of files) {
    if (path.normalize(file) === path.normalize("docs/BRIEF.md")) continue;
    const text = await readFile(file, "utf8");
    for (const { label, expression } of patterns) {
      expression.lastIndex = 0;
      for (const match of text.matchAll(expression)) {
        const before = text.slice(0, match.index);
        const line = before.split("\n").length;
        failures.push(`${file}:${line} ${label}`);
      }
    }
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log("Copy check passed.");
}
