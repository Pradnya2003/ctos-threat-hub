"use client";
 
import { ThemeProvider } from "next-themes";
import { CreditsProvider } from "@/context/CreditsContext";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <CreditsProvider>
          {children}
          <Toaster position="top-right" richColors theme="dark" />
        </CreditsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
