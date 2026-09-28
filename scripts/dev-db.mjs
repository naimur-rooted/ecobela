/**
 * Local development database.
 *
 * Spins up a REAL PostgreSQL 17 instance (no installer / admin rights needed)
 * using the `embedded-postgres` package, on port 5433, with its data files
 * stored in ./.pgdata.
 *
 *   npm run dev:db      → start Postgres and keep it running
 *   npm run db:setup    → start Postgres, apply migrations, create the admin user
 *
 * Production uses a managed Postgres instead — just point DATABASE_URL at it
 * (Neon / Supabase / RDS / ...) and run `npm run db:deploy`.
 */
import EmbeddedPostgres from "embedded-postgres";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const PORT = Number(process.env.PG_PORT ?? 5433);
const USER = process.env.PG_USER ?? "postgres";
const PASSWORD = process.env.PG_PASSWORD ?? "postgres";
const DB_NAME = process.env.PG_DATABASE ?? "ecobela";
const DATA_DIR = path.join(process.cwd(), ".pgdata");
const runSetup = process.argv.includes("--setup");

const short = (message) => String(message).replace(/^\[pg\]\s*/, "").trim();

const pg = new EmbeddedPostgres({
  databaseDir: DATA_DIR,
  port: PORT,
  user: USER,
  password: PASSWORD,
  persistent: true,
  authMethod: "scram-sha-256",
  onLog: (message) => {
    const line = short(message);
    if (/ready to accept connections|listening on|database system is ready/i.test(line)) {
      console.log(`[dev-db] ${line}`);
    }
  },
  onError: (message) => {
    const text = short(message);
    if (!/could not|FATAL|error/i.test(text)) return;
    console.error(`[dev-db:error] ${text}`);
  },
});

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      shell: process.platform === "win32",
      env: process.env,
    });
    child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`${command} ${args.join(" ")} exited with code ${code}`))));
  });
}

const alreadyInitialised = fs.existsSync(path.join(DATA_DIR, "PG_VERSION"));

if (!alreadyInitialised) {
  console.log(`[dev-db] first run — initialising a fresh PostgreSQL cluster in ${DATA_DIR} ...`);
  await pg.initialise();
}

await pg.start();
console.log(`[dev-db] PostgreSQL is up on port ${PORT}`);

try {
  await pg.createDatabase(DB_NAME);
  console.log(`[dev-db] created database "${DB_NAME}"`);
} catch {
  console.log(`[dev-db] database "${DB_NAME}" already exists`);
}

if (runSetup) {
  const hasMigrations = fs.existsSync(path.join(process.cwd(), "prisma", "migrations"));
  console.log(`[dev-db] applying schema (${hasMigrations ? "migrate deploy" : "migrate dev --name init"}) ...`);
  await run("npx", hasMigrations ? ["prisma", "migrate", "deploy"] : ["prisma", "migrate", "dev", "--name", "init"]);

  console.log("[dev-db] creating / updating the bootstrap admin user ...");
  await run("npx", ["tsx", "scripts/create-admin.ts"]);

  console.log("\n[dev-db] setup complete. You can now run: npm run dev\n");
}

const shutdown = async () => {
  console.log("\n[dev-db] stopping PostgreSQL ...");
  try {
    await pg.stop();
  } catch (error) {
    console.error("[dev-db] stop failed:", error);
  }
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// Keep the process alive while Postgres runs.
setInterval(() => {}, 1 << 30);
