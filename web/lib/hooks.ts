"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/**
 * Tanggal hari ini (locale id-ID) yang aman terhadap hidrasi:
 * server merender string kosong, client mengisi setelah hidrasi.
 */
export function useToday(withWeekday = false): string {
  return useSyncExternalStore(
    noopSubscribe,
    () =>
      new Date().toLocaleDateString("id-ID", {
        ...(withWeekday ? { weekday: "long" as const } : {}),
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    () => ""
  );
}

/**
 * Baca isi localStorage sebagai external store — bebas hydration mismatch
 * dan ikut ter-update bila tab lain mengubah data.
 */
export function useLocalStorageRaw(key: string): string | null {
  return useSyncExternalStore(
    (onChange) => {
      window.addEventListener("storage", onChange);
      return () => window.removeEventListener("storage", onChange);
    },
    () => localStorage.getItem(key),
    () => null
  );
}
