import { z } from "zod";

import { httpsUrlSchema, textSchema } from "./content";

const weekdaySchema = z.enum(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);

export type TWeekday = z.infer<typeof weekdaySchema>;

const timeSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/)
  .transform((value) => value.slice(0, 5));

const hoursEntrySchema = z.strictObject({
  days: z.array(weekdaySchema).min(1),
  opens: timeSchema,
  closes: timeSchema,
});

export type THoursEntry = z.infer<typeof hoursEntrySchema>;

export const siteSchema = z
  .strictObject({
    name: textSchema,
    tagline: textSchema,
    phone_display: textSchema,
    phone_e164: z.string().regex(/^\+639\d{9}$/),
    messenger_url: httpsUrlSchema,
    facebook_url: httpsUrlSchema,
    address: textSchema,
    locality: textSchema,
    map_query: textSchema,
    hours: z.array(hoursEntrySchema).default([]),
    hours_note: textSchema.optional(),
  })
  .transform((site) => {
    const query = encodeURIComponent(site.map_query);

    return {
      ...site,
      tel_href: `tel:${site.phone_e164}`,
      map_embed_url: `https://www.google.com/maps?q=${query}&output=embed`,
      map_directions_url: `https://www.google.com/maps/dir/?api=1&destination=${query}`,
    };
  });

export type TSite = z.infer<typeof siteSchema>;
