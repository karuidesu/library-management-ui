export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  status: "Disponible" | "Emprunté" | "Endommagé" | "Perdu";
  coverColor: string;
  coverAccent: string;
  coverEmoji: string;
  year: number;
  copies: number;
  description: string;
}

export type Gender = "F" | "M";

export interface Member {
  id: string;
  name: string;
  email?: string;
  gender: Gender;
  role: "Admin" | "Bibliothécaire" | "Membre";
  joinDate: string;
  avatar: string;
  borrowedCount: number;
}

export interface Loan {
  id: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookCoverColor: string;
  bookEmoji: string;
  memberId: string;
  borrower: string;
  borrowerAvatar: string;
  borrowDate: string;
  dueDate: string;
  status: "En cours" | "Retourné" | "En retard";
}

export interface Activity {
  id: string;
  bookTitle: string;
  member: string;
  date: string;
  status: "En cours" | "Retourné" | "En retard";
  type: "Emprunt" | "Retour" | "Avis de retard" | "Nouvelle inscription";
}

export const initialBooks: Book[] = [
  {
    id: "BK-001",
    title: "Le Seigneur des Anneaux",
    author: "J.R.R. Tolkien",
    isbn: "978-2266205",
    category: "Fantasy",
    status: "Disponible",
    coverColor: "from-amber-900 to-amber-950",
    coverAccent: "#F59E0B",
    coverEmoji: "💍",
    year: 1954,
    copies: 6,
    description: "Un roman épique de high-fantasy retraçant la quête pour détruire l'Anneau unique et sauver la Terre du Milieu.",
  },
  {
    id: "BK-002",
    title: "Le Petit Prince",
    author: "A. de Saint-Exupéry",
    isbn: "978-0156012",
    category: "Fiction",
    status: "Emprunté",
    coverColor: "from-sky-700 to-blue-900",
    coverAccent: "#38BDF8",
    coverEmoji: "👑",
    year: 1943,
    copies: 8,
    description: "Un conte poétique d'un jeune prince visitant diverses planètes, abordant les thèmes de la solitude et de l'amour.",
  },
  {
    id: "BK-003",
    title: "Dune",
    author: "Frank Herbert",
    isbn: "978-0441172",
    category: "Science-fiction",
    status: "Disponible",
    coverColor: "from-orange-700 to-amber-900",
    coverAccent: "#FB923C",
    coverEmoji: "🪐",
    year: 1965,
    copies: 5,
    description: "Sur la planète désertique Arrakis, l'histoire de Paul Atréides et la lutte pour la substance la plus précieuse de l'univers.",
  },
  {
    id: "BK-004",
    title: "Marie Curie: A Life",
    author: "Susan Quinn",
    isbn: "978-0201887",
    category: "Biographie",
    status: "Disponible",
    coverColor: "from-emerald-800 to-teal-950",
    coverAccent: "#34D399",
    coverEmoji: "⚗️",
    year: 1995,
    copies: 3,
    description: "Un portrait biographique passionnant de la première femme à recevoir un prix Nobel et de ses découvertes qui ont transformé la physique moderne.",
  },
  {
    id: "BK-005",
    title: "1984",
    author: "George Orwell",
    isbn: "978-0451524",
    category: "Fiction",
    status: "Emprunté",
    coverColor: "from-slate-800 to-slate-950",
    coverAccent: "#94A3B8",
    coverEmoji: "👁️",
    year: 1949,
    copies: 7,
    description: "Un roman d'anticipation dystopique explorant le totalitarisme, la surveillance de masse et le contrôle répressif.",
  },
  {
    id: "BK-006",
    title: "Sapiens: A Brief History",
    author: "Yuval Noah Harari",
    isbn: "978-0062316",
    category: "Histoire",
    status: "Disponible",
    coverColor: "from-yellow-700 to-amber-900",
    coverAccent: "#FBBF24",
    coverEmoji: "🌍",
    year: 2014,
    copies: 9,
    description: "Une fresque historique de l'humanité, de l'évolution des premières espèces humaines à l'âge de pierre jusqu'au XXIe siècle.",
  },
  {
    id: "BK-007",
    title: "Clean Code",
    author: "Robert C. Martin",
    isbn: "978-0132350",
    category: "Technologie",
    status: "Emprunté",
    coverColor: "from-indigo-900 to-violet-950",
    coverAccent: "#818CF8",
    coverEmoji: "💻",
    year: 2008,
    copies: 4,
    description: "Un manuel d'artisanat logiciel agile regroupant les meilleures pratiques de formatage, refactorisation et propreté du code.",
  },
  {
    id: "BK-008",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    isbn: "978-0547928",
    category: "Fantasy",
    status: "Endommagé",
    coverColor: "from-green-900 to-emerald-950",
    coverAccent: "#4ADE80",
    coverEmoji: "🐉",
    year: 1937,
    copies: 2,
    description: "La quête du hobbit Bilbon Sacquet pour reprendre une part du trésor gardé par le dragon Smaug.",
  },
  {
    id: "BK-009",
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    isbn: "978-0553380",
    category: "Science",
    status: "Disponible",
    coverColor: "from-blue-900 to-indigo-950",
    coverAccent: "#60A5FA",
    coverEmoji: "🌌",
    year: 1988,
    copies: 5,
    description: "Une exploration accessible des origines, de la structure et du destin de l'univers par Stephen Hawking.",
  },
  {
    id: "BK-010",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    isbn: "978-0374533",
    category: "Science",
    status: "Disponible",
    coverColor: "from-purple-900 to-slate-950",
    coverAccent: "#C084FC",
    coverEmoji: "🧠",
    year: 2011,
    copies: 6,
    description: "Une analyse des deux systèmes régissant la pensée humaine : l'un rapide et intuitif, l'autre lent et réfléchi.",
  },
  {
    id: "BK-011",
    title: "Steve Jobs",
    author: "Walter Isaacson",
    isbn: "978-1451648",
    category: "Biographie",
    status: "Disponible",
    coverColor: "from-zinc-800 to-neutral-950",
    coverAccent: "#E4E4E7",
    coverEmoji: "🍏",
    year: 2011,
    copies: 4,
    description: "La biographie exclusive fondée sur plus de quarante entretiens avec Steve Jobs réalisés sur deux ans.",
  },
  {
    id: "BK-012",
    title: "The Art of War",
    author: "Sun Tzu",
    isbn: "978-1590302",
    category: "Histoire",
    status: "Disponible",
    coverColor: "from-rose-900 to-stone-950",
    coverAccent: "#FB7185",
    coverEmoji: "⚔️",
    year: -500,
    copies: 5,
    description: "Un traité militaire chinois antique attribué au stratège Sun Tzu, portant sur la stratégie et la tactique.",
  },
];

