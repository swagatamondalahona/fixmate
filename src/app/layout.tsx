
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import AppShell from "@/components/shared/AppShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FixMate | Home Service Platform",
  description:
    "Find trusted technicians for smart device and home appliance repair services.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var savedTheme = localStorage.getItem("fixmate-theme");
                  var theme =
                    savedTheme === "light" || savedTheme === "dark"
                      ? savedTheme
                      : "dark";

                  document.documentElement.setAttribute(
                    "data-theme",
                    theme
                  );
                } catch (error) {
                  document.documentElement.setAttribute(
                    "data-theme",
                    "dark"
                  );
                }
              })();
            `,
          }}
        />
      </head>

      <body className="min-h-full flex flex-col">
        <Suspense fallback={null}>
          <AppShell>{children}</AppShell>
        </Suspense>
      </body>
    </html>
  );
}
