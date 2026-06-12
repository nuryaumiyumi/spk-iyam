"use client";

import { useMemo } from "react";
import { Download, FileText, Printer } from "lucide-react";
import { Kriteria, Tomat } from "@/lib/types";
import { ui } from "@/lib/ui";
import { bobotValid, hitungSAW, totalBobot } from "@/lib/saw";
import { downloadCsv } from "@/lib/export";
import { useToday } from "@/lib/hooks";
import { useToast } from "./Toast";

interface LaporanViewProps {
  tomatList: Tomat[];
  kriteriaList: Kriteria[];
}

export default function LaporanView({ tomatList, kriteriaList }: LaporanViewProps) {
  const { notify } = useToast();
  const tanggal = useToday();

  const ranking = useMemo(
    () => hitungSAW(tomatList, kriteriaList),
    [tomatList, kriteriaList]
  );
  const terbaik = ranking[0];
  const rataRata =
    ranking.length > 0
      ? ranking.reduce((sum, r) => sum + r.nilai, 0) / ranking.length
      : 0;

  const handleExportCsv = () => {
    downloadCsv("laporan-ranking-saw.csv", [
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
    notify("success", "Laporan diekspor sebagai CSV.");
  };

  if (tomatList.length === 0) {
    return (
      <div className={`${ui.card} flex flex-col items-center justify-center gap-3 px-6 py-20 text-center`}>
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-stone-500">
          <FileText size={26} />
        </div>
        <p className="text-sm font-semibold text-stone-700">
          Laporan belum dapat disusun
        </p>
        <p className="max-w-sm text-xs leading-relaxed text-stone-500">
          Tambahkan data tomat terlebih dahulu agar laporan hasil ranking dapat
          dibuat dan dicetak.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Bilah aksi — tidak ikut tercetak */}
      <div className={`print-hidden ${ui.card} flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between`}>
        <div>
          <h2 className={ui.sectionTitle}>Laporan Hasil Keputusan</h2>
          <p className="mt-0.5 text-xs text-stone-500">
            Dokumen siap cetak — gunakan tombol di samping untuk mencetak atau
            mengekspor
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button onClick={handleExportCsv} className={ui.btnOutline}>
            <Download size={15} />
            Export CSV
          </button>
          <button onClick={() => window.print()} className={ui.btnPrimary}>
            <Printer size={15} />
            Cetak Laporan
          </button>
        </div>
      </div>

      {/* Lembar laporan */}
      <div className={`${ui.card} mx-auto max-w-4xl p-10 print:max-w-none print:rounded-none print:p-0 print:shadow-none print:ring-0`}>
        {/* Kop */}
        <header className="border-b-2 border-stone-900 pb-6 text-center">
          <p className="text-[11px] font-bold tracking-[0.28em] text-stone-500 uppercase">
            Sistem Pendukung Keputusan
          </p>
          <h1 className="font-display mt-2 text-2xl font-semibold tracking-tight text-stone-900">
            Laporan Pemilihan Tomat Berkualitas Tinggi
          </h1>
          <p className="mt-1.5 text-sm text-stone-500">
            Metode Simple Additive Weighting (SAW)
          </p>
        </header>

        {/* Meta */}
        <section className="mt-6 grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:grid-cols-4">
          {[
            { label: "Tanggal", value: tanggal || "—" },
            { label: "Jumlah Alternatif", value: `${tomatList.length} data` },
            { label: "Jumlah Kriteria", value: `${kriteriaList.length} kriteria` },
            {
              label: "Status Bobot",
              value: bobotValid(kriteriaList)
                ? "Valid (100%)"
                : `${(totalBobot(kriteriaList) * 100).toFixed(0)}% — dinormalisasi`,
            },
          ].map((meta) => (
            <div key={meta.label}>
              <p className="text-[10px] font-bold tracking-[0.14em] text-stone-500 uppercase">
                {meta.label}
              </p>
              <p className="mt-0.5 font-semibold text-stone-800">{meta.value}</p>
            </div>
          ))}
        </section>

        {/* Ringkasan eksekutif */}
        <section className="mt-8">
          <h2 className="font-display text-lg font-semibold text-stone-900">
            I. Ringkasan Eksekutif
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-stone-600">
            Berdasarkan perhitungan metode SAW terhadap{" "}
            <strong>{tomatList.length} alternatif</strong> dengan{" "}
            <strong>{kriteriaList.length} kriteria penilaian</strong>, alternatif
            terbaik adalah{" "}
            <strong>
              {terbaik.tomat.kode} — {terbaik.tomat.nama}
            </strong>{" "}
            dengan nilai preferensi <strong>{terbaik.nilai.toFixed(4)}</strong>.
            Rata-rata nilai preferensi seluruh alternatif adalah{" "}
            <strong>{rataRata.toFixed(4)}</strong>.
          </p>
        </section>

        {/* Kriteria */}
        <section className="mt-8">
          <h2 className="font-display text-lg font-semibold text-stone-900">
            II. Kriteria &amp; Bobot Penilaian
          </h2>
          <table className="mt-3 w-full text-left text-sm">
            <thead>
              <tr className="border-y border-stone-200 bg-stone-50">
                <th className="px-3 py-2.5 text-xs font-bold tracking-wider text-stone-500 uppercase">No</th>
                <th className="px-3 py-2.5 text-xs font-bold tracking-wider text-stone-500 uppercase">Kriteria</th>
                <th className="px-3 py-2.5 text-xs font-bold tracking-wider text-stone-500 uppercase">Tipe</th>
                <th className="px-3 py-2.5 text-right text-xs font-bold tracking-wider text-stone-500 uppercase">Bobot</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {kriteriaList.map((k, i) => (
                <tr key={k.id}>
                  <td className="px-3 py-2.5 text-stone-500">{i + 1}</td>
                  <td className="px-3 py-2.5 font-medium text-stone-800">{k.nama}</td>
                  <td className="px-3 py-2.5 text-stone-600 capitalize">{k.tipe}</td>
                  <td className="px-3 py-2.5 text-right font-mono tabular-nums">
                    {(k.bobot * 100).toFixed(0)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Ranking */}
        <section className="mt-8">
          <h2 className="font-display text-lg font-semibold text-stone-900">
            III. Hasil Perankingan
          </h2>
          <table className="mt-3 w-full text-left text-sm">
            <thead>
              <tr className="border-y border-stone-200 bg-stone-50">
                <th className="px-3 py-2.5 text-xs font-bold tracking-wider text-stone-500 uppercase">Rank</th>
                <th className="px-3 py-2.5 text-xs font-bold tracking-wider text-stone-500 uppercase">Kode</th>
                <th className="px-3 py-2.5 text-xs font-bold tracking-wider text-stone-500 uppercase">Nama Tomat</th>
                <th className="px-3 py-2.5 text-right text-xs font-bold tracking-wider text-stone-500 uppercase">
                  Nilai Preferensi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {ranking.map((item) => (
                <tr key={item.tomat.id} className={item.rank === 1 ? "bg-gold-50/50" : ""}>
                  <td className="px-3 py-2 font-bold text-stone-700">{item.rank}</td>
                  <td className="px-3 py-2 font-mono text-xs">{item.tomat.kode}</td>
                  <td className="px-3 py-2 text-stone-700">{item.tomat.nama}</td>
                  <td className="px-3 py-2 text-right font-mono tabular-nums">
                    {item.nilai.toFixed(4)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Metodologi */}
        <section className="mt-8">
          <h2 className="font-display text-lg font-semibold text-stone-900">
            IV. Metodologi
          </h2>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-stone-600">
            <li>Menyusun matriks keputusan X dari nilai setiap alternatif terhadap kriteria.</li>
            <li>
              Normalisasi matriks: kriteria benefit menggunakan R = X / max(X),
              kriteria cost menggunakan R = min(X) / X.
            </li>
            <li>Menghitung nilai preferensi V = Σ (R × W) untuk setiap alternatif.</li>
            <li>Mengurutkan alternatif berdasarkan nilai V dari yang tertinggi.</li>
          </ol>
        </section>

        {/* Tanda tangan */}
        <section className="mt-12 flex justify-end">
          <div className="text-center text-sm text-stone-600">
            <p>________________, {tanggal || "____________"}</p>
            <p className="mt-1">Penanggung Jawab,</p>
            <div className="h-20" />
            <p className="font-semibold text-stone-800">( Administrator )</p>
          </div>
        </section>
      </div>
    </div>
  );
}
