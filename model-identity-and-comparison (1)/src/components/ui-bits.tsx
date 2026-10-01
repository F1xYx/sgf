"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import type { InputHTMLAttributes, ReactNode } from "react";


export function cn(...c: Array<string | false | null | undefined>): string {
  return c.filter(Boolean).join(" ");
}

/* ------------------------------ Segmented ------------------------------ */

export interface SegOption {
  value: string;
  label: ReactNode;
  dot?: string;
}

export function Segmented({
  options,
  value,
  onChange,
  className,
}: {
  options: SegOption[];
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex gap-1 rounded-full border border-stroke bg-soft p-1",
        className,
      )}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={cn(
              "relative flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-[12.5px] font-semibold transition-colors duration-200",
              active ? "text-ink" : "text-fog active:text-snow",
            )}
          >
            {active && (
              <motion.span
                layoutId={undefined}
                className="absolute inset-0 rounded-full bg-lime"
                transition={{ type: "spring", stiffness: 500, damping: 38 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {o.dot && (
                <span
                  className="size-1.5 rounded-full"
                  style={{ background: o.dot }}
                />
              )}
              {o.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* --------------------------------- Chip -------------------------------- */

export function Chip({
  icon: Icon,
  color,
  children,
  className,
}: {
  icon?: LucideIcon;
  color?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-soft2 px-2.5 py-1 text-[11.5px] font-semibold text-fog",
        className,
      )}
    >
      {color && (
        <span
          className="size-1.5 rounded-full"
          style={{ background: color }}
        />
      )}
      {Icon && <Icon className="size-3" strokeWidth={2.4} />}
      {children}
    </span>
  );
}

/* -------------------------------- Field -------------------------------- */

export function Field({
  label,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-[10.5px] font-bold uppercase tracking-[0.14em] text-dim">
        {label}
      </span>
      <input
        {...props}
        className="w-full rounded-2xl border border-stroke bg-soft px-4 py-3 text-[14.5px] font-medium text-snow outline-none transition-colors placeholder:text-dim focus:border-lime/60 focus:bg-soft2"
      />
    </label>
  );
}

/* ------------------------------ Sheet shell ---------------------------- */

export function SheetShell({
  title,
  onClose,
  children,
  accent,
}: {
  title: ReactNode;
  onClose: () => void;
  children: ReactNode;
  accent?: ReactNode;
}) {
  return (
    <motion.div
      className="absolute inset-0 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="absolute inset-0 bg-black/65 backdrop-blur-[3px]"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: "104%" }}
        animate={{ y: 0 }}
        exit={{ y: "104%" }}
        transition={{ type: "spring", stiffness: 340, damping: 34 }}
        className="absolute inset-x-0 bottom-0 max-h-[92%] overflow-y-auto no-scrollbar rounded-t-[30px] border-t border-stroke bg-card px-5 pb-9 pt-2.5 shadow-[0_-30px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-dim" />
        <div className="mb-5 flex items-center justify-between gap-3">
          <h3 className="font-display text-[17px] font-bold leading-tight text-snow">
            {title}
          </h3>
          {accent}
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}

/* -------------------------------- Toast -------------------------------- */

export function Toast({ msg }: { msg: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 420, damping: 30 }}
      className="pointer-events-none absolute inset-x-0 bottom-28 z-[60] flex justify-center px-6"
    >
      <div className="rounded-full bg-snow px-4 py-2.5 text-[13px] font-bold text-ink shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
        {msg}
      </div>
    </motion.div>
  );
}

/* ----------------------------- Fade wrapper ---------------------------- */

export function ViewFade({ children, k }: { children: ReactNode; k: string }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={k}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
