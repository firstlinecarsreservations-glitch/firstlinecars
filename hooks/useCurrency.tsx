"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import {
  formatPrice,
  currencyCookieAttributes,
  DEFAULT_CURRENCY,
  type Currency,
} from "@/lib/currency";

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  /** Formate un prix stocké en MAD dans la devise active. */
  format: (priceMad: number) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

interface CurrencyProviderProps {
  children: ReactNode;
  /**
   * Devise lue depuis le cookie côté serveur. Le provider démarre donc
   * déjà sur la bonne valeur : le HTML initial affiche les bons prix, et
   * il n'y a plus ni flash MAD -> EUR ni divergence serveur/client.
   */
  initialCurrency?: Currency;
}

export function CurrencyProvider({
  children,
  initialCurrency = DEFAULT_CURRENCY,
}: CurrencyProviderProps) {
  const [currency, setCurrencyState] = useState<Currency>(initialCurrency);

  const setCurrency = useCallback((next: Currency) => {
    setCurrencyState(next);
    document.cookie = currencyCookieAttributes(next);
  }, []);

  // Sans useMemo, l'objet de contexte est recréé à chaque rendu du
  // provider et re-rend tous les PriceTag de la page, même quand la
  // devise n'a pas bougé.
  const value = useMemo(
    () => ({
      currency,
      setCurrency,
      format: (priceMad: number) => formatPrice(priceMad, currency),
    }),
    [currency, setCurrency],
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error(
      "useCurrency doit être utilisé à l'intérieur de CurrencyProvider",
    );
  }
  return ctx;
}
