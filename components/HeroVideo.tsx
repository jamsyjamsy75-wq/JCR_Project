const HeroVideo = () => {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-night"
    >
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        poster="https://res.cloudinary.com/demo/image/upload/v1720000000/xburncrust/hero-poster.webp"
      >
        <source
          src="https://res.cloudinary.com/demo/video/upload/q_auto,f_auto/v1720000000/xburncrust/hero-loop.mp4"
          type="video/mp4"
        />
        <source
          src="https://res.cloudinary.com/demo/video/upload/q_auto,f_auto/v1720000000/xburncrust/hero-loop.webm"
          type="video/webm"
        />
      </video>

      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-night" />
      <div className="absolute inset-0 bg-grid opacity-40" />

      <div className="relative z-10 flex max-w-4xl flex-col items-center px-6 text-center">
        <p className="text-sm uppercase tracking-[0.8em] text-white/70">
          Épisodes leakés en exclusivité
        </p>
        <h1 className="mt-6 font-display text-6xl uppercase leading-snug tracking-[0.15em] text-white drop-shadow-[0_0_30px_rgba(255,46,149,0.8)] md:text-7xl">
          xburncrust dévoile tout
        </h1>
        <p className="mt-6 max-w-3xl text-lg text-white/80">
          Des leaks 4K, des shows live interdits, les studios les plus dark
          réunis pour toi. Aucun algorithme, juste du plaisir brut.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button className="rounded-full bg-gradient-to-r from-neon-pink via-pink-500 to-red-500 px-10 py-4 text-base font-bold uppercase tracking-[0.4em] text-white shadow-2xl shadow-neon-pink/60 transition hover:scale-105">
            lancer la transe
          </button>
          <button className="rounded-full border border-white/30 px-10 py-4 text-base font-semibold uppercase tracking-[0.4em] text-white transition hover:border-neon-pink hover:text-neon-pink hover:shadow-glow">
            explorer
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroVideo;


