const fs = require("fs");
const path = require("path");

function walk(dir) {
  let out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) out = out.concat(walk(p));
    else out.push(p);
  }
  return out;
}

const apiRoot = path.join(process.cwd(), "app", "api");
const apiFiles = walk(apiRoot).filter((f) => f.endsWith("route.ts"));

const routePaths = new Set(
  apiFiles.map((f) => {
    const rel = path.relative(apiRoot, f).replace(/\\/g, "/");
    const noExt = rel.replace(/\/route\.ts$/, "");
    const parts = noExt.split("/").map((s) => (s.startsWith("[") ? ":" + s.slice(1, -1) : s));
    return "/api/" + parts.join("/");
  })
);

const libApiDir = path.join(process.cwd(), "lib", "api");
const libApiFiles = fs.existsSync(libApiDir)
  ? fs
      .readdirSync(libApiDir)
      .filter((f) => f.endsWith(".ts"))
      .map((f) => path.join(libApiDir, f))
  : [];

const endpointSet = new Set();

// string literal endpoints like "/foo/bar" or '/foo/bar'
const strRe = /(["'])\/(?!\/)([a-zA-Z0-9_\-\/]+)(?:\1)/g;
// template endpoints like `/foo/${id}` (prefix before ${)
const tplRe = /`\/(?!\/)([a-zA-Z0-9_\-\/]+)\$\{/g;

for (const f of libApiFiles) {
  const src = fs.readFileSync(f, "utf8");
  let m;
  while ((m = strRe.exec(src))) endpointSet.add("/" + m[2]);
  while ((m = tplRe.exec(src))) endpointSet.add("/" + m[1]);
}

const endpoints = [...endpointSet].sort();

function matches(ep) {
  const full = "/api" + ep;
  if (routePaths.has(full)) return true;

  for (const rp of routePaths) {
    if (rp.startsWith(full)) return true;

    const base = full.replace(/\/$/, "");
    if (rp.startsWith(base) && rp.includes("/:")) return true;
  }

  return false;
}

let matched = 0;
const missing = [];
for (const ep of endpoints) {
  if (matches(ep)) matched++;
  else missing.push("/api" + ep);
}

const coveragePct = endpoints.length ? Math.round((matched / endpoints.length) * 1000) / 10 : 100;

console.log(
  JSON.stringify(
    {
      routes: routePaths.size,
      libApiFiles: libApiFiles.length,
      endpoints: endpoints.length,
      matched,
      coveragePct,
      missingTop: missing.slice(0, 80),
    },
    null,
    2
  )
);
