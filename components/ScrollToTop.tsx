"use client";

import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Afficher le bouton après 300px de scroll
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToFilters = () => {
    const feedSection = document.getElementById("feed");
    if (feedSection) {
      feedSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToFilters}
          className="fixed bottom-8 right-8 z-40 flex h-14 w-14 items-center justify-center rounded-full border-2 border-neon-pink bg-obsidian/80 text-neon-pink shadow-glow backdrop-blur-sm transition hover:scale-110 hover:bg-neon-pink hover:text-white active:scale-95"
          aria-label="Retour en haut"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 15.75l7.5-7.5 7.5 7.5"
            />
          </svg>
        </button>
      )}
    </>
  );
}
