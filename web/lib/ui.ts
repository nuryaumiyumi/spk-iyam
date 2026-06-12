/**
 * Kelas utilitas bersama untuk konsistensi desain.
 * Didefinisikan sebagai konstanta TS (bukan @apply di CSS) sesuai idiom
 * Tailwind v4 — string lengkap di sini tetap terdeteksi oleh scanner Tailwind.
 */

const btnBase =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700 disabled:cursor-not-allowed disabled:opacity-50";

const chipBase =
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold";

export const ui = {
  card: "rounded-2xl bg-white shadow-[0_1px_3px_rgba(28,25,23,0.05),0_8px_24px_-12px_rgba(28,25,23,0.08)] ring-1 ring-stone-900/[0.06]",

  btn: btnBase,
  btnPrimary: `${btnBase} bg-gradient-to-b from-rose-700 to-rose-900 text-white shadow-[0_4px_14px_-4px_rgba(159,18,57,0.5),inset_0_1px_0_rgba(255,255,255,0.15)] hover:from-rose-600 hover:to-rose-800 hover:shadow-[0_6px_20px_-4px_rgba(159,18,57,0.55)] active:scale-[0.98]`,
  btnGold: `${btnBase} bg-gradient-to-b from-gold-500 to-gold-700 text-white shadow-[0_4px_14px_-4px_rgba(168,123,54,0.5),inset_0_1px_0_rgba(255,255,255,0.2)] hover:from-gold-400 hover:to-gold-600 active:scale-[0.98]`,
  btnOutline: `${btnBase} bg-white text-stone-700 ring-1 ring-stone-200 hover:bg-stone-50 hover:text-stone-900 hover:ring-stone-300 active:scale-[0.98]`,
  btnGhost: `${btnBase} text-stone-500 hover:bg-stone-100 hover:text-stone-800`,
  btnDanger: `${btnBase} bg-white text-rose-700 ring-1 ring-rose-200 hover:bg-rose-50 hover:ring-rose-300 active:scale-[0.98]`,

  input:
    "w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-800 shadow-[inset_0_1px_2px_rgba(28,25,23,0.03)] transition placeholder:text-stone-400 focus:border-rose-700/40 focus:ring-2 focus:ring-rose-700/15 focus:outline-none",
  label: "mb-1.5 block text-[13px] font-medium text-stone-700",

  th: "px-4 py-3.5 text-left text-[11px] font-semibold tracking-[0.08em] whitespace-nowrap text-stone-500 uppercase",
  td: "px-4 py-3.5 text-sm whitespace-nowrap text-stone-700",

  chipBenefit: `${chipBase} bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/15`,
  chipCost: `${chipBase} bg-amber-50 text-amber-700 ring-1 ring-amber-600/15`,

  sectionTitle: "font-display text-xl font-semibold tracking-tight text-stone-900",
};
