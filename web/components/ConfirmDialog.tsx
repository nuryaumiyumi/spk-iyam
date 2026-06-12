"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AlertTriangle, HelpCircle } from "lucide-react";
import { ui } from "@/lib/ui";

type ConfirmOptions = {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "default";
};

type ConfirmContextValue = {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
};

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

export function useConfirm(): ConfirmContextValue {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm harus dipakai di dalam <ConfirmProvider>");
  return ctx;
}

export default function ConfirmProvider({ children }: { children: ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolver = useRef<(value: boolean) => void>(null);

  const confirm = useCallback((opts: ConfirmOptions) => {
    setOptions(opts);
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const close = useCallback((result: boolean) => {
    resolver.current?.(result);
    resolver.current = null;
    setOptions(null);
  }, []);

  useEffect(() => {
    if (!options) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [options, close]);

  const danger = options?.tone === "danger";

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {options && (
        <div
          className="animate-fade-in fixed inset-0 z-[80] flex items-center justify-center bg-stone-950/55 p-4 backdrop-blur-[3px]"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close(false);
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-label={options.title}
            className="animate-scale-in w-full max-w-sm rounded-3xl bg-white p-6 shadow-[0_24px_64px_-16px_rgba(0,0,0,0.35)] ring-1 ring-stone-900/5"
          >
            <div
              className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl ${
                danger
                  ? "bg-rose-50 text-rose-700 ring-1 ring-rose-600/15"
                  : "bg-gold-50 text-gold-700 ring-1 ring-gold-500/20"
              }`}
            >
              {danger ? <AlertTriangle size={22} /> : <HelpCircle size={22} />}
            </div>
            <h3 className="font-display mt-4 text-center text-lg font-semibold text-stone-900">
              {options.title}
            </h3>
            <p className="mt-2 text-center text-sm leading-relaxed text-stone-500">
              {options.message}
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button onClick={() => close(false)} className={ui.btnOutline}>
                {options.cancelLabel ?? "Batal"}
              </button>
              <button
                onClick={() => close(true)}
                className={
                  danger
                    ? `${ui.btn} bg-rose-700 text-white shadow-[0_4px_14px_-4px_rgba(190,18,60,0.5)] hover:bg-rose-800 active:scale-[0.98]`
                    : ui.btnPrimary
                }
                autoFocus
              >
                {options.confirmLabel ?? "Ya, lanjutkan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}