export const initialMembers: Member[] = [
  {
    id: "MEM-001",
    name: "Sarah Connor",
    email: "sarah.connor@agbale.app",
    gender: "F",
    role: "Admin",
    joinDate: "2024-01-15",
    avatar: "SC",
    borrowedCount: 2,
  },
  {
    id: "MEM-002",
    name: "Jean Dupont",
    email: "jean.dupont@email.com",
    gender: "M",
    role: "Membre",
    joinDate: "2024-02-12",
    avatar: "JD",
    borrowedCount: 1,
  },
  {
    id: "MEM-003",
    name: "Marie Curie",
    email: "marie.curie@sciences.org",
    gender: "F",
    role: "Bibliothécaire",
    joinDate: "2024-02-20",
    avatar: "MC",
    borrowedCount: 3,
  },
  {
    id: "MEM-004",
    name: "Marc Dubois",
    email: "marc.dubois@email.com",
    gender: "M",
    role: "Membre",
    joinDate: "2024-03-05",
    avatar: "MD",
    borrowedCount: 2,
  },
  {
    id: "MEM-005",
    name: "Emily Chen",
    email: "emily.chen@email.com",
    gender: "F",
    role: "Membre",
    joinDate: "2024-03-10",
    avatar: "EC",
    borrowedCount: 1,
  },
  {
    id: "MEM-006",
    name: "Marcus Johnson",
    email: "marcus.j@email.com",
    gender: "M",
    role: "Bibliothécaire",
    joinDate: "2024-03-22",
    avatar: "MJ",
    borrowedCount: 0,
  },
  {
    id: "MEM-007",
    name: "Lisa Park",
    email: "lisa.park@email.com",
    gender: "F",
    role: "Membre",
    joinDate: "2024-04-05",
    avatar: "LP",
    borrowedCount: 2,
  },
  {
    id: "MEM-008",
    name: "David Wilson",
    email: "david.w@email.com",
    gender: "M",
    role: "Membre",
    joinDate: "2024-04-18",
    avatar: "DW",
    borrowedCount: 5,
  },
];

