/**
 * Marca em um único lugar. Fonte de verdade: Conteúdo/MedCrivo/medcrivo_brand-book.html
 * (skill para agentes: Contexto_Agentes_Skills/skills/medcrivo-brand).
 */
export const BRAND = {
  name: "MedCrivo",
  product: "MedCrivo Studio",
  tagline: "Ética também no digital.",
  support: "Conteúdo de saúde com IA, revisado pelo Crivo.",
  auditorName: "Crivo",
  /** Selo do auditor: controle de qualidade interno, nunca certificação do conselho. */
  sealText: "Revisado pelo Crivo",
  colors: {
    pinho: "#123C36",
    teal: "#16796F",
    marfim: "#F5F2E9",
    lima: "#D6EF72",
    tinta: "#172A27",
  },
  assets: {
    symbol: "/brand/medcrivo/medcrivo_simbolo-reduzido.svg",
    symbolOnDark: "/brand/medcrivo/medcrivo_simbolo-reduzido-fundo-escuro.svg",
    logo: "/brand/medcrivo/medcrivo_logo-horizontal.svg",
    logoOnDark: "/brand/medcrivo/medcrivo_logo-horizontal-fundo-escuro.svg",
  },
} as const;
