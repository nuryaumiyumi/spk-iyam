"use client";

import {
  BadgeCheck,
  AlertTriangle,
  RotateCcw,
  Wand2,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Kriteria, KRITERIA_DEFAULT } from "@/lib/types";
import { ui } from "@/lib/ui";
import { bobotValid, totalBobot } from "@/lib/saw";
import { useToast } from "./Toast";

interface KriteriaViewProps {
  kriteriaList: Kriteria[];
  updateKriteria: (newList: Kriteria[]) => void;
}

export default function KriteriaView({
  kriteriaList,
  updateKriteria,
}: KriteriaViewProps) {
  const { notify } = useToast();
  const total = totalBobot(kriteriaList);
  const valid = bobotValid(kriteriaList);

  const setBobot = (id: string, bobot: number) => {
    updateKriteria(
      kriteriaList.map((k) =>
        k.id === id ? { ...k, bobot: Math.min(1, Math.max(0, bobot)) } : k
      )
    );
  };

  const setTipe = (id: string, tipe: Kriteria["tipe"]) => {
    updateKriteria(
      kriteriaList.map((k) => (k.id === id ? { ...k, tipe } : k))
    );
  };

  const normalisasi = () => {
    if (total <= 0) {
      const rata = 1 / Math.max(kriteriaList.length, 1);
      updateKriteria(kriteriaList.map((k) => ({ ...k, bobot: rata })));
    } else {
      updateKriteria(
        kriteriaList.map((k) => ({ ...k, bobot: k.bobot / total }))
      );
    }
    notify("success", "Bobot dinormalisasi — total kini 100%.");
  };

  const resetDefault = () => {
    updateKriteria(KRITERIA_DEFAULT.map((k) => ({ ...k })));
    notify("info", "Bobot kriteria dikembalikan ke pengaturan awal.");
  };

  return (
    <div className="space-y-6">
      {/* Ringkasan total bobot */}
      <div className={`${ui.card} flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between`}>
        <div>
          <h2 className={ui.sectionTitle}>Kriteria &amp; Bobot Penilaian</h2>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-stone-500">
            Geser untuk menyesuaikan tingkat kepentingan tiap kriteria. Total
            bobot harus <strong>100%</strong> agar nilai preferensi proporsional.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center gap-2.5 rounded-2xl px-4 py-3 ring-1 ${
              valid
                ? "bg-emerald-50 text-emerald-700 ring-emerald-600/15"
                : "bg-amber-50 text-amber-700 ring-amber-600/20"
            }`}
          >
            {valid ? <BadgeCheck size={18} /> : <AlertTriangle size={18} />}
            <div>
              <p className="font-mono text-lg leading-none font-bold tabular-nums">
                {(total * 100).toFixed(0)}%
              </p>
              <p className="mt-0.5 text-[10px] font-semibold tracking-wider uppercase opacity-70">
                Total Bobot
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={normalisasi}
              disabled={valid}
              className={`${ui.btnGold} px-3.5 py-2 text-xs`}
            >
              <Wand2 size={14} />
              Normalisasi
            </button>
            <button onClick={resetDefault} className={`${ui.btnOutline} px-3.5 py-2 text-xs`}>
              <RotateCcw size={14} />
              Reset Default
            </button>
          </div>
        </div>
      </div>

      {/* Kartu kriteria */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {kriteriaList.map((k) => {
          const persen = Math.round(k.bobot * 100);
          return (
            <div key={k.id} className={`${ui.card} p-6`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-stone-800">
                    {k.nama}
                  </h3>
                  <p className="mt-0.5 text-xs text-stone-500">
                    {k.tipe === "benefit"
                      ? "Semakin tinggi semakin baik"
                      : "Semakin rendah semakin baik"}
                  </p>
                </div>
                <div className="flex rounded-xl bg-stone-100 p-1" role="group" aria-label={`Tipe kriteria ${k.nama}`}>
                  <button
                    onClick={() => setTipe(k.id, "benefit")}
                    className={`flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition ${
                      k.tipe === "benefit"
                        ? "bg-white text-emerald-700 shadow-sm"
                        : "text-stone-500 hover:text-stone-600"
                    }`}
                  >
                    <TrendingUp size={12} /> Benefit
                  </button>
                  <button
                    onClick={() => setTipe(k.id, "cost")}
                    className={`flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition ${
                      k.tipe === "cost"
                        ? "bg-white text-amber-700 shadow-sm"
                        : "text-stone-500 hover:text-stone-600"
                    }`}
                  >
                    <TrendingDown size={12} /> Cost
                  </button>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-4">
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={persen}
                  onChange={(e) => setBobot(k.id, Number(e.target.value) / 100)}
                  aria-label={`Bobot ${k.nama}`}
                  className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-stone-200 accent-rose-800"
                />
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={persen}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      if (Number.isFinite(v)) setBobot(k.id, v / 100);
                    }}
                    aria-label={`Persentase bobot ${k.nama}`}
                    className={`${ui.input} w-24 pr-8 text-right font-mono font-bold`}
                  />
                  <span className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-xs font-semibold text-stone-500">
                    %
                  </span>
                </div>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-stone-100">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    k.tipe === "benefit"
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-700"
                      : "bg-gradient-to-r from-amber-500 to-amber-700"
                  }`}
                  style={{ width: `${Math.min(persen, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Penjelasan metode */}
      <div className={`${ui.card} p-6`}>
        <h3 className={ui.sectionTitle}>Cara Kerja Normalisasi</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-emerald-50/60 p-5 ring-1 ring-emerald-600/10">
            <span className={ui.chipBenefit}>Benefit</span>
            <p className="mt-3 font-mono text-sm font-semibold text-stone-700">
              R<sub>ij</sub> = X<sub>ij</sub> / max(X<sub>j</sub>)
            </p>
            <p className="mt-2 text-xs leading-relaxed text-stone-500">
              Nilai dibagi nilai tertinggi pada kriteria tersebut. Berlaku untuk
              berat, warna, dan kesegaran — semakin besar semakin diunggulkan.
            </p>
          </div>
          <div className="rounded-2xl bg-amber-50/60 p-5 ring-1 ring-amber-600/10">
            <span className={ui.chipCost}>Cost</span>
            <p className="mt-3 font-mono text-sm font-semibold text-stone-700">
              R<sub>ij</sub> = min(X<sub>j</sub>) / X<sub>ij</sub>
            </p>
            <p className="mt-2 text-xs leading-relaxed text-stone-500">
              Nilai terendah dibagi nilai alternatif. Berlaku untuk persentase
              cacat — semakin kecil cacatnya semakin tinggi skornya.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
