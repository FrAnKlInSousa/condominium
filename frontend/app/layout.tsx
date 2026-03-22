import "./globals.css";

export const metadata = {
  title: "Condominium",
  description: "Sistema de informativos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-100 text-gray-900">
        <header className="bg-white shadow">
          <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="font-bold text-lg">Condominium</h1>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
