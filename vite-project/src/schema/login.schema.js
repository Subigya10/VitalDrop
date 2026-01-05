// src/schema/login.schema.js
import { z } from "zod";

const LoginSchema = z.object({
  identifier: z
    .string()
    .nonempty({ message: "Email  is  required" }), // just check non-empty for now
  password: z
    .string()
    .nonempty({ message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" }),
});

export default LoginSchema;
