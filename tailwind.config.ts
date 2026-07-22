import type { Config } from "tailwindcss";

// Design tokens FirstLineCars — thème "Marine & Amber"
// Inspiré de l'océan d'Agadir (teintes marines profondes) et de la lumière
// dorée du Souss-Massa (ambre chaud), sur un fond clair neutre plutôt
// qu'un crème générique.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0E2A2E", // texte principal, quasi noir teinté marine
          soft: "#3A4F52",
        },
        marine: {
          50: "#EAF3F3",
          100: "#CEE3E2",
          300: "#7CAFAC",
          500: "#1F6E6A",
          600: "#175552",
          700: "#0F4C4A",
          900: "#0A2F2E",
        },
        amber: {
          50: "#FDF4E3",
          200: "#F3D397",
          400: "#E9B75B",
          500: "#E2A63B",
          600: "#C98A22",
        },
        clay: {
          500: "#C1502E", // accent secondaire, toitures/terre du Souss
        },
        sand: {
          50: "#FBF9F5",
          100: "#F4EFE6",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      boxShadow: {
        card: "0 4px 20px -6px rgba(14, 42, 46, 0.12)",
        "card-hover": "0 12px 32px -8px rgba(14, 42, 46, 0.22)",
      },
      transitionTimingFunction: {
        // Courbes "physiques" utilisées par Reveal/Hero plutôt que les
        // easing par défaut (ease/linear), qui rendent le mouvement
        // mécanique. quart-out : reveals de contenu. expo-out : Hero.
        "quart-out": "cubic-bezier(0.25, 1, 0.5, 1)",
        "expo-out": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
