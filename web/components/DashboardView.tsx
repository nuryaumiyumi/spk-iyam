"use client";

import { useMemo } from "react";
import {
  ArrowRight,
  Award,
  Calculator,
  Cherry,
  ClipboardList,
  Crown,
  Database,
  Gauge,
  Scale,
  Sparkles,
} from "lucide-react";
import { Kriteria, Tomat, ViewId } from "@/lib/types";
import { ui } from "@/lib/ui";
import { bobotValid, hitungSAW, totalBobot } from "@/lib/saw";
import TomatTable from "./TomatTable";
import TomatIllustration from "./TomatIllustration";

interface DashboardViewProps {
  tomatList: Tomat[];
  kriteriaList: Kriteria[];
  onNavigate: (view: ViewId) => void;
}

export default function DashboardView({
  tomatList,
  kriteriaList,
  onNavigate,
}: DashboardViewProps) {
  const ranking = useMemo(
    () => hitungSAW(tomatList, kriteriaList),
    [tomatList, kriteriaList]
  );
  const terbaik = ranking[0];
  const rataRata =
    ranking.length > 0
      ? ranking.reduce((sum, r) => sum + r.nilai, 0) / ranking.length
      : 0;
  const top5 = ranking.slice(0, 5);
  const maxNilai = top5[0]?.nilai ?? 1;
  const totalW = totalBobot(kriteriaList);

  const stats = [
    {
      label: "Total Alternatif",
      value: String(tomatList.length),
      caption: "Data tomat terdaftar",
      icon: <Database size={20} />,
      tone: "bg-rose-50 text-rose-700 ring-rose-600/10",
    },
    {
      label: "Kriteria Aktif",
      value: String(kriteriaList.length),
      caption: bobotValid(kriteriaList)
        ? "Total bobot 100%"
        : `Total bobot ${(totalW * 100).toFixed(0)}%`,
      icon: <Scale size={20} />,
      tone: "bg-gold-50 text-gold-700 ring-gold-500/15",
    },
    {
      label: "Tomat Terbaik",
      value: terbaik?.tomat.kode ?? "—",
      caption: terbaik ? `Skor ${terbaik.nilai.toFixed(4)}` : "Belum ada data",
      icon: <Crown size={20} />,
      tone: "bg-emerald-50 text-emerald-700 ring-emerald-600/10",
    },
    {
      label: "Rata-rata Skor",
      value: ranking.length ? rataRata.toFixed(4) : "—",
      caption: "Nilai preferensi rata-rata",
      icon: <Gauge size={20} />,
      tone: "bg-stone-100 text-stone-600 ring-stone-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-stone-950 px-8 py-10 text-white shadow-[0_24px_48px_-24px_rgba(28,25,23,0.5)] sm:px-10">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(640px 280px at 88% 10%, rgba(159,18,57,0.4), transparent 64%), radial-gradient(480px 240px at 4% 96%, rgba(192,148,69,0.16), transparent 60%)",
          }}
        />
        <TomatIllustration className="pointer-events-none absolute -right-8 -bottom-12 h-56 w-56 opacity-25" />
        <div className="relative max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/[0.07] px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.18em] text-gold-300 uppercase ring-1 ring-white/10">
            <Sparkles size={13} />
            Sistem Pendukung Keputusan
          </p>
          <h2 className="font-display mt-5 text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
            Pemilihan Tomat{" "}
            <span className="bg-gradient-to-r from-gold-200 to-gold-400 bg-clip-text text-transparent">
              Berkualitas Tinggi
            </span>
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-stone-400">
            Kelola alternatif, tetapkan bobot kriteria, dan lakukan perankingan
            objektif menggunakan metode Simple Additive Weighting — transparan
            di setiap langkah perhitungan.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate("perhitunganSaw")}
              className={ui.btnPrimary}
            >
              <Calculator size={16} />
              Mulai Perhitungan SAW
            </button>
            <button
              onClick={() => onNavigate("dataTomat")}
              className={`${ui.btn} bg-white/[0.08] text-white ring-1 ring-white/15 backdrop-blur hover:bg-white/[0.14] active:scale-[0.98]`}
            >
              <Cherry size={16} />
              Kelola Data Tomat
            </button>
          </div>
        </div>
      </section>

      {/* Kartu statistik */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`${ui.card} group p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-12px_rgba(28,25,23,0.18)]`}
          >
            <div className="flex items-start justify-between">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ring-1 ${stat.tone}`}
              >
                {stat.icon}
              </div>
            </div>
            <p className="mt-4 text-[11px] font-semibold tracking-[0.1em] text-stone-500 uppercase">
              {stat.label}
            </p>
            <p className="mt-1.5 font-mono text-[26px] leading-none font-bold tracking-tight text-stone-900 tabular-nums">
              {stat.value}
            </p>
            <p className="mt-1.5 text-xs text-stone-500">{stat.caption}</p>
          </div>
        ))}
      </section>

      {/* Grafik ringkas */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Top 5 */}
        <div className={`${ui.card} p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={ui.sectionTitle}>Peringkat Teratas</h3>
              <p className="mt-0.5 text-xs text-stone-500">
                Lima alternatif dengan nilai preferensi tertinggi
              </p>
            </div>
            <button
              onClick={() => onNavigate("hasilRanking")}
              className={`${ui.btnGhost} -mr-2 text-xs`}
            >
              Selengkapnya <ArrowRight size={14} />
            </button>
          </div>
          <div className="mt-6 space-y-4">
            {top5.length === 0 && (
              <p className="py-8 text-center text-sm text-stone-500">
                Belum ada data untuk diranking.
              </p>
            )}
            {top5.map((item, idx) => (
              <div key={item.tomat.id} className="flex items-center gap-3">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                    idx === 0
                      ? "bg-gradient-to-br from-gold-300 to-gold-600 text-white shadow-[0_3px_10px_-2px_rgba(192,148,69,0.6)]"
                      : "bg-stone-100 text-stone-500"
                  }`}
                >
                  {idx + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="truncate text-[13px] font-semibold text-stone-700">
                      <span className="font-mono text-xs text-stone-500">
                        {item.tomat.kode}
                      </span>{" "}
                      {item.tomat.nama}
                    </p>
                    <p className="font-mono text-xs font-bold text-stone-600 tabular-nums">
                      {item.nilai.toFixed(4)}
                    </p>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-stone-100">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        idx === 0
                          ? "bg-gradient-to-r from-gold-400 to-gold-600"
                          : "bg-gradient-to-r from-rose-700 to-rose-900"
                      }`}
                      style={{
                        width: `${maxNilai > 0 ? (item.nilai / maxNilai) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bobot kriteria */}
        <div className={`${ui.card} p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={ui.sectionTitle}>Bobot Kriteria</h3>
              <p className="mt-0.5 text-xs text-stone-500">
                Komposisi bobot penilaian saat ini
              </p>
            </div>
            <button
              onClick={() => onNavigate("kriteria")}
              className={`${ui.btnGhost} -mr-2 text-xs`}
            >
              Atur Bobot <ArrowRight size={14} />
            </button>
          </div>
          <div className="mt-6 space-y-5">
            {kriteriaList.map((k) => (
              <div key={k.id}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <p className="text-[13px] font-semibold text-stone-700">
                      {k.nama}
                    </p>
                    <span className={k.tipe === "benefit" ? ui.chipBenefit : ui.chipCost}>
                      {k.tipe}
                    </span>
                  </div>
                  <p className="font-mono text-xs font-bold text-stone-600 tabular-nums">
                    {(k.bobot * 100).toFixed(0)}%
                  </p>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-stone-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-stone-700 to-stone-900 transition-all duration-700"
                    style={{ width: `${Math.min(k.bobot * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-start gap-3 rounded-2xl bg-gold-50 p-4 ring-1 ring-gold-500/15">
            <Award size={18} className="mt-0.5 shrink-0 text-gold-700" />
            <p className="text-xs leading-relaxed text-stone-600">
              Metode SAW menjumlahkan hasil normalisasi terbobot setiap
              kriteria. Pastikan total bobot bernilai <strong>100%</strong> agar
              skor preferensi proporsional.
            </p>
          </div>
        </div>
      </section>

      {/* Tabel data terbaru */}
      <section className={`${ui.card} overflow-hidden`}>
        <div className="flex items-center justify-between border-b border-stone-100 px-6 py-5">
          <div>
            <h3 className={ui.sectionTitle}>Data Tomat Terbaru</h3>
            <p className="mt-0.5 text-xs text-stone-500">
              Delapan entri pertama dari {tomatList.length} alternatif
            </p>
          </div>
          <button
            onClick={() => onNavigate("dataTomat")}
            className={`${ui.btnOutline} text-xs`}
          >
            <ClipboardList size={14} />
            Lihat Semua
          </button>
        </div>
        <TomatTable data={tomatList.slice(0, 8)} />
      </section>
    </div>
  );
}
