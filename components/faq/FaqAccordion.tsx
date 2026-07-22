"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
  title?: string;
}

export function FaqAccordion({ items, title }: FaqAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <section className="mx-auto max-w-3xl px-6 py-20 sm:px-10">
      {title && (
        <Reveal>
          <h2 className="font-display text-marine-900 text-center text-3xl font-bold">
            {title}
          </h2>
        </Reveal>
      )}

      <div className="divide-marine-100 border-marine-100 mt-10 divide-y rounded-2xl border bg-white">
        {items.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div key={item.id}>
              <button
                onClick={() => setOpenId(isOpen ? null : item.id)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
              >
                <span className="font-display text-marine-900 text-sm font-semibold">
                  {item.question}
                </span>
                <ChevronDown
                  className={`text-marine-500 h-4 w-4 shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>
              <div
                className={`text-ink-soft grid overflow-hidden px-6 text-sm transition-all duration-300 ${
                  isOpen
                    ? "grid-rows-[1fr] pb-4 opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
                style={{ display: "grid" }}
              >
                <div className="overflow-hidden">{item.answer}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
