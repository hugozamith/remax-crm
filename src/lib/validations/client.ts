import { z } from "zod";

const emptyToUndefined = (val: unknown) =>
  val === "" || val === undefined || val === null ? undefined : val;

const optionalNumber = z.preprocess(
  emptyToUndefined,
  z.coerce.number().min(0).optional()
);

const optionalInt = z.preprocess(
  emptyToUndefined,
  z.coerce.number().int().min(0).optional()
);

const optionalEnum = <T extends [string, ...string[]]>(values: T) =>
  z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : val),
    z.enum(values).optional()
  );

export const clientFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().optional(),
  propertyType: optionalEnum(["HOUSE", "APARTMENT", "CONDO", "LAND", "OTHER"]),
  bedrooms: optionalInt,
  bathrooms: optionalNumber,
  sizeSqm: optionalNumber,
  price: optionalNumber,
  intent: z.enum(["SELL", "RENT"], { message: "Intent is required" }),
  notes: z.string().optional(),
});

export type ClientFormValues = z.infer<typeof clientFormSchema>;

export const createAgentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type CreateAgentValues = z.infer<typeof createAgentSchema>;

export const PROPERTY_TYPE_LABELS: Record<string, string> = {
  HOUSE: "House",
  APARTMENT: "Apartment",
  CONDO: "Condo",
  LAND: "Land",
  OTHER: "Other",
};

export const INTENT_LABELS: Record<string, string> = {
  SELL: "Sell",
  RENT: "Rent",
};
