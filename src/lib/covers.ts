// Centralized Book Cover Generation System based on Category
// Maps library categories directly to thematic artwork, visual emojis, and rich SaaS dark-mode styles.

export interface CategoryCoverStyle {
  emoji: string;
  gradient: string;
  accent: string;
  glow: string;
  label: string;
  theme: "fantasy" | "science" | "fiction" | "history" | "biography" | "other";
}

/**
 * Centrally maps any book category to its visual artwork, emoji, and color palette.
 * 
 * Rules:
 * 1. 🧙‍♂️ Fantasy / Adventure (e.g., "Harry Potter", "Fantaisie"): Enchanted glowing fantasy tome cover, magical sparks.
 * 2. 🔬 Science / Technology ("Science", "Technologie", "Science-fiction"): Microchip, beaker, tech emblem on deep science backdrop.
 * 3. 📚 Fiction / Classic Literature ("Fiction", "Roman", "Littérature"): Classic hardcover novel sketch, storybook pages.
 * 4. 📜 History / Biography ("Histoire", "History"): Historical scroll, old parchment badge.
 * 5. 📂 Biography / Memoir ("Biographie", "Memoir"): Human profile / notebook badge.
 */
export function getCoverByCategory(categoryName?: string): CategoryCoverStyle {
  const norm = (categoryName || "").trim().toLowerCase();

  // 1. 🧙‍♂️ Fantasy / Adventure
  if (
    norm.includes("fantais") ||
    norm.includes("fantasy") ||
    norm.includes("adventur") ||
    norm.includes("aventur") ||
    norm.includes("magie") ||
    norm.includes("magic") ||
    norm.includes("potter") ||
    norm.includes("sorcier") ||
    norm.includes("wizard")
  ) {
    return {
      emoji: "🧙‍♂️",
      gradient: "from-purple-950 via-indigo-950 to-violet-900",
      accent: "#C084FC",
      glow: "shadow-[0_0_12px_rgba(168,85,247,0.35)] dark:shadow-[0_0_16px_rgba(147,51,234,0.45)] ring-1 ring-purple-400/30",
      label: "Fantasy / Aventure",
      theme: "fantasy",
    };
  }

  // 2. 🔬 Science / Technology
  if (
    norm.includes("techno") ||
    norm.includes("informatique") ||
    norm.includes("computer") ||
    norm.includes("code") ||
    norm.includes("software") ||
    norm.includes("web")
  ) {
    return {
      emoji: "💻",
      gradient: "from-cyan-950 via-slate-900 to-blue-900",
      accent: "#38BDF8",
      glow: "shadow-[0_0_12px_rgba(56,189,248,0.35)] dark:shadow-[0_0_16px_rgba(6,182,212,0.4)] ring-1 ring-cyan-400/30",
      label: "Technologie",
      theme: "science",
    };
  }

  if (
    norm.includes("science-fiction") ||
    norm.includes("sci-fi") ||
    norm.includes("space") ||
    norm.includes("galax")
  ) {
    return {
      emoji: "🚀",
      gradient: "from-slate-950 via-indigo-950 to-cyan-950",
      accent: "#38BDF8",
      glow: "shadow-[0_0_12px_rgba(56,189,248,0.35)] dark:shadow-[0_0_16px_rgba(6,182,212,0.4)] ring-1 ring-cyan-400/30",
      label: "Science-fiction",
      theme: "science",
    };
  }

  if (
    norm.includes("science") ||
    norm.includes("physique") ||
    norm.includes("chimie") ||
    norm.includes("biologie") ||
    norm.includes("astron")
  ) {
    return {
      emoji: "🔬",
      gradient: "from-teal-950 via-slate-900 to-cyan-950",
      accent: "#2DD4BF",
      glow: "shadow-[0_0_12px_rgba(45,212,191,0.35)] dark:shadow-[0_0_16px_rgba(20,184,166,0.4)] ring-1 ring-teal-400/30",
      label: "Science",
      theme: "science",
    };
  }

  // 3. 📚 Fiction / Classic Literature
  if (
    norm.includes("fiction") ||
    norm.includes("roman") ||
    norm.includes("littérat") ||
    norm.includes("literature") ||
    norm.includes("classic") ||
    norm.includes("conte") ||
    norm.includes("poésie") ||
    norm.includes("drame") ||
    norm.includes("thriller") ||
    norm.includes("polar")
  ) {
    return {
      emoji: "📚",
      gradient: "from-rose-950 via-red-950 to-slate-950",
      accent: "#FB7185",
      glow: "shadow-[0_0_12px_rgba(244,63,94,0.3)] dark:shadow-[0_0_16px_rgba(225,29,72,0.35)] ring-1 ring-rose-400/30",
      label: "Fiction / Littérature",
      theme: "fiction",
    };
  }

  // 4. 📜 History / Biography (History focus)
  if (norm.includes("histoir") || norm.includes("history")) {
    return {
      emoji: "📜",
      gradient: "from-amber-950 via-stone-900 to-yellow-950",
      accent: "#FBBF24",
      glow: "shadow-[0_0_12px_rgba(251,191,36,0.3)] dark:shadow-[0_0_16px_rgba(217,119,6,0.35)] ring-1 ring-amber-400/30",
      label: "Histoire",
      theme: "history",
    };
  }

  // 5. 📂 Biography / Memoir
  if (
    norm.includes("biograph") ||
    norm.includes("memoir") ||
    norm.includes("mémoir") ||
    norm.includes("autobio") ||
    norm.includes("journal")
  ) {
    return {
      emoji: "📂",
      gradient: "from-blue-950 via-slate-900 to-indigo-950",
      accent: "#60A5FA",
      glow: "shadow-[0_0_12px_rgba(96,165,250,0.3)] dark:shadow-[0_0_16px_rgba(37,99,235,0.35)] ring-1 ring-blue-400/30",
      label: "Biographie / Mémoires",
      theme: "biography",
    };
  }

  // 6. Other thematic categories
  if (norm.includes("art") || norm.includes("design") || norm.includes("peinture")) {
    return {
      emoji: "🎨",
      gradient: "from-fuchsia-950 via-pink-950 to-slate-950",
      accent: "#E879F9",
      glow: "shadow-[0_0_12px_rgba(232,121,249,0.3)] dark:shadow-[0_0_16px_rgba(217,70,239,0.35)] ring-1 ring-fuchsia-400/30",
      label: "Art",
      theme: "other",
    };
  }

  if (norm.includes("philosop")) {
    return {
      emoji: "🏛️",
      gradient: "from-stone-950 via-zinc-900 to-amber-950",
      accent: "#D4D4D8",
      glow: "shadow-[0_0_12px_rgba(212,212,216,0.25)] ring-1 ring-stone-400/30",
      label: "Philosophie",
      theme: "other",
    };
  }

  // Default fallback
  return {
    emoji: "📖",
    gradient: "from-slate-800 via-slate-900 to-slate-950",
    accent: "#94A3B8",
    glow: "shadow-sm ring-1 ring-slate-700/30",
    label: categoryName || "Général",
    theme: "other",
  };
}
