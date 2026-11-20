# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Car owners in Tacloban City and around Leyte (sedans, hatchbacks, pickups, SUVs such as Hilux, Montero Sport, Terra, Wigo). Most arrive on a phone from Facebook or a Google search for a service plus "Tacloban". Their job: find out what the shop can do for their car, see that the work is real, and get a price without driving over first.

## Product Purpose

The public website of Zcars Auto Detailing Garage, Sagkahan, Tacloban City. It turns a visitor into a quote conversation. Success is a Messenger message with a photo of the car (or a call, or the on-site quote form), and a visitor who can find the garage and its hours.

## Positioning

One garage does the whole car: interior and exterior detailing, ceramic coating, body repair, repaint, PMS, window tint and undercoating, under one roof by one crew. The quote starts from a photo sent on Messenger, and the price is confirmed after the car is checked, before any work starts.

## Operating Context

- Philippine local-business norms: Messenger first, then a call, prices in ₱, Facebook is where the shop posts its work.
- Open Monday to Saturday, 8:00 AM to 5:00 PM; closed Sunday.
- The shop hosts EVSU automotive OJT students and hires experienced car painters and detailers.

## Capabilities and Constraints

- Vue 3 + vite-ssg prerendered site: home, one page per service (`/services/<slug>`), and a 404.
- All content is edited by the owner in Supabase and validated at build; each save triggers a Netlify rebuild. Copy may be rewritten in Supabase as part of design work.
- Quote form writes to Supabase (`quotes` table, photos in the `quote-photos` bucket).
- No service has a published price yet (`price_from` is empty); the only price shown is the active promo.

## Brand Commitments

- Logo: `public/logo.webp`, the "ZC / ZCARS AUTO DETAILING" mark on a white ground. Kept as is.
- Logo blue (about `#0068D4`, with navy about `#001858`) is the anchor colour. Everything else about the look may change.
- Owner taste signal: the owner's own promo graphics and the reference site behind the previous redesign were loud and sporty, not calm SaaS.

## Evidence on Hand

- Real project photos in Supabase storage (9 projects; one before/after pair, the Wigo bumper repair), a team/OJT photo, a promo poster.
- Partner product brands: 3M, Anzahl, Menzerna, Microtex, Mobil, Rocci, Solar Gard, Timeless.
- Active promo: ₱6,299 full interior and exterior detailing.
- Reviews: none real yet (3 "Sample customer" rows without a source). Never show or invent reviews, ratings, stats, years in business, warranties or customer counts.

## Product Principles

1. The car is the proof: real work photos lead, never stock that pretends to be the shop.
2. One action everywhere: send a photo on Messenger; call and the quote form are the fallbacks.
3. Say only what the shop can back up.
4. Phone first: the visitor is on mobile data, on a phone, often coming from Facebook.
