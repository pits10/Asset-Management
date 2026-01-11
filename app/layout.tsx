import type { Metadata } from "next";
import "./globals.css";
import { PageShell } from "@/components/layout/page-shell";

export const metadata: Metadata = {
  title: "Financial Trajectory",
  description: "Personal Financial Trajectory OS - Understanding your financial direction",
  manifest: "/manifest.json",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  themeColor: "#0B0F1A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <PageShell>{children}</PageShell>
      </body>
    </html>
  );
}
