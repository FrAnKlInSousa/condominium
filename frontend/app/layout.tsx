"use client";

import "./globals.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { ToastProvider } from "@/context/ToastContext";
import { getMe, logout } from "@/lib/api";
import Button from "@/components/Button";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        await getMe();
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      }
    }

    checkAuth();
  }, []);

  async function handleLogout() {
    try {
      await logout();
      setIsAuthenticated(false);
      router.push("/login");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <html lang="pt-BR">
      <body className="bg-gray-100 text-gray-900">
        <ToastProvider>
          <header className="bg-white shadow">
            <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
              <h1 className="font-bold text-lg">SIM Sapopemba</h1>

              {isAuthenticated ? (
                <Button onClick={handleLogout} variant="secondary">
                  Logout
                </Button>
              ) : (
                <Button onClick={() => router.push("/login")} variant="primary">
                  Login
                </Button>
              )}
            </div>
          </header>

          <main className="max-w-4xl mx-auto px-4 py-6">{children}</main>
        </ToastProvider>
      </body>
    </html>
  );
}
