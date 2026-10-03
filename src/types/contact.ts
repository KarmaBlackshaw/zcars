import type { Component } from "vue";

import { PhMapPin, PhFacebookLogo } from "@phosphor-icons/vue";

export const BUSINESS_NAME = "Zcars Auto Detailing Garage";
export const PHONE_DISPLAY = "0963 745 7661";
export const PHONE_HREF = "tel:+639637457661";
export const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=100064154490589";
export const MAP_EMBED_URL = "https://www.google.com/maps?q=Zcars+Auto+Detailing+Garage+Sagkahan+Tacloban+City&output=embed";
export const MAP_DIRECTIONS_URL = "https://www.google.com/maps/dir/?api=1&destination=Zcars+Auto+Detailing+Garage%2C+Sagkahan%2C+Tacloban+City";

export type TVisitFact = {
  icon: Component;
  label: string;
  text: string;
  href: string;
  isExternal?: boolean;
};

export const VISIT_FACTS: TVisitFact[] = [
  {
    icon: PhMapPin,
    label: "Address",
    text: "Sagkahan, Tacloban City, Leyte, Philippines",
    href: MAP_DIRECTIONS_URL,
    isExternal: true,
  },
  {
    icon: PhFacebookLogo,
    label: "Facebook",
    text: BUSINESS_NAME,
    href: FACEBOOK_URL,
    isExternal: true,
  },
];
