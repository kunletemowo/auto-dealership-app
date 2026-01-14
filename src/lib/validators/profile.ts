import { z } from "zod";

export const profileUpdateSchema = z.object({
  display_name: z.string().min(1, "Display name is required").max(100, "Display name is too long"),
  phone: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  city: z.string().min(1, "City is required").max(100, "City name is too long"),
  province: z.string().optional().or(z.literal("")),
  postal_code: z.string().optional().or(z.literal("")),
  account_type: z.enum(["individual", "business"]).optional().default("individual"),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