export const initialLoans: Loan[] = [
  {
    id: "EMP001",
    bookId: "BK-002",
    bookTitle: "L'Étranger",
    bookAuthor: "Albert Camus",
    bookCoverColor: "from-sky-700 to-blue-900",
    bookEmoji: "☀️",
    memberId: "MEM-002",
    borrower: "Jean Dupont",
    borrowerAvatar: "JD",
    borrowDate: "2024-10-01",
    dueDate: "2024-10-15",
    status: "En cours",
  },
  {
    id: "EMP002",
    bookId: "BK-004",
    bookTitle: "Marie Curie: A Life",
    bookAuthor: "Susan Quinn",
    bookCoverColor: "from-emerald-800 to-teal-950",
    bookEmoji: "⚗️",
    memberId: "MEM-003",
    borrower: "Marie Curie",
    borrowerAvatar: "MC",
    borrowDate: "2024-09-25",
    dueDate: "2024-10-09",
    status: "Retourné",
  },
  {
    id: "EMP003",
    bookId: "BK-005",
    bookTitle: "1984",
    bookAuthor: "George Orwell",
    bookCoverColor: "from-slate-800 to-slate-950",
    bookEmoji: "👁️",
    memberId: "MEM-004",
    borrower: "Marc Dubois",
    borrowerAvatar: "MD",
    borrowDate: "2024-09-10",
    dueDate: "2024-09-24",
    status: "En retard",
  },
  {
    id: "EMP004",
    bookId: "BK-007",
    bookTitle: "Clean Code",
    bookAuthor: "Robert C. Martin",
    bookCoverColor: "from-indigo-900 to-violet-950",
    bookEmoji: "💻",
    memberId: "MEM-007",
    borrower: "Lisa Park",
    borrowerAvatar: "LP",
    borrowDate: "2024-10-04",
    dueDate: "2024-10-18",
    status: "En cours",
  },
  {
    id: "EMP005",
    bookId: "BK-002",
    bookTitle: "Le Petit Prince",
    bookAuthor: "A. de Saint-Exupéry",
    bookCoverColor: "from-sky-700 to-blue-900",
    bookEmoji: "👑",
    memberId: "MEM-005",
    borrower: "Emily Chen",
    borrowerAvatar: "EC",
    borrowDate: "2024-10-05",
    dueDate: "2024-10-19",
    status: "En cours",
  },
];

export const initialActivities: Activity[] = [
  {
    id: "ACT001",
    bookTitle: "Le Petit Prince",
    member: "Emily Chen",
    date: "2024-10-05",
    status: "En cours",
    type: "Emprunt",
  },
  {
    id: "ACT002",
    bookTitle: "Marie Curie: A Life",
    member: "Marie Curie",
    date: "2024-10-04",
    status: "Retourné",
    type: "Retour",
  },
  {
    id: "ACT003",
    bookTitle: "1984",
    member: "Marc Dubois",
    date: "2024-10-02",
    status: "En retard",
    type: "Avis de retard",
  },
  {
    id: "ACT004",
    bookTitle: "Clean Code",
    member: "Lisa Park",
    date: "2024-10-01",
    status: "En cours",
    type: "Emprunt",
  },
  {
    id: "ACT005",
    bookTitle: "Dune",
    member: "Jean Dupont",
    date: "2024-09-28",
    status: "Retourné",
    type: "Retour",
  },
];

export interface Kpi {
  id: string;
  label: string;
  value: number;
  trend: number;
  higherIsBetter: boolean;
}

export const libraryStats = {
  totalBooks: 14_820,
  activeMembers: 3_244,
  booksBorrowed: 3_980,
  overdueReturns: 84,
} as const;

export const kpis: Kpi[] = [
  {
    id: "total-books",
    label: "Total des livres",
    value: libraryStats.totalBooks,
    trend: 3.2,
    higherIsBetter: true,
  },
  {
    id: "active-members",
    label: "Membres actifs",
    value: libraryStats.activeMembers,
    trend: 12.5,
    higherIsBetter: true,
  },
  {
    id: "books-borrowed",
    label: "Livres empruntés",
    value: libraryStats.booksBorrowed,
    trend: -2.4,
    higherIsBetter: true,
  },
  {
    id: "overdue-returns",
    label: "Retours en retard",
    value: libraryStats.overdueReturns,
    trend: 14,
    higherIsBetter: false,
  },
];

export const borrowingTrendsData = [
  { month: "Janv", loans: 820 },
  { month: "Févr", loans: 930 },
  { month: "Mars", loans: 1050 },
  { month: "Avr", loans: 980 },
  { month: "Mai", loans: 1120 },
  { month: "Juin", loans: 1280 },
  { month: "Juil", loans: 1180 },
  { month: "Août", loans: 1350 },
  { month: "Sept", loans: 1420 },
  { month: "Oct", loans: 1180 },
  { month: "Nov", loans: 1290 },
  { month: "Déc", loans: 1380 },
];

