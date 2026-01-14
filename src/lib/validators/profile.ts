import { z } from "zod";

export const profileUpdateSchema = z.object({
  display_name: z.string().min(1, "Display name is required").max(100, "Display name is too long"),
  phone: z.string().optional().or(z.literal("")),
  location: z.string().optional().or(z.literal("")),
  account_type: z.enum(["individual", "business"]).optional().default("individual"),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
