export type TQuoteStatus = "idle" | "submitting" | "success" | "error";

export type TQuoteField = "name" | "phone" | "vehicle" | "photo";

export type TQuoteErrors = Partial<Record<TQuoteField, string>>;
