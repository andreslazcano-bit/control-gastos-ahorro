import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DataProvider } from "@/context/DataContext";
import { AuthProvider } from "@/context/AuthContext";
import AuthGate from "@/components/AuthGate";
import NavBar from "@/components/NavBar";
import DataErrorBanner from "@/components/DataErrorBanner";
import RecurringIncomeSync from "@/components/RecurringIncomeSync";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import { THEME_STORAGE_KEY } from "@/lib/theme";

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
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Gastos",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#2a78d6",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Applies the stored theme before first paint, so there's no flash
            of the wrong theme while React hydrates. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t);}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-surface-page text-text-primary">
        <ServiceWorkerRegistration />
        <AuthProvider>
          <AuthGate>
            <DataProvider>
              <RecurringIncomeSync />
              <NavBar />
              <DataErrorBanner />
              <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6">
                {children}
              </main>
            </DataProvider>
          </AuthGate>
        </AuthProvider>
      </body>
    </html>
  );
}
