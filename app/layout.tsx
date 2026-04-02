import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import LenisScroll from "@/components/LenisScroll";
import ParticleField from "@/components/ParticleField";

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
    <html lang="en">
      <body className="font-sans antialiased">
        <LenisScroll />
        <ParticleField />
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#0a0a0a",
              color: "#FFD700",
              border: "1px solid #C9A84C",
              fontFamily: "var(--font-outfit)",
            },
          }}
        />
      </body>
    </html>
  );
}
