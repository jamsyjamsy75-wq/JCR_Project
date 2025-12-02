const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-black/80 py-10 text-center text-xs text-white/60">
      <p className="uppercase tracking-[0.4em] text-white/70">
        © {new Date().getFullYear()} xburncrust
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-6 text-[11px] font-semibold uppercase tracking-[0.4em]">
        <a
          href="#legal"
          className="transition hover:text-neon-pink hover:shadow-glow"
        >
          CGU
        </a>
        <a
          href="#dmca"
          className="transition hover:text-neon-pink hover:shadow-glow"
        >
          DMCA
        </a>
        <a
          href="#privacy"
          className="transition hover:text-neon-pink hover:shadow-glow"
        >
          confidentialité
        </a>
        <a
          href="#support"
          className="transition hover:text-neon-pink hover:shadow-glow"
        >
          support
        </a>
      </div>
    </footer>
  );
};

export default Footer;