export const bookStatusData = [
  { name: "Disponible", value: 10_240, color: "#059669" },
  { name: "Emprunté", value: 3_980, color: "#2563EB" },
  { name: "Endommagé", value: 440, color: "#D97706" },
  { name: "Perdu", value: 160, color: "#E11D48" },
];

export const categoryData = [
  { name: "Fiction", count: 3_240 },
  { name: "Technologie", count: 2_480 },
  { name: "Histoire", count: 2_420 },
  { name: "Science", count: 2_180 },
  { name: "Fantasy", count: 2_030 },
  { name: "Biographie", count: 1_850 },
];

export const categories = [
  "Fiction",
  "Science",
  "Biographie",
  "Histoire",
  "Technologie",
  "Fantasy",
  "Science-fiction",
  "Art",
  "Philosophie",
];

export const categoryEmojis: Record<string, string> = {
  Fiction: "📚",
  Science: "🔬",
  Histoire: "📜",
  Fantasy: "🧙‍♂️",
  Biographie: "📂",
  Technologie: "💻",
  "Science-fiction": "🚀",
  Art: "🎨",
  Philosophie: "🏛️",
};

export const bookConditions = ["Neuf", "Très bon état", "Bon état", "État moyen", "Endommagé"];

export const loanDurations = [
  { value: "7", label: "7 jours (forte demande)" },
  { value: "14", label: "14 jours (standard)" },
  { value: "30", label: "30 jours (prolongé)" },
  { value: "45", label: "45 jours (recherche / enseignant)" },
  { value: "60", label: "60 jours (longue durée)" },
];


export const REFERENCE_DATE = "2026-10-13";

