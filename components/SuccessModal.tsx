"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import dynamic from "next/dynamic";

const ConfettiCanvas = dynamic(() => import("./ConfettiCanvas"), { ssr: false });

interface SuccessModalProps {
  isOpen: boolean;
  teamName: string;
  eventName: string;
  onClose: () => void;
}

export default function SuccessModal({
  isOpen,
  teamName,
  eventName,
  onClose,
}: SuccessModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <ConfettiCanvas />

          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              className="glass-card p-10 flex flex-col items-center gap-6 text-center mx-6"
              style={{ maxWidth: 480, width: "100%", zIndex: 1001 }}
              initial={{ scale: 0.7, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 20, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Logo */}
              <div className="relative w-20 h-20">
                <Image
                  src="/utkarsh-logo.jpg"
                  alt="Utkarsh"
                  fill
                  sizes="80px"
                  className="object-contain rounded-full logo-glow"
                />
              </div>

              {/* Gold checkmark */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--gold-dark), var(--gold-light))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 30px rgba(255,215,0,0.4)",
                }}
              >
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path
                    d="M7 16L13 22L25 10"
                    stroke="#000"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>

              {/* Text */}
              <div>
                <h2
                  className="font-display gold-text"
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "2rem",
                    fontWeight: 600,
                  }}
                >
                  You&apos;re Registered!
                </h2>
                <p style={{ color: "rgba(255,255,255,0.6)", marginTop: 8, fontSize: "0.9rem" }}>
                  Team <span style={{ color: "var(--gold-light)", fontWeight: 600 }}>{teamName}</span> has
                  been successfully registered for
                </p>
                <p
                  className="gold-text-animated"
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "1.3rem",
                    fontWeight: 600,
                    marginTop: 4,
                  }}
                >
                  {eventName}
                </p>
              </div>

              {/* Tagline */}
              <p
                style={{
                  fontFamily: "var(--font-space-mono)",
                  fontSize: "0.65rem",
                  color: "var(--gold-muted)",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                My SMVITM, My Pride
              </p>

              {/* Close button */}
              <button
                id="success-modal-close"
                onClick={onClose}
                className="btn-gold px-10 py-3 rounded text-sm w-full"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
