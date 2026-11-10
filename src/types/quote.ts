export type TQuoteStatus = "idle" | "submitting" | "success" | "error";
export type TQuoteField = "name" | "phone" | "vehicle" | "photo";
export type TQuoteErrors = Partial<Record<TQuoteField, string>>;
export type TQuoteInsert = {
  name: string;
  phone: string;
  vehicle: string;
  service?: string;
  message?: string;
  photo_path?: string;
};
