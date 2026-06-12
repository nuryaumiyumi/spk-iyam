"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Calculator, ChevronDown, ChevronUp } from "lucide-react";
import { getNilaiKriteria, Kriteria, Tomat } from "@/lib/types";
import { ui } from "@/lib/ui";
import { bobotValid, hitungNormalisasi, hitungSAW } from "@/lib/saw";

interface PerhitunganSAWViewProps {
  tomatList: Tomat[];
  kriteriaList: Kriteria[];
}

const PREVIEW_ROWS = 10;

function StepBadge({ step }: { step: number }) {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-stone-800 to-stone-950 font-mono text-sm font-bold text-gold-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
      {step}
    </span>
  );
}

function ShowAllToggle({
  expanded,
  total,
  onToggle,
}: {
  expanded: boolean;
  total: number;
  onToggle: () => void;
}) {
  if (total <= PREVIEW_ROWS) return null;
  return (
    <button onClick={onToggle} className={`${ui.btnGhost} mt-3 text-xs`}>
      {expanded ? (
        <>
          <ChevronUp size={14} /> Ringkas tampilan
        </>
      ) : (
        <>
          <ChevronDown size={14} /> Tampilkan semua ({total} baris)
        </>
      )}
    </button>
  );
}

export default function PerhitunganSAWView({
  tomatList,
  kriteriaList,
}: PerhitunganSAWViewProps) {
  const [showAllX, setShowAllX] = useState(false);
  const [showAllR, setShowAllR] = useState(false);
  const [showAllV, setShowAllV] = useState(false);

  const { normalizedMatrix, maxValues, minValues } = useMemo(
    () => hitungNormalisasi(tomatList, kriteriaList),
    [tomatList, kriteriaList]
  );
  const ranking = useMemo(
    () => hitungSAW(tomatList, kriteriaList),
    [tomatList, kriteriaList]
  );
  const tomatById = useMemo(
    () => new Map(tomatList.map((t) => [t.id, t])),
    [tomatList]
  );

  if (tomatList.length === 0) {
    return (
      <div className={`${ui.card} flex flex-col items-center justify-center gap-3 px-6 py-20 text-center`}>
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-stone-500">
          <Calculator size={26} />
        </div>
        <p className="text-sm font-semibold text-stone-700">
          Belum ada data untuk dihitung
        </p>
        <p className="max-w-sm text-xs leading-relaxed text-stone-500">
          Tambahkan data tomat terlebih dahulu melalui halaman Data Tomat atau
          Import JSON, lalu kembali ke sini untuk melihat perhitungan SAW.
        </p>
      </div>
    );
  }

  const xRows = showAllX ? tomatList : tomatList.slice(0, PREVIEW_ROWS);
  const rRows = showAllR
    ? normalizedMatrix
    : normalizedMatrix.slice(0, PREVIEW_ROWS);
  const vRows = showAllV ? ranking : ranking.slice(0, PREVIEW_ROWS);

  return (
    <div className="space-y-6">
      {!bobotValid(kriteriaList) && (
        <div className="flex items-start gap-3 rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-600/20">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-600" />
          <p className="text-sm leading-relaxed text-amber-800">
            Total bobot kriteria belum 100%. Dalam perhitungan ini bobot{" "}
            <strong>dinormalisasi otomatis</strong> agar proporsional — atur
            ulang melalui halaman Kriteria &amp; Bobot untuk hasil sesuai
            preferensi Anda.
          </p>
        </div>
      )}

      {/* Bobot ringkas */}
      <div className={`${ui.card} p-6`}>
        <div className="flex items-center gap-4">
          <StepBadge step={1} />
          <div>
            <h3 className={ui.sectionTitle}>Bobot Kriteria (W)</h3>
            <p className="mt-0.5 text-xs text-stone-500">
              Vektor bobot yang digunakan pada perhitungan
            </p>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {kriteriaList.map((k) => (
            <div
              key={k.id}
              className="rounded-2xl bg-stone-50 p-4 ring-1 ring-stone-100"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-xs font-semibold text-stone-600">
                  {k.nama}
                </p>
                <span className={k.tipe === "benefit" ? ui.chipBenefit : ui.chipCost}>
                  {k.tipe}
                </span>
              </div>
              <p className="mt-2 font-mono text-xl font-bold text-stone-900 tabular-nums">
                {k.bobot.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Matriks keputusan */}
      <div className={`${ui.card} p-6`}>
        <div className="flex items-center gap-4">
          <StepBadge step={2} />
          <div>
            <h3 className={ui.sectionTitle}>Matriks Keputusan (X)</h3>
            <p className="mt-0.5 text-xs text-stone-500">
              Nilai asli setiap alternatif terhadap kriteria
            </p>
          </div>
        </div>
        <div className="mt-5 overflow-x-auto rounded-xl ring-1 ring-stone-100">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/60">
                <th className={ui.th}>Alternatif</th>
                {kriteriaList.map((k) => (
                  <th key={k.id} className={`${ui.th} text-center`}>
                    {k.nama}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {xRows.map((t) => (
                <tr key={t.id}>
                  <td className={ui.td}>
                    <span className="font-mono text-xs text-stone-500">{t.kode}</span>{" "}
                    <span className="font-medium text-stone-800">{t.nama}</span>
                  </td>
                  {kriteriaList.map((k) => (
                    <td key={k.id} className={`${ui.td} text-center font-mono tabular-nums`}>
                      {getNilaiKriteria(t, k.id)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-stone-200 bg-stone-50">
                <td className={`${ui.td} text-xs font-bold text-stone-500 uppercase`}>
                  Maksimum
                </td>
                {kriteriaList.map((k) => (
                  <td
                    key={k.id}
                    className={`${ui.td} text-center font-mono text-xs font-bold text-emerald-700 tabular-nums`}
                  >
                    {maxValues[k.id]}
                  </td>
                ))}
              </tr>
              <tr className="bg-stone-50">
                <td className={`${ui.td} text-xs font-bold text-stone-500 uppercase`}>
                  Minimum
                </td>
                {kriteriaList.map((k) => (
                  <td
                    key={k.id}
                    className={`${ui.td} text-center font-mono text-xs font-bold text-amber-700 tabular-nums`}
                  >
                    {minValues[k.id]}
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>
        <ShowAllToggle
          expanded={showAllX}
          total={tomatList.length}
          onToggle={() => setShowAllX((v) => !v)}
        />
      </div>

      {/* Normalisasi */}
      <div className={`${ui.card} p-6`}>
        <div className="flex items-center gap-4">
          <StepBadge step={3} />
          <div>
            <h3 className={ui.sectionTitle}>Matriks Normalisasi (R)</h3>
            <p className="mt-0.5 text-xs text-stone-500">
              Benefit: R<sub>ij</sub> = X<sub>ij</sub>/max(X<sub>j</sub>) ·
              Cost: R<sub>ij</sub> = min(X<sub>j</sub>)/X<sub>ij</sub>
            </p>
          </div>
        </div>
        <div className="mt-5 overflow-x-auto rounded-xl ring-1 ring-stone-100">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/60">
                <th className={ui.th}>Alternatif</th>
                {kriteriaList.map((k) => (
                  <th key={k.id} className={`${ui.th} text-center`}>
                    {k.nama}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {rRows.map((item) => {
                const tomat = tomatById.get(item.tomatId);
                if (!tomat) return null;
                return (
                  <tr key={item.tomatId}>
                    <td className={ui.td}>
                      <span className="font-mono text-xs text-stone-500">
                        {tomat.kode}
                      </span>{" "}
                      <span className="font-medium text-stone-800">{tomat.nama}</span>
                    </td>
                    {item.normalized.map((r, i) => (
                      <td
                        key={kriteriaList[i].id}
                        className={`${ui.td} text-center font-mono tabular-nums ${
                          r >= 0.999 ? "font-bold text-emerald-700" : ""
                        }`}
                      >
                        {r.toFixed(4)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <ShowAllToggle
          expanded={showAllR}
          total={normalizedMatrix.length}
          onToggle={() => setShowAllR((v) => !v)}
        />
      </div>

      {/* Preferensi */}
      <div className={`${ui.card} p-6`}>
        <div className="flex items-center gap-4">
          <StepBadge step={4} />
          <div>
            <h3 className={ui.sectionTitle}>Nilai Preferensi (V)</h3>
            <p className="mt-0.5 text-xs text-stone-500">
              V<sub>i</sub> = Σ (R<sub>ij</sub> × W<sub>j</sub>) — diurutkan dari
              skor tertinggi
            </p>
          </div>
        </div>
        <div className="mt-5 overflow-x-auto rounded-xl ring-1 ring-stone-100">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/60">
                <th className={ui.th}>Rank</th>
                <th className={ui.th}>Alternatif</th>
                <th className={ui.th}>Skor</th>
                <th className={`${ui.th} text-right`}>Nilai Preferensi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {vRows.map((item) => (
                <tr key={item.tomat.id}>
                  <td className={ui.td}>
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${
                        item.rank === 1
                          ? "bg-gradient-to-br from-gold-300 to-gold-600 text-white"
                          : "bg-stone-100 text-stone-500"
                      }`}
                    >
                      {item.rank}
                    </span>
                  </td>
                  <td className={ui.td}>
                    <span className="font-mono text-xs text-stone-500">
                      {item.tomat.kode}
                    </span>{" "}
                    <span className="font-medium text-stone-800">
                      {item.tomat.nama}
                    </span>
                  </td>
                  <td className={`${ui.td} w-2/5 min-w-40`}>
                    <div className="h-2 overflow-hidden rounded-full bg-stone-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-rose-700 to-rose-900"
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
        <ShowAllToggle
          expanded={showAllV}
          total={ranking.length}
          onToggle={() => setShowAllV((v) => !v)}
        />
      </div>
    </div>
  );
}
