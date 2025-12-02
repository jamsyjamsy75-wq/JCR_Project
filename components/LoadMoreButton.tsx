"use client";

import { useTransition } from "react";

type LoadMoreButtonProps = {
  onClick: () => void;
  disabled?: boolean;
};

const LoadMoreButton = ({ onClick, disabled }: LoadMoreButtonProps) => {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (disabled) return;
    startTransition(() => onClick());
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isPending}
      className="rounded-full border border-white/20 px-8 py-3 text-xs font-semibold uppercase tracking-[0.5em] text-white transition hover:border-neon-pink hover:text-neon-pink hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isPending ? "Chargement..." : "Charger plus"}
    </button>
  );
};

export default LoadMoreButton;



