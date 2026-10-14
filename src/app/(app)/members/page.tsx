import type { Metadata } from "next";
import { MemberDirectoryView } from "@/components/views/MemberDirectoryView";

export const metadata: Metadata = { title: "Répertoire des membres" };

export default function Page() {
  return <MemberDirectoryView />;
}