function shiftDays(iso: string, days: number) {
  const date = new Date(`${iso}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function daysUntilDue(dueDate: string) {
  const due = new Date(`${dueDate}T00:00:00Z`).getTime();
  const today = new Date(`${REFERENCE_DATE}T00:00:00Z`).getTime();
  return Math.round((due - today) / 86_400_000);
}

const dueFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export function formatDate(iso: string) {
  const date = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? iso : dueFormatter.format(date);
}

export function describeDueDate(dueDate: string) {
  const days = daysUntilDue(dueDate);
  if (days === 0) return "À rendre aujourd'hui";
  if (days === 1) return "À rendre demain";
  if (days === -1) return "1 jour de retard";
  if (days < 0) return `${Math.abs(days)} jours de retard`;
  if (days <= 7) return `À rendre dans ${days} jours`;
  return `À rendre le ${formatDate(dueDate)}`;
}

export interface ActiveLoan {
  id: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  coverColor: string;
  coverEmoji: string;
  memberId: string;
  borrower: string;
  borrowerInitials: string;
  borrowerGender?: Gender;
  borrowDate: string;
  dueDate: string;
}

export const activeLoans: ActiveLoan[] = [
  {
    id: "LN-2041",
    bookId: "BK-005",
    bookTitle: "1984",
    bookAuthor: "George Orwell",
    coverColor: "from-slate-800 to-slate-950",
    coverEmoji: "👁️",
    memberId: "MEM-004",
    borrower: "Marc Dubois",
    borrowerInitials: "MD",
    borrowerGender: "M",
    borrowDate: shiftDays(REFERENCE_DATE, -17),
    dueDate: shiftDays(REFERENCE_DATE, -3),
  },
  {
    id: "LN-2042",
    bookId: "BK-006",
    bookTitle: "Sapiens: A Brief History",
    bookAuthor: "Yuval Noah Harari",
    coverColor: "from-yellow-700 to-amber-900",
    coverEmoji: "🌍",
    memberId: "MEM-007",
    borrower: "Lisa Park",
    borrowerInitials: "LP",
    borrowerGender: "F",
    borrowDate: shiftDays(REFERENCE_DATE, -15),
    dueDate: shiftDays(REFERENCE_DATE, -1),
  },
  {
    id: "LN-2043",
    bookId: "BK-002",
    bookTitle: "Le Petit Prince",
    bookAuthor: "A. de Saint-Exupéry",
    coverColor: "from-sky-700 to-blue-900",
    coverEmoji: "👑",
    memberId: "MEM-005",
    borrower: "Emily Chen",
    borrowerInitials: "EC",
    borrowerGender: "F",
    borrowDate: shiftDays(REFERENCE_DATE, -14),
    dueDate: REFERENCE_DATE,
  },
  {
    id: "LN-2044",
    bookId: "BK-007",
    bookTitle: "Clean Code",
    bookAuthor: "Robert C. Martin",
    coverColor: "from-indigo-900 to-violet-950",
    coverEmoji: "💻",
    memberId: "MEM-002",
    borrower: "Jean Dupont",
    borrowerInitials: "JD",
    borrowerGender: "M",
    borrowDate: shiftDays(REFERENCE_DATE, -13),
    dueDate: shiftDays(REFERENCE_DATE, 1),
  },
  {
    id: "LN-2045",
    bookId: "BK-003",
    bookTitle: "Dune",
    bookAuthor: "Frank Herbert",
    coverColor: "from-orange-700 to-amber-900",
    coverEmoji: "🪐",
    memberId: "MEM-003",
    borrower: "Marie Curie",
    borrowerInitials: "MC",
    borrowerGender: "F",
    borrowDate: shiftDays(REFERENCE_DATE, -9),
    dueDate: shiftDays(REFERENCE_DATE, 5),
  },
  {
    id: "LN-2046",
    bookId: "BK-010",
    bookTitle: "Thinking, Fast and Slow",
    bookAuthor: "Daniel Kahneman",
    coverColor: "from-purple-900 to-slate-950",
    coverEmoji: "🧠",
    memberId: "MEM-001",
    borrower: "Sarah Connor",
    borrowerInitials: "SC",
    borrowerGender: "F",
    borrowDate: shiftDays(REFERENCE_DATE, -4),
    dueDate: shiftDays(REFERENCE_DATE, 10),
  },
  {
    id: "LN-2047",
    bookId: "BK-009",
    bookTitle: "A Brief History of Time",
    bookAuthor: "Stephen Hawking",
    coverColor: "from-blue-900 to-indigo-950",
    coverEmoji: "🌌",
    memberId: "MEM-006",
    borrower: "Marcus Johnson",
    borrowerInitials: "MJ",
    borrowerGender: "M",
    borrowDate: shiftDays(REFERENCE_DATE, -2),
    dueDate: shiftDays(REFERENCE_DATE, 12),
  },
];

export const currentUser = {
  name: "Sarah Connor",
  email: "sarah.connor@agbale.app",
  role: "Library Admin",
  gender: "F" as Gender,
  avatar: "SC",
} as const;


export interface Notification {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

export const notifications: Notification[] = [
  {
    id: "NTF-001",
    title: "3 emprunts sont en retard",
    body: "1984, Sapiens et Clean Code ont dépassé leur date d'échéance cette semaine.",
    time: "Il y a 12 minutes",
    read: false,
  },
  {
    id: "NTF-002",
    title: "Nouveau membre inscrit",
    body: "Kathryn Murphy a terminé son inscription et attend une validation.",
    time: "Il y a 1 heure",
    read: false,
  },
  {
    id: "NTF-003",
    title: "Vérification des stocks terminée",
    body: "L'inventaire de la section Fantasy s'est achevé avec 2 écarts.",
    time: "Hier",
    read: true,
  },
];

export interface ActivityEntry {
  id: string;
  member: string;
  action: "Emprunté" | "Retourné" | "Renouvelé" | "Inscrit" | "Signalé en retard";
  bookTitle: string;
  time: string;
  status: "En cours" | "Retourné" | "En retard" | "Nouveau membre";
}

export const dashboardActivities: ActivityEntry[] = [
  {
    id: "ACT-101",
    member: "Emily Chen",
    action: "Emprunté",
    bookTitle: "Le Petit Prince",
    time: "Il y a 2 minutes",
    status: "En cours",
  },
  {
    id: "ACT-102",
    member: "Marie Curie",
    action: "Retourné",
    bookTitle: "Marie Curie: A Life",
    time: "Il y a 45 minutes",
    status: "Retourné",
  },
  {
    id: "ACT-103",
    member: "Marc Dubois",
    action: "Signalé en retard",
    bookTitle: "1984",
    time: "Il y a 3 heures",
    status: "En retard",
  },
  {
    id: "ACT-104",
    member: "Lisa Park",
    action: "Emprunté",
    bookTitle: "Clean Code",
    time: "Il y a 5 heures",
    status: "En cours",
  },
  {
    id: "ACT-105",
    member: "Jean Dupont",
    action: "Renouvelé",
    bookTitle: "Dune",
    time: "Il y a 8 heures",
    status: "En cours",
  },
  {
    id: "ACT-106",
    member: "Kathryn Murphy",
    action: "Inscrit",
    bookTitle: "Aucun emprunt pour le moment",
    time: "Il y a 1 jour",
    status: "Nouveau membre",
  },
];

export const books = initialBooks;
export const members = initialMembers;
export const loans = initialLoans;
export const recentActivities = initialActivities;
