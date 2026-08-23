import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DataProvider } from "@/context/DataContext";
import PinGate from "@/components/PinGate";
import NavBar from "@/components/NavBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Control de gastos y ahorro",
  description: "Seguimiento personal de gastos, presupuestos y metas de ahorro.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-surface-page text-text-primary">
        <DataProvider>
          <PinGate>
            <NavBar />
            <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6">
              {children}
            </main>
          </PinGate>
        </DataProvider>
      </body>
    </html>
  );
}
