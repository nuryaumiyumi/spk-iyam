"use client";

import { useMemo } from "react";
import { Crown, Download, Medal, Trophy } from "lucide-react";
import { Kriteria, Tomat } from "@/lib/types";
import { ui } from "@/lib/ui";
import { hitungSAW } from "@/lib/saw";
import { downloadCsv } from "@/lib/export";
import { useToast } from "./Toast";

interface HasilRankingViewProps {
  tomatList: Tomat[];
  kriteriaList: Kriteria[];
}

const PODIUM_STYLE = [
  {
    label: "Juara 1",
    ring: "ring-gold-400/40",
    bg: "bg-gradient-to-b from-gold-50 to-white",
    badge: "bg-gradient-to-br from-gold-300 to-gold-600 text-white shadow-[0_6px_16px_-4px_rgba(192,148,69,0.55)]",
    icon: <Crown size={22} />,
  },
  {
    label: "Juara 2",
    ring: "ring-stone-300/60",
    bg: "bg-gradient-to-b from-stone-50 to-white",
    badge: "bg-gradient-to-br from-stone-300 to-stone-500 text-white",
    icon: <Medal size={22} />,
  },
  {
    label: "Juara 3",
    ring: "ring-amber-600/25",
    bg: "bg-gradient-to-b from-amber-50/70 to-white",
    badge: "bg-gradient-to-br from-amber-500 to-amber-800 text-white",
    icon: <Medal size={22} />,
  },
];

export default function HasilRankingView({
  tomatList,
  kriteriaList,
}: HasilRankingViewProps) {
  const { notify } = useToast();
  const ranking = useMemo(
    () => hitungSAW(tomatList, kriteriaList),
    [tomatList, kriteriaList]
  );
  const podium = ranking.slice(0, 3);

  const handleExport = () => {
    downloadCsv("hasil-ranking-saw.csv", [
      ["Rank", "Kode", "Nama", "Berat (g)", "Warna", "Kesegaran", "Cacat (%)", "Nilai Preferensi"],
      ...ranking.map((r) => [
        r.rank,
        r.tomat.kode,
        r.tomat.nama,
        r.tomat.berat,
        r.tomat.warna,
        r.tomat.kesegaran,
        r.tomat.cacat,
        r.nilai.toFixed(4),
      ]),
    ]);
    notify("success", "Hasil ranking diekspor sebagai CSV.");
  };

  if (ranking.length === 0) {
    return (
      <div className={`${ui.card} flex flex-col items-center justify-center gap-3 px-6 py-20 text-center`}>
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-stone-500">
          <Trophy size={26} />
        </div>
        <p className="text-sm font-semibold text-stone-700">
          Belum ada hasil ranking
        </p>
        <p className="max-w-sm text-xs leading-relaxed text-stone-500">
          Tambahkan data tomat terlebih dahulu agar sistem dapat menyusun
          peringkat berdasarkan metode SAW.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Podium */}
      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className={ui.sectionTitle}>Hasil Ranking SAW</h2>
            <p className="mt-0.5 text-xs text-stone-500">
              Peringkat akhir {ranking.length} alternatif berdasarkan nilai
              preferensi
            </p>
          </div>
          <button onClick={handleExport} className={ui.btnOutline}>
            <Download size={15} />
            Export CSV
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {podium.map((item, idx) => {
            const style = PODIUM_STYLE[idx];
            return (
              <div
                key={item.tomat.id}
                className={`${ui.card} relative overflow-hidden p-6 text-center ring-1 ${style.ring} ${style.bg} ${
                  idx === 0 ? "sm:order-2 sm:-translate-y-2" : idx === 1 ? "sm:order-1" : "sm:order-3"
                }`}
              >
                <div
                  className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl ${style.badge}`}
                >
                  {style.icon}
                </div>
                <p className="mt-3 text-[10px] font-bold tracking-[0.2em] text-stone-500 uppercase">
                  {style.label}
                </p>
                <p className="mt-1.5 font-mono text-xs text-stone-500">
                  {item.tomat.kode}
                </p>
                <h3 className="font-display mt-0.5 truncate text-lg font-semibold text-stone-900">
                  {item.tomat.nama}
                </h3>
                <p className="mt-2 font-mono text-2xl font-bold tracking-tight text-stone-800 tabular-nums">
                  {item.nilai.toFixed(4)}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tabel lengkap */}
      <section className={`${ui.card} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/60">
                <th className={ui.th}>Rank</th>
                <th className={ui.th}>Kode</th>
                <th className={ui.th}>Nama Tomat</th>
                <th className={ui.th}>Skor</th>
                <th className={`${ui.th} text-right`}>Nilai Preferensi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {ranking.map((item) => (
                <tr
                  key={item.tomat.id}
                  className={`transition-colors hover:bg-stone-50/70 ${
                    item.rank === 1 ? "bg-gold-50/40" : ""
                  }`}
                >
                  <td className={ui.td}>
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${
                        item.rank === 1
                          ? "bg-gradient-to-br from-gold-300 to-gold-600 text-white"
                          : item.rank === 2
                            ? "bg-gradient-to-br from-stone-300 to-stone-500 text-white"
                            : item.rank === 3
                              ? "bg-gradient-to-br from-amber-500 to-amber-800 text-white"
                              : "bg-stone-100 text-stone-500"
                      }`}
                    >
                      {item.rank}
                    </span>
                  </td>
                  <td className={ui.td}>
                    <span className="rounded-lg bg-stone-100 px-2 py-1 font-mono text-xs font-semibold text-stone-700">
                      {item.tomat.kode}
                    </span>
                  </td>
                  <td className={`${ui.td} font-medium text-stone-800`}>
                    {item.tomat.nama}
                  </td>
                  <td className={`${ui.td} w-2/5 min-w-44`}>
                    <div className="h-2 overflow-hidden rounded-full bg-stone-100">
                      <div
                        className={`h-full rounded-full ${
                          item.rank === 1
                            ? "bg-gradient-to-r from-gold-400 to-gold-600"
                            : "bg-gradient-to-r from-rose-700 to-rose-900"
                        }`}
                        style={{ width: `${item.nilai * 100}%` }}
                      />
                    </div>
                  </td>
                  <td className={`${ui.td} text-right font-mono font-bold tabular-nums`}>
                    {item.nilai.toFixed(4)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
