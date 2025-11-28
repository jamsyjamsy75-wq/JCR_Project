import Link from "next/link";
import Image from "next/image";

const navItems = [
  { label: "Accueil", href: "#hero" },
  { label: "Live", href: "#live" },
  { label: "Catégories", href: "#categories" },
  { label: "Studios", href: "#studios" },
  { label: "Premium", href: "#premium" },
];

const Header = () => {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/70 py-3 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-3 text-white">
          <Image
            src="/media/XburnCrust2.jpg"
            alt="XBURNCRUST"
            width={42}
            height={42}
            priority
          />
          <span className="font-display text-3xl tracking-[0.2em] text-white">
            XBURNCRUST
          </span>
        </div>

        <nav className="hidden items-center gap-8 text-sm font-semibold uppercase tracking-[0.25em] text-white/80 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="transition hover:text-neon-pink hover:drop-shadow-[0_0_10px_rgba(255,110,199,0.9)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold uppercase tracking-[0.25em] text-white transition hover:border-neon-pink hover:text-neon-pink hover:shadow-glow">
            Connexion
          </button>
          <button className="rounded-full bg-gradient-to-r from-neon-pink to-red-600 px-5 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-glow transition hover:scale-105">
            S’inscrire
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;


