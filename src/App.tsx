import React, { useState } from "react";
import { motion } from "framer-motion";

// --- Optional: if you use shadcn/ui in your project ---
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";

/**
 * Variacle-styled single-file React page
 * - Dark twilight gradient, neon purple/blue accents
 * - Pixel logo on the left, simple nav on the right
 * - Hash input with validation and POST to backend
 * - Subtle motion + accessible states
 *
 * Usage:
 *  - Put your PNG logo at `/public/variacle-logo.png` (or adjust the src below)
 *  - Mount <App /> as your root component
 *  - Backend endpoint: set API_PATH below or pass via `apiPath` prop
 */

const API_PATH_DEFAULT = "https://backend-m6cm.onrender.com/submit"; // change if needed

export default function App({ apiPath = API_PATH_DEFAULT, logoSrc = "/variacle-logo.png" }: { apiPath?: string; logoSrc?: string }) {
  const [hash, setHash] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const isValidHash = (s: string) => {
    // Allow common hex digests (MD5 32, SHA1 40, SHA256 64, SHA512 128) or base64-ish
    const hexOk = /^[0-9a-fA-F]{16,128}$/.test(s);
    const b64Ok = /^[A-Za-z0-9+/=]{16,200}$/.test(s);
    return hexOk || b64Ok;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!isValidHash(hash.trim())) {
      setStatus("error");
      setMessage("Please paste a valid hash (hex or base64).");
      return;
    }

    try {
      setStatus("loading");
      const res = await fetch(apiPath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cipher_b64: hash.trim() }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed with ${res.status}`);
      }

      const data = await res.json().catch(() => ({}));
      setStatus("success");
      setMessage(data?.message || "Hash received. Thanks!");
      setHash("");
    } catch (err: any) {
      setStatus("error");
      setMessage(err?.message || "Something went wrong. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1022] via-[#101735] to-[#0b0f24] text-white">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-white/5">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoSrc} alt="Variacle" className="h-8 w-auto"/>
            <span className="sr-only">Variacle</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-white/80">
            {['Mission','Solution','Market','Journey','Contact'].map((item) => (
              <a key={item} className="hover:text-white transition" href={`#${item.toLowerCase()}`}>{item}</a>
            ))}
            <a href="#get-in-touch" className="px-3 py-1.5 rounded-full border border-white/20 hover:border-white/40 transition">Get in touch</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        {/* Glow accents */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -left-24 h-72 w-72 rounded-full blur-3xl opacity-30"
               style={{ background: "radial-gradient(closest-side, #7c4dff, transparent)" }} />
          <div className="absolute -bottom-16 -right-24 h-72 w-72 rounded-full blur-3xl opacity-30"
               style={{ background: "radial-gradient(closest-side, #00e5ff, transparent)" }} />
        </div>

        <div className="mx-auto max-w-4xl px-4 pt-16 pb-6">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl font-semibold tracking-tight text-white"
          >
            Your data <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b388ff] to-[#80deea]">never leaves</span>
          </motion.h1>
          <p className="mt-4 text-white/70 max-w-2xl">
            Download our estimator, run it easily on your computer, and securely submit the hash code it produces.
          </p>

          {/* Stat Pills */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "TRIALS SHELVED GLOBALLY", value: "90%" },
              { label: "CAPITAL EFFICIENCY", value: "\u2193 Costs" },
              { label: "FEWER PATIENTS NEEDED", value: "\u2191 Ethics" },
              { label: "NEXT PARADIGM", value: "RWD \u2794 Causal" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl p-4 border border-white/10 bg-white/5">
                <div className="text-xl font-semibold">{s.value}</div>
                <div className="text-xs mt-1 tracking-wide text-white/60">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hash Form */}
      <section className="mx-auto max-w-4xl px-4 pb-24">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8 shadow-2xl">
          <h2 className="text-xl md:text-2xl font-semibold">Submit your partial evidence</h2>
          <p className="mt-2 text-sm text-white/70">First, download our estimator and open it in your web browser. Simply copy and paste your data to run it locally. It will generate a code string — that’s the one you need to paste below.</p>
<a
                href="/encoder.zip"
                download
                className="px-5 py-2.5 rounded-2xl border border-white/20 bg-white/10 hover:bg-white/15 text-white font-semibold shadow inline-flex items-center justify-center"
              >
                Download estimator
              </a>
          <form onSubmit={onSubmit} className="mt-6 grid gap-4">
            <label htmlFor="hash" className="text-sm text-white/80">Hash string</label>
            <input
              id="hash"
              type="text"
              inputMode="text"
              spellCheck={false}
              autoComplete="off"
              placeholder="e.g., 9e107d9d372bb6826bd81d3542a419d6 (MD5) or SHA256"
              value={hash}
              onChange={(e) => setHash(e.target.value)}
              className="w-full rounded-2xl bg-[#0e1631] border border-white/10 focus:border-[#80deea]/60 focus:ring-2 focus:ring-[#80deea]/30 px-4 py-3 outline-none placeholder:text-white/30"
            />

            <div className="flex items-center gap-3 mt-2">
               
              <button
                type="submit"
                disabled={status === "loading"}
                className="px-5 py-2.5 rounded-2xl border border-white/20 bg-gradient-to-r from-[#6a4cff] to-[#00e5ff] text-black font-semibold disabled:opacity-60 disabled:cursor-not-allowed shadow"
              >
                {status === "loading" ? "Sending…" : "Send hash"}
              </button>
             
              <span className="text-sm text-white/60">Endpoint: <code className="text-white/90">{apiPath}</code></span>
            </div>

            {/* Status messages */}
            {status !== "idle" && (
              <div aria-live="polite" className="mt-3 text-sm">
                {status === "success" && (
                  <div className="text-[#b5ffcc]">{message}</div>
                )}
                {status === "error" && (
                  <div className="text-[#ffb3c1]">{message}</div>
                )}
              </div>
            )}
          </form>

          {/* Developer notes */}
          <details className="mt-6 text-xs text-white/50">
            <summary className="cursor-pointer hover:text-white/70">Implementation notes</summary>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Adjust <code>API_PATH_DEFAULT</code> or pass <code>apiPath</code> prop.</li>
              <li>Server should accept JSON <code>{`{ hash: string }`}</code> and return JSON with a <code>message</code> field.</li>
              <li>For Next.js, create <code>app/api/submit-hash/route.ts</code> (Edge/runtime OK).</li>
            </ul>
          </details>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-sm text-white/50">
        © {new Date().getFullYear()} Variacle. All rights reserved.
      </footer>
    </div>
  );
}
