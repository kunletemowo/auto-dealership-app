import { z } from "zod";

export const carListingSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  mileage: z.number().int().min(0),
  transmission: z.enum(["automatic", "manual"]),
  fuelType: z.enum(["gasoline", "diesel", "electric", "hybrid", "other"]),
  price: z.number().positive("Price must be positive"),
  currency: z.string().default("CAD"),
  locationCity: z.string().min(1, "City is required"),
  locationRegion: z.string().min(1, "Province/State is required"),
  locationCountry: z.string().min(1, "Country is required"),
  condition: z.enum(["new", "used"]),
});

export type CarListingInput = z.infer<typeof carListingSchema>;
