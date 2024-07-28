import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

const connectionString = "postgresql://postgres:password@localhost:4545/dstack";

const client = postgres(connectionString, { prepare: false });
const db = drizzle(client, { schema });

export { db };
