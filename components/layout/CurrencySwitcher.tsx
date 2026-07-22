"use client";

import { useCurrency } from "@/hooks/useCurrency";
import { SUPPORTED_CURRENCIES } from "@/lib/currency";

interface CurrencySwitcherProps {
  light?: boolean;
}

export function CurrencySwitcher({ light = false }: CurrencySwitcherProps) {
  const { currency, setCurrency } = useCurrency();

  return (
    <div
      className={`flex items-center gap-1 rounded-full p-1 text-xs font-semibold ${
        light ? "bg-white/15 backdrop-blur" : "bg-marine-50"
      }`}
    >
      {SUPPORTED_CURRENCIES.map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => setCurrency(value)}
          aria-pressed={currency === value}
          className={`rounded-full px-2.5 py-1 transition-colors ${
            currency === value
              ? light
                ? "text-marine-900 bg-white"
                : "bg-marine-700 text-white"
              : light
                ? "text-white/80 hover:text-white"
                : "text-marine-700 hover:bg-marine-100"
          }`}
        >
          {value}
        </button>
      ))}
    </div>
  );
}
