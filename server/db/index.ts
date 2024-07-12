import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
require("dotenv").config();

const queryClient = postgres(process.env.DATABASE_URL!);
export const db = drizzle(queryClient);
