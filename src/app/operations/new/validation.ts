import { z } from "zod";
export const operationSchema = z.object({
  operationDate: z.string().min(1, "Date is required"),
  openingCash: z.coerce.number({ error: "Required" }).min(0), // 0 is valid for opening cash
  closingCash: z.coerce.number({ error: "Required" }).min(0.01, "Required"),
  totalSales: z.coerce.number({ error: "Required" }).min(0.01, "Required"),
  totalExpenses: z.coerce.number({ error: "Required" }).min(0.01, "Required"),
  notes: z.string().optional(),
});
export type OperationFormValues = z.infer<typeof operationSchema>;
