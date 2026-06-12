"use client";

import { useMemo, useState } from "react";
import { Info, Search } from "lucide-react";
import {
  clampNilai,
  Kriteria,
  KRITERIA_RANGE,
  KriteriaId,
  Tomat,
} from "@/lib/types";
import { ui } from "@/lib/ui";
import Pagination from "./Pagination";

interface PenilaianViewProps {
  tomatList: Tomat[];
  kriteriaList: Kriteria[];
  updateTomat: (newList: Tomat[]) => void;
  rowsPerPage: number;
}

export default function PenilaianView({
  tomatList,
  kriteriaList,
  updateTomat,
  rowsPerPage,
}: PenilaianViewProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return tomatList;
    return tomatList.filter(
      (t) =>
        t.kode.toLowerCase().includes(q) || t.nama.toLowerCase().includes(q)
    );
  }, [tomatList, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * rowsPerPage;
  const pageData = filtered.slice(startIndex, startIndex + rowsPerPage);

  const commitNilai = (tomatId: number, field: KriteriaId, raw: string) => {
    const parsed = Number(raw);
    const value = clampNilai(field, Number.isFinite(parsed) ? parsed : NaN);
    updateTomat(
      tomatList.map((t) => (t.id === tomatId ? { ...t, [field]: value } : t))
    );
  };

  return (
    <div className="space-y-6">
      <div className={`${ui.card} overflow-hidden`}>
        <div className="flex flex-col gap-4 border-b border-stone-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className={ui.sectionTitle}>Matriks Penilaian</h2>
            <p className="mt-0.5 text-xs text-stone-500">
              Sunting nilai langsung pada sel — perubahan tersimpan otomatis
            </p>
          </div>
          <div className="relative w-full sm:w-auto">
            <Search
              size={15}
              className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-stone-500"
            />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Cari kode atau nama…"
              aria-label="Cari data penilaian"
              className={`${ui.input} w-full pl-9 sm:w-56`}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/60">
                <th className={ui.th}>Kode</th>
                <th className={ui.th}>Nama Tomat</th>
                {kriteriaList.map((k) => (
                  <th key={k.id} className={`${ui.th} text-center`}>
                    <span className="block">{k.nama}</span>
                    <span
                      className={`mt-1 ${k.tipe === "benefit" ? ui.chipBenefit : ui.chipCost}`}
                    >
                      {(k.bobot * 100).toFixed(0)}% · {k.tipe}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {pageData.length === 0 && (
                <tr>
                  <td
                    colSpan={2 + kriteriaList.length}
                    className="px-6 py-14 text-center text-sm text-stone-500"
                  >
                    Tidak ada data yang cocok dengan pencarian.
                  </td>
                </tr>
              )}
              {pageData.map((t) => (
                <tr key={t.id} className="transition-colors hover:bg-stone-50/70">
                  <td className={ui.td}>
                    <span className="rounded-lg bg-stone-100 px-2 py-1 font-mono text-xs font-semibold text-stone-700">
                      {t.kode}
                    </span>
                  </td>
                  <td className={`${ui.td} font-medium text-stone-800`}>{t.nama}</td>
                  {kriteriaList.map((k) => (
                    <td key={k.id} className={`${ui.td} text-center`}>
                      <input
                        key={`${t.id}-${k.id}-${t[k.id]}`}
                        type="number"
                        defaultValue={t[k.id]}
                        min={KRITERIA_RANGE[k.id].min}
                        max={KRITERIA_RANGE[k.id].max}
                        aria-label={`${k.nama} untuk ${t.kode}`}
                        onBlur={(e) => commitNilai(t.id, k.id, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") e.currentTarget.blur();
                        }}
                        className="w-20 rounded-lg border border-stone-200 bg-white px-2 py-1.5 text-center font-mono text-sm text-stone-800 tabular-nums transition focus:border-rose-700/40 focus:ring-2 focus:ring-rose-700/15 focus:outline-none"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <div className="flex flex-col items-center justify-between gap-3 border-t border-stone-100 bg-stone-50/50 px-6 py-4 sm:flex-row">
            <p className="text-xs text-stone-500">
              Menampilkan {startIndex + 1}–
              {Math.min(startIndex + rowsPerPage, filtered.length)} dari{" "}
              {filtered.length} data
            </p>
            <Pagination
              currentPage={safePage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      {/* Legenda rentang nilai */}
      <div className={`${ui.card} flex items-start gap-4 p-6`}>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-50 text-gold-700 ring-1 ring-gold-500/15">
          <Info size={18} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-stone-800">
            Panduan Rentang Nilai
          </h3>
          <div className="mt-2 grid grid-cols-1 gap-x-8 gap-y-1.5 text-xs leading-relaxed text-stone-500 sm:grid-cols-2">
            {kriteriaList.map((k) => (
              <p key={k.id}>
                <strong className="text-stone-700">{k.nama}</strong> — rentang{" "}
                {KRITERIA_RANGE[k.id].min}–{KRITERIA_RANGE[k.id].max} (
                {KRITERIA_RANGE[k.id].satuan}). Nilai di luar rentang otomatis
                disesuaikan.
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
