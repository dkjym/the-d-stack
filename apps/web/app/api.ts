import type { AppType } from "api/src/index";
import { hc } from "hono/client";

const client = hc<AppType>("http://localhost:8787/");

export { client };
