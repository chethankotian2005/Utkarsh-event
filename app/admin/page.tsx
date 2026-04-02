"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { signInWithGoogle, onAuthChange, ADMIN_EMAIL } from "@/lib/auth";

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsub = onAuthChange((u) => {
      setLoading(false);
      if (u && u.email === ADMIN_EMAIL) {
        router.push("/admin/dashboard");
      }
    });
    return () => unsub();
  }, [router]);

  const handleSignIn = async () => {
    setSigningIn(true);
    setError("");
    const result = await signInWithGoogle();
    setSigningIn(false);
    if (!result.success) {
      setError(result.error || "Sign-in failed.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div
          style={{
            width: 48,
            height: 48,
            border: "3px solid rgba(201,168,76,0.2)",
            borderTopColor: "var(--gold)",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6" style={{ zIndex: 2 }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="glass-card p-10 flex flex-col items-center gap-8 text-center"
        style={{ maxWidth: 440, width: "100%" }}
      >
        {/* Logo */}
        <div className="relative w-24 h-24">
          <Image
            src="/utkarsh-logo.jpg"
            alt="Utkarsh"
            fill
            sizes="96px"
            className="object-contain rounded-full logo-glow"
            priority
          />
        </div>

        {/* Brand */}
        <div>
          <h1
            className="font-display gold-text"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "2rem",
              fontWeight: 600,
              letterSpacing: "0.06em",
            }}
          >
            UTKARSH
          </h1>
          <p
            style={{
              fontFamily: "var(--font-space-mono)",
              fontSize: "0.6rem",
              color: "rgba(201,168,76,0.5)",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginTop: 4,
            }}
          >
            Admin Access
          </p>
        </div>

        <div className="gold-line w-full" />

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: "rgba(229, 115, 115, 0.1)",
              border: "1px solid rgba(229, 115, 115, 0.3)",
              borderRadius: 8,
              padding: "10px 16px",
              width: "100%",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-space-mono)",
                fontSize: "0.68rem",
                color: "#e57373",
              }}
            >
              ⚠ {error}
            </p>
          </motion.div>
        )}

        {/* Description */}
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem", lineHeight: 1.6 }}>
          This panel is restricted to authorised SMVITM Media Team members only. Sign in with your institute Google account to continue.
        </p>

        {/* Sign In Button */}
        <button
          id="admin-google-signin"
          onClick={handleSignIn}
          disabled={signingIn}
          className="btn-gold w-full py-4 rounded flex items-center justify-center gap-3"
        >
          {signingIn ? (
            <>
              <span className="spinner" />
              Signing in...
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#000" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#000" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#000" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#000" />
              </svg>
              Sign in with Google
            </>
          )}
        </button>

        <p
          style={{
            fontFamily: "var(--font-space-mono)",
            fontSize: "0.58rem",
            color: "rgba(255,255,255,0.15)",
            letterSpacing: "0.08em",
          }}
        >
          Only media.smvitm@sode-edu.in is authorised
        </p>
      </motion.div>
    </div>
  );
}
