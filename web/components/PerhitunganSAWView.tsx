// components/PerhitunganSAWView.tsx (kode lengkap)
"use client";

import { Tomat, Kriteria } from "@/app/page";
import { hitungSAW, hitungNormalisasi } from "@/lib/saw";

interface PerhitunganSAWViewProps {
  tomatList: Tomat[];
  kriteriaList: Kriteria[];
}

export default function PerhitunganSAWView({ tomatList, kriteriaList }: PerhitunganSAWViewProps) {
  const ranking = hitungSAW(tomatList, kriteriaList);
  const { normalizedMatrix, maxValues, minValues } = hitungNormalisasi(tomatList, kriteriaList);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Langkah Perhitungan SAW</h2>
        
        <h3 className="font-medium mt-4 text-gray-800">1. Matriks Keputusan (X)</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-gray-700 px-2 py-1">Alternatif</th>
                {kriteriaList.map((k) => <th key={k.id} className="text-gray-700 px-2 py-1">{k.nama}</th>)}
              </tr>
            </thead>
            <tbody>
              {tomatList.slice(0, 10).map((t) => (
                <tr key={t.id} className="border-t">
                  <td className="px-2 py-1 text-gray-800">{t.nama}</td>
                  <td className="px-2 py-1 text-gray-800">{t.berat}</td>
                  <td className="px-2 py-1 text-gray-800">{t.warna}</td>
                  <td className="px-2 py-1 text-gray-800">{t.kesegaran}</td>
                  <td className="px-2 py-1 text-gray-800">{t.cacat}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {tomatList.length > 10 && <p className="text-xs text-gray-500 mt-1">... dan seterusnya</p>}
        </div>

        <h3 className="font-medium mt-6 text-gray-800">2. Normalisasi (R)</h3>
        <p className="text-sm text-gray-600">Benefit: Xij / max(Xj), Cost: min(Xj) / Xij</p>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-gray-700 px-2 py-1">Alternatif</th>
                {kriteriaList.map((k) => <th key={k.id} className="text-gray-700 px-2 py-1">{k.nama}</th>)}
              </tr>
            </thead>
            <tbody>
              {normalizedMatrix.slice(0, 10).map((item, idx) => {
                const tomat = tomatList.find(t => t.id === item.tomatId)!;
                return (
                  <tr key={tomat.id} className="border-t">
                    <td className="px-2 py-1 text-gray-800">{tomat.nama}</td>
                    {item.normalized.map((norm, i) => (
                      <td key={i} className="px-2 py-1 text-gray-800">{norm.toFixed(4)}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <h3 className="font-medium mt-6 text-gray-800">3. Nilai Preferensi (V) = Σ(Rij * Wj)</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr><th className="text-gray-700 px-2 py-1">Rank</th><th className="text-gray-700 px-2 py-1">Kode</th><th className="text-gray-700 px-2 py-1">Nama Tomat</th><th className="text-gray-700 px-2 py-1">Nilai Preferensi</th></tr>
            </thead>
            <tbody>
              {ranking.map((item, idx) => (
                <tr key={item.tomat.id} className="border-t">
                  <td className="px-2 py-1 text-gray-800">{idx+1}</td>
                  <td className="px-2 py-1 text-gray-800">{item.tomat.kode}</td>
                  <td className="px-2 py-1 text-gray-800">{item.tomat.nama}</td>
                  <td className="px-2 py-1 text-gray-800">{item.nilai.toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}