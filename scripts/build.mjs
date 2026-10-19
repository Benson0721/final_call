import { build } from "esbuild";
import { createHash } from "node:crypto";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = join(projectRoot, "dist");
const assetsDir = join(outputDir, "assets");

await rm(outputDir, { recursive: true, force: true });
await mkdir(assetsDir, { recursive: true });

await build({
  entryPoints: [join(projectRoot, "src", "main.tsx")],
  outfile: join(assetsDir, "app.js"),
  bundle: true,
  minify: true,
  format: "esm",
  platform: "browser",
  target: ["chrome107", "safari16"],
  jsx: "automatic",
  define: {
    "import.meta.env.PROD": "true",
  },
  legalComments: "none",
});

const sourceHtml = await readFile(join(projectRoot, "index.html"), "utf8");
const productionHtml = sourceHtml
  .replace(
    '<script type="module" src="/src/main.tsx"></script>',
    '<script type="module" src="./assets/app.js"></script>',
  )
  .replace(
    "</head>",
    '    <link rel="stylesheet" href="./assets/app.css" />\n  </head>',
  );

await writeFile(join(outputDir, "index.html"), productionHtml, "utf8");
await cp(join(projectRoot, "public"), outputDir, { recursive: true });

const buildFingerprint = createHash("sha256")
  .update(await readFile(join(outputDir, "index.html")))
  .update(await readFile(join(assetsDir, "app.js")))
  .update(await readFile(join(assetsDir, "app.css")))
  .digest("hex")
  .slice(0, 12);
const serviceWorkerPath = join(outputDir, "sw.js");
const serviceWorker = await readFile(serviceWorkerPath, "utf8");
await writeFile(
  serviceWorkerPath,
  serviceWorker.replace("__BUILD_ID__", buildFingerprint),
  "utf8",
);

console.log("Built production app in dist/");
