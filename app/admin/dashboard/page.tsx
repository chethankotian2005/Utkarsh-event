"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { onAuthChange, signOut, ADMIN_EMAIL } from "@/lib/auth";
import {
  subscribeTreasureHunt,
  subscribeViralSelfie,
  TreasureHuntRegistration,
  ViralSelfieRegistration,
} from "@/lib/firestore";
import { User } from "firebase/auth";

type Tab = "overview" | "treasure" | "selfie";

function exportCSV(
  data: (TreasureHuntRegistration | ViralSelfieRegistration)[],
  filename: string,
  isTreasure: boolean
) {
  const headers = isTreasure
    ? ["Team Name", "Lead Name", "Lead USN", "Lead Phone", "P1", "P2", "P3", "P4", "Registered At"]
    : ["Team Name", "Lead Name", "Lead USN", "Lead Phone", "Members", "Registered At"];

  const rows = data.map((d) => {
    const base = [
      `"${d.teamName}"`,
      `"${d.teamLeadName}"`,
      `"${d.teamLeadUSN}"`,
      `"${d.teamLeadPhone}"`,
    ];
    if (isTreasure) {
      const th = d as TreasureHuntRegistration;
      const parts = th.participants || [];
      return [
        ...base,
        `"${parts[0] || ""}"`,
        `"${parts[1] || ""}"`,
        `"${parts[2] || ""}"`,
        `"${parts[3] || ""}"`,
        `"${d.registeredAt ? new Date(d.registeredAt).toLocaleString() : ""}"`,
      ].join(",");
    } else {
      const vs = d as ViralSelfieRegistration;
      return [
        ...base,
        `"${(vs.participants || []).join("; ")}"`,
        `"${d.registeredAt ? new Date(d.registeredAt).toLocaleString() : ""}"`,
      ].join(",");
    }
  });

  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function StatsCard({
  count,
  label,
  icon,
}: {
  count: number;
  label: string;
  icon: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="stat-card p-8 flex flex-col gap-3"
    >
      <span style={{ fontSize: "2rem" }}>{icon}</span>
      <p
        className="gold-text"
        style={{
          fontFamily: "var(--font-cormorant)",
          fontSize: "3.5rem",
          fontWeight: 700,
          lineHeight: 1,
        }}
      >
        {count}
      </p>
      <p
        style={{
          fontFamily: "var(--font-space-mono)",
          fontSize: "0.65rem",
          color: "rgba(201,168,76,0.6)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </p>
    </motion.div>
  );
}

function RegistrationsTable({
  data,
  isTreasure,
  onExport,
}: {
  data: (TreasureHuntRegistration | ViralSelfieRegistration)[];
  isTreasure: boolean;
  onExport: () => void;
}) {
  const [search, setSearch] = useState("");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const filtered = data.filter(
    (d) =>
      d.teamName.toLowerCase().includes(search.toLowerCase()) ||
      d.teamLeadUSN.toLowerCase().includes(search.toLowerCase()) ||
      d.teamLeadName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by team name, USN, or lead name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-gold flex-1"
          style={{
            background: "rgba(201,168,76,0.05)",
            border: "1px solid rgba(201,168,76,0.2)",
            borderRadius: 8,
            padding: "10px 14px",
          }}
        />
        <button onClick={onExport} className="btn-ghost-gold px-6 py-2 rounded text-xs whitespace-nowrap">
          ↓ Export CSV
        </button>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Team Name</th>
              <th>Lead Name</th>
              <th>USN</th>
              <th>Phone</th>
              {isTreasure ? <th>Members</th> : <th>Group Size</th>}
              <th>Registered At</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  style={{ textAlign: "center", color: "rgba(255,255,255,0.2)", padding: 32 }}
                >
                  {search ? "No results found." : "No registrations yet."}
                </td>
              </tr>
            )}
            {filtered.map((row, i) => {
              const isExpanded = expandedRow === row.id;
              const participants =
                isTreasure
                  ? (row as TreasureHuntRegistration).participants || []
                  : (row as ViralSelfieRegistration).participants || [];
              return (
                <>
                  <tr
                    key={row.id}
                    onClick={() => setExpandedRow(isExpanded ? null : (row.id || null))}
                    style={{ cursor: "pointer" }}
                  >
                    <td style={{ color: "rgba(201,168,76,0.5)", fontFamily: "var(--font-space-mono)", fontSize: "0.7rem" }}>
                      {i + 1}
                    </td>
                    <td style={{ color: "var(--gold-light)", fontWeight: 600 }}>{row.teamName}</td>
                    <td>{row.teamLeadName}</td>
                    <td style={{ fontFamily: "var(--font-space-mono)", fontSize: "0.75rem" }}>{row.teamLeadUSN}</td>
                    <td style={{ fontFamily: "var(--font-space-mono)", fontSize: "0.75rem" }}>{row.teamLeadPhone}</td>
                    <td>
                      {isTreasure
                        ? `${participants.length} members`
                        : participants.length > 0
                        ? `Group of ${participants.length + 1}`
                        : "Individual"}
                    </td>
                    <td style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.78rem" }}>
                      {row.registeredAt
                        ? new Date(row.registeredAt).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : "—"}
                    </td>
                  </tr>
                  {isExpanded && participants.length > 0 && (
                    <tr key={`${row.id}-exp`}>
                      <td colSpan={7} style={{ padding: "8px 16px 16px 16px" }}>
                        <div
                          style={{
                            background: "rgba(201,168,76,0.05)",
                            border: "1px solid rgba(201,168,76,0.15)",
                            borderRadius: 8,
                            padding: "12px 16px",
                          }}
                        >
                          <p
                            style={{
                              fontFamily: "var(--font-space-mono)",
                              fontSize: "0.6rem",
                              color: "rgba(201,168,76,0.5)",
                              letterSpacing: "0.12em",
                              textTransform: "uppercase",
                              marginBottom: 8,
                            }}
                          >
                            Participants
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {participants.map((name: string, idx: number) => (
                              <span
                                key={idx}
                                style={{
                                  background: "rgba(201,168,76,0.1)",
                                  border: "1px solid rgba(201,168,76,0.2)",
                                  borderRadius: 6,
                                  padding: "4px 10px",
                                  fontSize: "0.8rem",
                                  color: "rgba(255,255,255,0.8)",
                                }}
                              >
                                {name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>

      <p
        style={{
          fontFamily: "var(--font-space-mono)",
          fontSize: "0.62rem",
          color: "rgba(255,255,255,0.2)",
          marginTop: 12,
          letterSpacing: "0.08em",
        }}
      >
        {filtered.length} record{filtered.length !== 1 ? "s" : ""} {search ? "found" : "total"} • Click a row to expand
      </p>
    </div>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("overview");
  const [treasureData, setTreasureData] = useState<TreasureHuntRegistration[]>([]);
  const [selfieData, setSelfieData] = useState<ViralSelfieRegistration[]>([]);

  useEffect(() => {
    const unsub = onAuthChange((u) => {
      if (!u || u.email !== ADMIN_EMAIL) {
        router.push("/admin");
        return;
      }
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, [router]);

  useEffect(() => {
    if (!user) return;
    const unsubT = subscribeTreasureHunt(setTreasureData);
    const unsubS = subscribeViralSelfie(setSelfieData);
    return () => {
      unsubT();
      unsubS();
    };
  }, [user]);

  const handleSignOut = useCallback(async () => {
    await signOut();
    router.push("/admin");
  }, [router]);

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

  const sidebarLinks: { id: Tab; label: string; icon: string }[] = [
    { id: "overview", label: "Overview", icon: "◈" },
    { id: "treasure", label: "Treasure Hunt", icon: "🏴" },
    { id: "selfie", label: "Viral Selfie", icon: "📸" },
  ];

  return (
    <div className="min-h-screen bg-black flex" style={{ zIndex: 2 }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 240,
          minHeight: "100vh",
          background: "#050505",
          borderRight: "1px solid rgba(201,168,76,0.15)",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: "24px 20px",
            borderBottom: "1px solid rgba(201,168,76,0.1)",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div className="relative w-8 h-8 shrink-0">
            <Image
              src="/utkarsh-logo.jpg"
              alt="Utkarsh"
              fill
              sizes="32px"
              className="object-contain rounded-full logo-glow"
            />
          </div>
          <div>
            <p
              className="gold-text"
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "1rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
              }}
            >
              UTKARSH
            </p>
            <p
              style={{
                fontFamily: "var(--font-space-mono)",
                fontSize: "0.5rem",
                color: "rgba(201,168,76,0.4)",
                letterSpacing: "0.1em",
              }}
            >
              ADMIN PANEL
            </p>
          </div>
        </div>

        {/* Nav links */}
        <nav style={{ padding: "16px 12px", flex: 1 }}>
          {sidebarLinks.map((link) => (
            <button
              key={link.id}
              id={`sidebar-${link.id}`}
              onClick={() => setTab(link.id)}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "10px 12px",
                borderRadius: 8,
                border: "none",
                background:
                  tab === link.id
                    ? "rgba(201,168,76,0.12)"
                    : "transparent",
                borderLeft:
                  tab === link.id
                    ? "2px solid var(--gold)"
                    : "2px solid transparent",
                color: tab === link.id ? "var(--gold-light)" : "rgba(255,255,255,0.4)",
                cursor: "pointer",
                fontSize: "0.82rem",
                fontFamily: "var(--font-dm-sans)",
                marginBottom: 4,
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
              {link.id === "treasure" && (
                <span
                  style={{
                    marginLeft: "auto",
                    background: "rgba(201,168,76,0.2)",
                    color: "var(--gold)",
                    fontSize: "0.65rem",
                    padding: "1px 6px",
                    borderRadius: 4,
                    fontFamily: "var(--font-space-mono)",
                  }}
                >
                  {treasureData.length}
                </span>
              )}
              {link.id === "selfie" && (
                <span
                  style={{
                    marginLeft: "auto",
                    background: "rgba(201,168,76,0.2)",
                    color: "var(--gold)",
                    fontSize: "0.65rem",
                    padding: "1px 6px",
                    borderRadius: 4,
                    fontFamily: "var(--font-space-mono)",
                  }}
                >
                  {selfieData.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* User info + logout */}
        <div
          style={{
            padding: "16px 20px",
            borderTop: "1px solid rgba(201,168,76,0.1)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-space-mono)",
              fontSize: "0.58rem",
              color: "rgba(255,255,255,0.25)",
              letterSpacing: "0.06em",
              marginBottom: 10,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {user?.email}
          </p>
          <button
            id="admin-logout"
            onClick={handleSignOut}
            className="btn-ghost-gold w-full py-2 rounded text-xs"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "40px 32px", overflow: "auto" }}>
        <AnimatePresence mode="wait">
          {tab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h1
                className="font-display gold-text"
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "2.2rem",
                  fontWeight: 600,
                  marginBottom: 8,
                }}
              >
                Dashboard Overview
              </h1>
              <p
                style={{
                  fontFamily: "var(--font-space-mono)",
                  fontSize: "0.65rem",
                  color: "rgba(255,255,255,0.2)",
                  letterSpacing: "0.1em",
                  marginBottom: 40,
                }}
              >
                REAL-TIME REGISTRATIONS — MY SMVITM, MY PRIDE
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl">
                <StatsCard
                  count={treasureData.length}
                  label="Treasure Hunt Teams"
                  icon="🏴"
                />
                <StatsCard
                  count={selfieData.length}
                  label="Viral Selfie Entries"
                  icon="📸"
                />
              </div>

              <div className="gold-line mt-12 mb-8" style={{ maxWidth: 480 }} />

              <p
                style={{
                  fontFamily: "var(--font-space-mono)",
                  fontSize: "0.65rem",
                  color: "rgba(201,168,76,0.4)",
                  letterSpacing: "0.1em",
                }}
              >
                ● LIVE — Updates in real-time via Firestore
              </p>
            </motion.div>
          )}

          {tab === "treasure" && (
            <motion.div
              key="treasure"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h1
                className="font-display gold-text"
                style={{ fontFamily: "var(--font-cormorant)", fontSize: "2.2rem", fontWeight: 600, marginBottom: 32 }}
              >
                Treasure Hunt Registrations
              </h1>
              <RegistrationsTable
                data={treasureData}
                isTreasure={true}
                onExport={() =>
                  exportCSV(treasureData, "treasure-hunt-registrations.csv", true)
                }
              />
            </motion.div>
          )}

          {tab === "selfie" && (
            <motion.div
              key="selfie"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h1
                className="font-display gold-text"
                style={{ fontFamily: "var(--font-cormorant)", fontSize: "2.2rem", fontWeight: 600, marginBottom: 32 }}
              >
                Viral Selfie Registrations
              </h1>
              <RegistrationsTable
                data={selfieData}
                isTreasure={false}
                onExport={() =>
                  exportCSV(selfieData, "viral-selfie-registrations.csv", false)
                }
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
