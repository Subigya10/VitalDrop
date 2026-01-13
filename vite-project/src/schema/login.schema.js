import { z } from "zod";

const LoginSchema = z.object({
  identifier: z.string().nonempty({ message: "Email is required" }),
  password: z.string().nonempty({ message: "Password is required" }),
});

export default LoginSchema;
