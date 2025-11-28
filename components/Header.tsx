"use client";

import { useState } from "react";
import Image from "next/image";

const navItems = [
  { label: "Accueil", href: "#hero" },
  { label: "Live", href: "#live" },
  { label: "Catégories", href: "#categories" },
  { label: "Studios", href: "#studios" },
  { label: "Premium", href: "#premium" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/70 py-3 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-3 text-white">
          <Image
            src="https://res.cloudinary.com/dbtuww2ie/image/upload/q_auto,f_auto,w_100/lustleak/media/XburnCrust2"
            alt="XBURNCRUST"
            width={42}
            height={42}
            priority
          />
          <span className="font-display text-2xl tracking-[0.2em] text-white md:text-3xl">
            XBURNCRUST
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 text-sm font-semibold uppercase tracking-[0.25em] text-white/80 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="transition hover:text-neon-pink hover:drop-shadow-[0_0_10px_rgba(255,110,199,0.9)]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden items-center gap-3 lg:flex">
          <button className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold uppercase tracking-[0.25em] text-white transition hover:border-neon-pink hover:text-neon-pink hover:shadow-glow">
            Connexion
          </button>
          <button className="rounded-full bg-gradient-to-r from-neon-pink to-red-600 px-5 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-glow transition hover:scale-105">
            S'inscrire
          </button>
        </div>

        {/* Mobile Burger Button */}
        <button
          onClick={toggleMenu}
          className="flex flex-col gap-1.5 lg:hidden"
          aria-label="Menu"
        >
          <span
            className={`h-0.5 w-6 bg-white transition-all ${
              isMenuOpen ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`h-0.5 w-6 bg-white transition-all ${
              isMenuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`h-0.5 w-6 bg-white transition-all ${
              isMenuOpen ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`overflow-hidden transition-all duration-300 lg:hidden ${
          isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col gap-4 border-t border-white/10 bg-black/90 px-6 py-6">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={closeMenu}
              className="text-sm font-semibold uppercase tracking-[0.25em] text-white/80 transition hover:text-neon-pink"
            >
              {item.label}
            </a>
          ))}
          <div className="mt-4 flex flex-col gap-3">
            <button className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold uppercase tracking-[0.25em] text-white transition hover:border-neon-pink hover:text-neon-pink">
              Connexion
            </button>
            <button className="rounded-full bg-gradient-to-r from-neon-pink to-red-600 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-glow transition hover:scale-105">
              S'inscrire
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;


