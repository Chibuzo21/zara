import { z } from "zod";

export const productSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  category: z.string().min(1, "Category is required"),
  basePrice: z.coerce
    .number({ error: "Required" })
    .min(0.01, "Enter a valid price"),
  productionCost: z.coerce.number().min(0).optional(),
  status: z.enum(["active", "inactive"]),
});

export type ProductFormValues = z.infer<typeof productSchema>;
