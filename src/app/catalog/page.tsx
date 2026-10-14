import type { Metadata } from "next";
import { BookCatalogView } from "@/components/views/BookCatalogView";

export const metadata: Metadata = { title: "Catalogue de livres" };

export default function Page() {
  return <BookCatalogView />;
}
