import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, Space_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "My SMVITM, My Pride — Utkarsh Media Team",
  description:
    "Register for Treasure Hunt and SMVITM Viral Selfie events. Utkarsh — SMVITM Media Team's flagship campaign 'My SMVITM, My Pride'.",
  keywords: ["SMVITM", "Utkarsh", "Media Team", "Treasure Hunt", "Viral Selfie", "Event Registration"],
  openGraph: {
    title: "My SMVITM, My Pride — Utkarsh",
    description: "Join the grandest event campaign by SMVITM Media Team. Register now for Treasure Hunt & Viral Selfie.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable} ${spaceMono.variable}`}>
      <body className="font-sans bg-black text-white antialiased">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#0a0a0a",
              color: "#FFD700",
              border: "1px solid #C9A84C",
              fontFamily: "var(--font-dm-sans)",
            },
          }}
        />
      </body>
    </html>
  );
}
