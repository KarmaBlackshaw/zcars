import type { Component } from "vue";

import { PhShieldCheck } from "@phosphor-icons/vue";
import polish from "@/assets/images/polish.webp";
import collision from "@/assets/images/collision.webp";

import type { TImage } from "./image";

type TServiceBase = {
  id: string;
  title: string;
  description: string;
  tags: string[];
};

export type TService = TServiceBase & ({ image: TImage; icon?: never } | { icon: Component; image?: never });

export const SERVICES: TService[] = [
  {
    id: "detailing",
    title: "Detailing and protection",
    description: "Paint correction, interior and exterior detailing, then a ceramic coat to lock in the gloss.",
    tags: ["Interior detailing", "Exterior detailing", "Ceramic coating"],
    image: { src: polish, alt: "Detailer machine-polishing the hood of a red car", width: 540, height: 960 },
  },
  {
    id: "repair",
    title: "Repair and repaint",
    description: "Body repair and refinishing with professional-grade paint.",
    tags: ["Body repair", "Repaint"],
    image: { src: collision, alt: "Black SUV front end with collision damage before repair", width: 315, height: 315 },
  },
  {
    id: "upkeep",
    title: "Upkeep and underbody",
    description: "Preventive maintenance, window tint and undercoating against rust.",
    tags: ["PMS", "Window tint", "Undercoating"],
    icon: PhShieldCheck,
  },
];
