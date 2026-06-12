// components/HasilRankingView.tsx (kode lengkap)
"use client";

import { Tomat, Kriteria } from "@/app/page";
import { hitungSAW } from "@/lib/saw";

interface HasilRankingViewProps {
  tomatList: Tomat[];
  kriteriaList: Kriteria[];
}

export default function HasilRankingView({ tomatList, kriteriaList }: HasilRankingViewProps) {
  const ranking = hitungSAW(tomatList, kriteriaList);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Hasil Ranking (SAW)</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-gray-700">Rank</th>
              <th className="px-4 py-2 text-gray-700">Kode</th>
              <th className="px-4 py-2 text-gray-700">Nama Tomat</th>
              <th className="px-4 py-2 text-gray-700">Nilai Preferensi</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((item, idx) => (
              <tr key={item.tomat.id} className="border-t">
                <td className="px-4 py-2 font-bold text-gray-800">{idx + 1}</td>
                <td className="px-4 py-2 text-gray-800">{item.tomat.kode}</td>
                <td className="px-4 py-2 text-gray-800">{item.tomat.nama}</td>
                <td className="px-4 py-2 text-gray-800">{item.nilai.toFixed(4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}