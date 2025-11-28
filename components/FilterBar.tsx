"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type FilterBarProps = {
  filters: string[];
  value?: string;
  onChange?: (filter: string) => void;
};

const FilterBar = ({ filters, value, onChange }: FilterBarProps) => {
  const [internalValue, setInternalValue] = useState(value || filters[0] || "");

  const activeFilter = value ?? internalValue;

  const handleSelect = (filter: string) => {
    if (!value) {
      setInternalValue(filter);
    }
    onChange?.(filter);
  };

  return (
    <div className="sticky top-16 z-40 mb-10 overflow-x-auto border-b border-white/10 bg-night/80 py-4 backdrop-blur-xl">
      <div className="mx-auto flex w-max min-w-full gap-3 px-6">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => handleSelect(filter)}
            className={cn(
              "rounded-full border border-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70 transition hover:text-white hover:shadow-glow",
              activeFilter === filter
                ? "bg-gradient-to-r from-neon-pink to-pink-500 text-white"
                : "bg-obsidian"
            )}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;


