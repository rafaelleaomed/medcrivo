/** Dados do site público. Tudo que é compromisso comercial fica aqui, num lugar só. */
export const SITE = {
  instagram: { handle: "@medcrivo", url: "https://www.instagram.com/medcrivo/", dm: "https://ig.me/m/medcrivo" },
  contactEmail: "medcrivo@gmail.com",
  /** Razão social e CNPJ: preencher antes de abrir as assinaturas (aparecem em Termos e Privacidade). */
  legalEntity: { name: "", cnpj: "" },
  /** Preços só aparecem quando a cobrança (Asaas) e as cotas estiverem validadas. */
  pricingPublished: false,
} as const;

export type Plan = {
  id: "gratis" | "essencial" | "profissional" | "clinica";
  name: string;
  price: string;
  tagline: string;
  features: string[];
  soon?: string[];
  highlight?: boolean;
};

export const PLANS: Plan[] = [
  {
    id: "gratis",
    name: "Crivo grátis",
    price: "R$ 0",
    tagline: "Para revisar textos que você já escreveu.",
    features: ["Revisão de texto pelas normas do CFM e a LGPD", "Trecho, norma e sugestão de ajuste", "Checklist “Pode ou não pode no Instagram”"],
  },
  {
    id: "essencial",
    name: "Essencial",
    price: "R$ 97/mês",
    tagline: "Para começar a publicar com regularidade.",
    features: ["Carrosséis 4:5 com a sua identidade visual", "Legenda pronta para copiar", "Roteiro de vídeo com teleprompter", "Crivo em todo post"],
  },
  {
    id: "profissional",
    name: "Profissional",
    price: "R$ 197/mês",
    tagline: "Para quem quer o funil completo.",
    features: ["Tudo do Essencial", "Funil “Comente PALAVRA”: palavra-chave, isca e mensagem de DM", "Referências científicas reais no post"],
    soon: ["Planner de publicação"],
    highlight: true,
  },
  {
    id: "clinica",
    name: "Clínica",
    price: "R$ 397/mês",
    tagline: "Para equipes que publicam em vários perfis.",
    features: ["Tudo do Profissional", "Vários perfis na mesma conta"],
    soon: ["Painel de leads"],
  },
];
