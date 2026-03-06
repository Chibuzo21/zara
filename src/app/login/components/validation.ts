import { z } from "zod";
export const loginSchema = z.object({
  email: z.email("invalid email address"),
  password: z.string().min(5, "password must be atleast 5 characters"),
});
export type FormData = z.infer<typeof loginSchema>;
