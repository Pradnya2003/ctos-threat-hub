"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChatbot from "@/components/AIChatbot";
import { useAuth } from "@/context/AuthContext";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  const { isAuthenticated } = useAuth();

  // If not authenticated and not on login page, we'll be redirected anyway by AuthProvider
  // but we can hide the layout elements early.
  const showLayout = isAuthenticated && !isLoginPage;

  return (
    <>
      {showLayout && <Navbar />}
      <main className="flex-grow">{children}</main>
      {showLayout && <AIChatbot />}
      {showLayout && <Footer />}
    </>
  );
}
