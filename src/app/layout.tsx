import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { ThemeProvider } from "@/components/theme/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Visual-Algo",
  description: "Visualize algorithms",
  icons: {
    icon: [
  // Use relative paths so Next.js basePath (in production) is automatically applied.
  { url: "icon", type: "image/png", sizes: "16x16" },
  { url: "icon", type: "image/png", sizes: "32x32" },
    ],
  // No ICO route in static export; rely on PNG icons
    apple: [
      { url: "apple-icon", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "mask-icon.svg", color: "#0ea5e9" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
        <ThemeProvider>
          <Header />
          <main className="flex-grow container mx-auto p-4">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
