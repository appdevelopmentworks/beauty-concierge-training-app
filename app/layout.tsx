import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AppShell } from "@/components/app-shell";

import "./globals.css";

const metadataBase = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: "Beauty Concierge Training App",
    template: "%s | Beauty Concierge Training App",
  },
  description: "SBCコンシェルジュ向けのスマホファーストな初月研修MVP。",
  applicationName: "Beauty Concierge Training App",
  openGraph: {
    title: "Beauty Concierge Training App",
    description: "SBCコンシェルジュ向けのスマホファーストな初月研修MVP。",
    type: "website",
    locale: "ja_JP",
    siteName: "Beauty Concierge Training App",
  },
  twitter: {
    card: "summary_large_image",
    title: "Beauty Concierge Training App",
    description: "SBCコンシェルジュ向けのスマホファーストな初月研修MVP。",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body className="font-sans text-foreground">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
