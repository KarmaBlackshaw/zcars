import type { Plugin } from "vite";
import type { TContent } from "../src/types/content";
import type { TFaqItem } from "../src/types/faq";
import type { TService } from "../src/types/service";
import { LOGO_PATH } from "../src/constants/brand";
import { WEEKDAY_NAMES } from "../src/utils/hours";
import { getServicePath } from "../src/utils/service/getServicePath";
import { getServiceShowcase } from "../src/utils/service/getServiceShowcase";
import { loadContent } from "./content";

const PLACEHOLDER = "<!--zcars-head-->";
const HEAD_START = "<!--zcars-head-start-->";
const HEAD_END = "<!--zcars-head-end-->";
const SITE_URL = "%VITE_SITE_URL%";

type THeadTags = {
  title: string;
  description: string;
  url: string;
  image: string;
  ogTitle: string;
  ogDescription: string;
  structuredData: object[];
};

const escapeHtml = (value: string) =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");

const meta = (attribute: "name" | "property", key: string, value: string) => `<meta ${attribute}="${key}" content="${escapeHtml(value)}" />`;

const jsonLd = (data: object) => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;

const renderTags = ({ title, description, url, image, ogTitle, ogDescription, structuredData }: THeadTags) =>
  [
    HEAD_START,
    `<title>${escapeHtml(title)}</title>`,
    `<link rel="canonical" href="${escapeHtml(url)}" />`,
    `<link rel="preconnect" href="${new URL(image).origin}" />`,
    meta("name", "description", description),
    meta("property", "og:title", ogTitle),
    meta("property", "og:description", ogDescription),
    meta("property", "og:type", "website"),
    meta("property", "og:url", url),
    meta("property", "og:image", image),
    meta("property", "og:image:alt", ogTitle),
    meta("name", "twitter:card", "summary_large_image"),
    ...structuredData.map(jsonLd),
    HEAD_END,
  ].join("\n    ");

const getFaqPage = (items: TFaqItem[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })),
});

const getBusiness = ({ site, seo, projects }: TContent, siteUrl: string) => ({
  "@type": "AutoBodyShop",
  "@id": `${siteUrl}/#business`,
  name: site.name,
  url: `${siteUrl}/`,
  logo: `${siteUrl}${LOGO_PATH}`,
  image: [seo.og_image, ...projects.slice(0, 3).map(({ photos }) => photos[0])],
  telephone: site.phone_e164,
  address: {
    "@type": "PostalAddress",
    addressLocality: site.city,
    addressRegion: site.region,
    postalCode: site.postal_code,
    addressCountry: "PH",
  },
  geo: { "@type": "GeoCoordinates", latitude: site.latitude, longitude: site.longitude },
  hasMap: site.google_maps_url,
  areaServed: { "@type": "City", name: site.city },
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
});

const renderHomeHead = (content: TContent) => {
  const { site, seo, faqs, services } = content;
  const url = `${SITE_URL}/`;

  const business = {
    ...getBusiness(content, SITE_URL),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Car services",
      itemListElement: services.map((service) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: service.title, url: `${SITE_URL}${getServicePath(service.slug)}` },
      })),
    },
  };

  const website = { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: site.name, url, publisher: { "@id": business["@id"] } };

  return renderTags({
    title: seo.title,
    description: seo.description,
    url,
    image: seo.og_image,
    ogTitle: seo.og_title,
    ogDescription: seo.og_description,
    structuredData: [{ "@context": "https://schema.org", "@graph": [business, website] }, ...(faqs.length > 0 ? [getFaqPage(faqs)] : [])],
  });
};

const renderServiceHead = (content: TContent, service: TService, siteUrl: string) => {
  const { site, seo } = content;
  const url = `${siteUrl}${getServicePath(service.slug)}`;
  const title = `${service.title} in ${site.city} | ${site.name}`;
  const description = service.page_description ?? service.summary;
  const { src } = getServiceShowcase(service, content.projects);

  const serviceNode = {
    "@type": "Service",
    "@id": `${url}#service`,
    name: service.title,
    serviceType: service.title,
    description,
    url,
    image: src,
    areaServed: { "@type": "City", name: site.city },
    provider: getBusiness(content, siteUrl),
    offers:
      service.price_from == null
        ? undefined
        : { "@type": "Offer", priceSpecification: { "@type": "PriceSpecification", priceCurrency: "PHP", minPrice: service.price_from } },
  };

  const breadcrumb = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: service.title, item: url },
    ],
  };

  return renderTags({
    title,
    description,
    url,
    image: src ?? seo.og_image,
    ogTitle: title,
    ogDescription: description,
    structuredData: [{ "@context": "https://schema.org", "@graph": [serviceNode, breadcrumb] }, ...(service.faqs.length > 0 ? [getFaqPage(service.faqs)] : [])],
  });
};

type TReplaceServiceHeadOptions = { html: string; content: TContent; slug: string; siteUrl: string };

export const replaceServiceHead = ({ html, content, slug, siteUrl }: TReplaceServiceHeadOptions) => {
  const service = content.services.find((item) => item.slug === slug);
  const start = html.indexOf(HEAD_START);
  const end = html.indexOf(HEAD_END);

  if (service == null) {
    throw new Error(`[zcars] No service with slug "${slug}", so /services/${slug} cannot be prerendered.`);
  }

  if (start < 0 || end < 0) {
    throw new Error("[zcars] The built page is missing the generated head markers, so the service page head cannot be replaced.");
  }

  return html.slice(0, start) + renderServiceHead(content, service, siteUrl) + html.slice(end + HEAD_END.length);
};

export default function head(): Plugin {
  let env: unknown;

  return {
    name: "zcars-head",
    configResolved(config) {
      env = config.env;
    },
    transformIndexHtml: {
      order: "pre",
      async handler(html) {
        if (!html.includes(PLACEHOLDER)) {
          throw new Error(`[zcars] index.html is missing the ${PLACEHOLDER} placeholder, so the page head cannot be generated.`);
        }

        const content = await loadContent(env);
        const tags = renderHomeHead(content);

        return html.replace(PLACEHOLDER, () => tags);
      },
    },
  };
}
