import type { Metadata } from "next";
import { BorrowReturnView } from "@/components/views/BorrowReturnView";

export const metadata: Metadata = { title: "Prêts / Retours" };

export default function Page() {
  return <BorrowReturnView />;
}
