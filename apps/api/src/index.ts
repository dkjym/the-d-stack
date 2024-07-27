import { serve } from "@hono/node-server";
import { zValidator } from "@hono/zod-validator";
import { db } from "db";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono();

const routes = app.get(
  "/users",
  zValidator(
    "query",
    z.object({
      email: z.string().optional(),
    })
  ),
  async (c) => {
    const users = await db.query.usersTable.findMany();
    return c.json(
      {
        ok: true,
        users,
      },
      200
    );
  }
);

export type AppType = typeof routes;

serve(
  {
    fetch: app.fetch,
    port: 8787,
  },
  (info) => {
    console.log(`Listening on \x1b[36mhttp://localhost:${info.port}\x1b[0m`);
  }
);
