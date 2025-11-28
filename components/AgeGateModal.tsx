"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "xburncrust-age-verified";

const AgeGateModal = () => {
  const [isReady, setIsReady] = useState(false);
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.localStorage.getItem(STORAGE_KEY) !== "true";
  });

  useEffect(() => {
    setIsReady(true);
  }, []);

  const handleConfirm = useCallback(() => {
    setIsOpen(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, "true");
    }
  }, []);

  if (!isReady || !isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 backdrop-blur-md">
      <div className="max-w-md rounded-3xl border border-neon-pink/40 bg-gradient-to-b from-night to-obsidian p-10 text-center shadow-glow">
        <p className="text-sm uppercase tracking-[0.5em] text-neon-pink">
          Avertissement NSFW
        </p>
        <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.3em] text-white">
          18+ requis
        </h2>
        <p className="mt-4 text-sm text-white/70">
          En entrant sur xburncrust vous certifiez avoir plus de 18 ans et
          accepter de voir du contenu sexuellement explicite.
        </p>
        <button
          onClick={handleConfirm}
          className="mt-8 w-full rounded-full bg-gradient-to-r from-neon-pink via-pink-600 to-red-600 py-3 text-sm font-semibold uppercase tracking-[0.4em] text-white shadow-glow transition hover:scale-[1.02]"
        >
          entrer
        </button>
      </div>
    </div>
  );
};

export default AgeGateModal;

