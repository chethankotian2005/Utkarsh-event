"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative pt-0" style={{ zIndex: 2 }}>
      {/* Animated gold gradient line */}
      <div className="gold-line" />

      <div className="py-12 px-6 flex flex-col items-center gap-6">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative w-14 h-14"
        >
          <Image
            src="/utkarsh-logo.jpg"
            alt="Utkarsh SMVITM"
            fill
            sizes="56px"
            className="object-contain rounded-full logo-glow"
          />
        </motion.div>

        {/* Brand */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display gold-text text-2xl font-semibold tracking-widest"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          UTKARSH
        </motion.p>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-display"
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "1.1rem",
            color: "rgba(201,168,76,0.6)",
            fontStyle: "italic",
            letterSpacing: "0.06em",
          }}
        >
          My SMVITM, My Pride
        </motion.p>

        {/* Divider */}
        <div
          style={{
            width: 40,
            height: 1,
            background: "rgba(201,168,76,0.3)",
          }}
        />

        {/* Copyright */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{
            fontFamily: "var(--font-space-mono)",
            fontSize: "0.62rem",
            color: "rgba(255,255,255,0.2)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            textAlign: "center",
          }}
        >
          © {currentYear} SMVITM Media Team — All Rights Reserved
        </motion.p>

        <p
          style={{
            fontFamily: "var(--font-space-mono)",
            fontSize: "0.58rem",
            color: "rgba(201,168,76,0.2)",
            letterSpacing: "0.1em",
          }}
        >
          Shri Madhwa Vadiraja Institute of Technology & Management
        </p>
      </div>
    </footer>
  );
}
