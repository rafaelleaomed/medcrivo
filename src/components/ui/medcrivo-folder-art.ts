import type { ArtRecipe } from "./glass-folder-cards";

/**
 * Artes geradas das pastas (GlassFolder) com a paleta MedCrivo:
 * Pinho #123C36 · Teal #16796F · Marfim #F5F2E9 · Lima #D6EF72 · Tinta #172A27.
 */
export const MEDCRIVO_FOLDER_ART = {
  /** Pinho com veios de Lima: ferramentas de criação. */
  crivo: {
    style: "marble",
    colors: ["#0B2622", "#123C36", "#16796F", "#172A27", "#4FAE9D", "#D6EF72", "#F5F2E9"],
    scale: 0.7,
    warp: 3.2,
    angle: -0.4,
    gloss: 0.5,
    veins: 0.45,
  },
  /** Marfim e Teal em longa exposição: planejamento e organização. */
  marfim: {
    style: "streak",
    colors: ["#F5F2E9", "#E2DDD0", "#AEDBCF", "#16796F", "#123C36", "#EEF6F3", "#F5F2E9"],
    scale: 0.7,
    warp: 1.5,
    angle: 0.35,
    gloss: 0.22,
    veins: 0,
  },
  /** Tinta profunda com Teal: revisão, Crivo e evidências. */
  noite: {
    style: "marble",
    colors: ["#050F0D", "#0B2622", "#172A27", "#123C36", "#16796F", "#7CC3B4", "#D6EF72"],
    scale: 0.62,
    warp: 3.6,
    angle: 2.0,
    gloss: 0.55,
    veins: 0.55,
  },
  /** Lima luminoso sobre Pinho: destaques e novidades. */
  lima: {
    style: "streak",
    colors: ["#123C36", "#16796F", "#D6EF72", "#F5F2E9", "#D6EF72", "#4FAE9D", "#123C36"],
    scale: 0.75,
    warp: 1.4,
    angle: -0.6,
    gloss: 0.3,
    veins: 0,
  },
} satisfies Record<string, ArtRecipe>;

export type MedcrivoFolderArt = keyof typeof MEDCRIVO_FOLDER_ART;
