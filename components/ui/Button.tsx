import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonBaseProps {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}

interface ButtonAsLink extends ButtonBaseProps {
  href: string;
  onClick?: never;
  type?: never;
}

interface ButtonAsButton extends ButtonBaseProps {
  href?: never;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}

// Les boutons ne portent pas d'ombre : un aplat de couleur pleine se
// détache déjà du fond, et l'ombre ajoutait un relief inutile.
const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-amber-500 text-ink hover:bg-amber-600",
  secondary: "bg-marine-700 text-white hover:bg-marine-900",
  ghost: "bg-transparent text-marine-700 hover:bg-marine-50",
};

const BASE_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-display font-semibold text-sm tracking-wide transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 disabled:opacity-50 disabled:pointer-events-none";

export function Button(props: ButtonAsLink | ButtonAsButton) {
  const { children, variant = "primary", className = "" } = props;
  const classes = `${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${className}`;

  if ("href" in props && props.href) {
    // Un href externe (WhatsApp, http…) s'ouvre dans un nouvel onglet via une
    // ancre native : next/link est réservé à la navigation interne. Le style
    // reste rigoureusement identique dans les deux cas.
    if (/^https?:\/\//.test(props.href)) {
      return (
        <a
          href={props.href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  const buttonProps = props as ButtonAsButton;
  return (
    <button
      type={buttonProps.type ?? "button"}
      onClick={buttonProps.onClick}
      disabled={buttonProps.disabled}
      className={classes}
    >
      {children}
    </button>
  );
}
