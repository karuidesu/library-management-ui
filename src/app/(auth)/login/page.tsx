import type { Metadata } from "next";
import { LoginView } from "@/components/views/LoginView";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connectez-vous à votre espace Agbale.",
};

export default function LoginPage() {
  return <LoginView />;
}
