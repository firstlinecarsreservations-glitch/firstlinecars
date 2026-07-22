"use client";

import { useCurrency } from "@/hooks/useCurrency";

interface PriceTagProps {
  priceMad: number;
  className?: string;
}

export function PriceTag({ priceMad, className = "" }: PriceTagProps) {
  // Frontière client minimale : le prix est le seul nœud qui dépend de la
  // devise, donc les cartes véhicule restent des Server Components.
  const { format } = useCurrency();
  return <span className={className}>{format(priceMad)}</span>;
}
