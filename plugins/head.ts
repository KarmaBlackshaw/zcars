import type { Plugin } from "vite";
import type { TContent } from "../src/types/content";
import { WEEKDAY_NAMES } from "../src/utils/hours";
import { loadContent } from "./content";

const PLACEHOLDER = "<!--zcars-head-->";
const SITE_URL = "%VITE_SITE_URL%";

const escapeHtml = (value: string) =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");

const meta = (attribute: "name" | "property", key: string, value: string) => `<meta ${attribute}="${key}" content="${escapeHtml(value)}" />`;

const jsonLd = (data: object) => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;

const renderHead = ({ site, seo, faqs }: TContent) => {
  const url = `${SITE_URL}/`;
  const image = `${SITE_URL}${seo.og_image}`;

  const shop = {
    "@context": "https://schema.org",
    "@type": "AutoBodyShop",
    name: site.name,
    url,
    image,
    telephone: site.phone_e164,
    address: { "@type": "PostalAddress", addressLocality: site.locality, addressCountry: "PH" },
    sameAs: [site.facebook_url],
    openingHoursSpecification:
      site.hours.length > 0
        ? site.hours.map(({ days, opens, closes }) => ({
            "@type": "OpeningHoursSpecification",
            dayOfWeek: days.map((day) => WEEKDAY_NAMES[day]),
            opens,
            closes,
          }))
        : undefined,
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };

  return [
    `<title>${escapeHtml(seo.title)}</title>`,
    meta("name", "description", seo.description),
    meta("property", "og:title", seo.og_title),
    meta("property", "og:description", seo.og_description),
    meta("property", "og:type", "website"),
    meta("property", "og:url", url),
    meta("property", "og:image", image),
    meta("property", "og:image:alt", seo.og_title),
    meta("name", "twitter:card", "summary_large_image"),
    jsonLd(shop),
    ...(faqs.length > 0 ? [jsonLd(faqPage)] : []),
  ].join("\n    ");
};

export default function head(): Plugin {
  let root = process.cwd();

  return {
    name: "zcars-head",
    configResolved(config) {
      root = config.root;
    },
    transformIndexHtml: {
      order: "pre",
      handler(html) {
        if (!html.includes(PLACEHOLDER)) {
          throw new Error(`[zcars] index.html is missing the ${PLACEHOLDER} placeholder, so the page head cannot be generated.`);
        }

        const content = loadContent(root);
        const tags = renderHead(content);

        return html.replace(PLACEHOLDER, () => tags);
      },
    },
  };
}
