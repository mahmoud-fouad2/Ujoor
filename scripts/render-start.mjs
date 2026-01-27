import { spawn } from "node:child_process";

function bin(name) {
  // Use local binaries from node_modules/.bin
  const isWin = process.platform === "win32";
  const ext = isWin ? ".cmd" : "";
  return `node_modules/.bin/${name}${ext}`;
}

function run(cmd, args, { label } = {}) {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, { stdio: "inherit" });
    child.on("close", (code) => resolve({ code: code ?? 1, label }));
  });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const attempts = Number(process.env.DB_BOOTSTRAP_ATTEMPTS || 10);
  const delayMs = Number(process.env.DB_BOOTSTRAP_DELAY_MS || 3000);

  console.log(`[render-start] Starting (attempts=${attempts}, delayMs=${delayMs})`);

  // 1) Push schema (no migrations folder in repo).
  let pushed = false;
  for (let i = 1; i <= attempts; i++) {
    console.log(`[render-start] prisma db push (attempt ${i}/${attempts})`);
    // Use prisma CLI directly.
    const r = await run(bin("prisma"), ["db", "push", "--accept-data-loss"], { label: "db-push" });
    if (r.code === 0) {
      pushed = true;
      break;
    }
    if (i < attempts) {
      console.log(`[render-start] db push failed; retrying in ${delayMs}ms...`);
      await sleep(delayMs);
    }
  }

  if (!pushed) {
    console.error("[render-start] prisma db push failed after retries; exiting.");
    process.exit(1);
  }

  // 2) Ensure bootstrap super admin.
  const ensure = await run("node", ["scripts/ensure-super-admin.mjs"], { label: "ensure-super-admin" });
  if (ensure.code !== 0) {
    console.error("[render-start] ensure-super-admin failed; continuing to start app anyway.");
  }

  // 3) Start Next.
  console.log("[render-start] Starting Next.js...");
  const next = await run(bin("next"), ["start"], { label: "next-start" });
  process.exit(next.code);
}

main().catch((e) => {
  console.error("[render-start] fatal:", e);
  process.exit(1);
});
