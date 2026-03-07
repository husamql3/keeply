import { z } from "zod";
import { config } from "dotenv";

config();

export const env = z
  .object({
    PORT: z.coerce.number().default(4000),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  })
  .parse(process.env);
