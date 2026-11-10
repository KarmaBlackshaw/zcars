export const getLinkAttrs = (href?: string) => (href?.startsWith("https://") ? { target: "_blank", rel: "noopener" } : { target: undefined, rel: undefined });
