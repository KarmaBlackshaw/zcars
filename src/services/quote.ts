import type { TQuoteInsert } from "@/types";

import { getSupabase } from "./supabase";

export async function uploadQuotePhoto(path: string, file: File) {
  const supabase = await getSupabase();
  const { error } = await supabase.storage.from("quote-photos").upload(path, file, { contentType: file.type });

  if (error != null) {
    throw error;
  }
}

export async function createQuote(quote: TQuoteInsert) {
  const supabase = await getSupabase();
  const { error } = await supabase.from("quotes").insert(quote);

  if (error != null) {
    throw error;
  }
}
