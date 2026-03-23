"use client";

import "./globals.css";
import { useRouter } from "next/navigation";

import { ToastProvider } from "@/context/ToastContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Button from "@/components/Button";

function Header() {
  const { isAuthenticated, logoutUser, loading } = useAuth();
  const router = useRouter();

  if (loading) return null;

  return (
    <header className="bg-white shadow">
      <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="font-bold text-lg">SIM Sapopemba</h1>

        {isAuthenticated ? (
          <Button
            onClick={async () => {
              await logoutUser();
              router.push("/login");
            }}
            variant="secondary"
          >
            Logout
          </Button>
        ) : (
          <Button onClick={() => router.push("/login")} variant="primary">
            Login
          </Button>
        )}
      </div>
    </header>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-100 text-gray-900">
        <AuthProvider>
          <ToastProvider>
            <Header />

            <main className="max-w-4xl mx-auto px-4 py-6">{children}</main>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
