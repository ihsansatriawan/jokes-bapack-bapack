import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jokes Bapak-Bapak",
  description: "Generator jokes receh untuk para ayah Indonesia",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
