import { z } from "zod";
export const baseSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.email("Enter a valid email address"),
  phone: z.string().optional(),
  role: z.enum([
    "owner",
    "production",
    "packaging",
    "sales",
    "transport_sales",
    "admin",
  ]),
  status: z.enum(["active", "inactive", "suspended"]),
  dateHired: z.string().min(1, "Date hired is required"),
  baseSalary: z.string().optional(),
  commissionRate: z
    .string()
    .min(1, "Commission rate is required")
    .refine(
      (v) =>
        !isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 100,
      { message: "Must be between 0 and 100" },
    ),
  password: z.string().optional(),
});

export const createSchema = baseSchema.extend({
  password: z
    .string()
    .min(5, "Password must be at least 5 characters")
    .max(100, "Password is too long"),
});

export const editSchema = baseSchema.extend({
  password: z
    .string()
    .refine((v) => !v || v.length >= 5, {
      message: "Password must be at least 5 characters if provided",
    })
    .optional(),
});
export type FormValues = z.infer<typeof createSchema>;
