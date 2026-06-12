// components/PenilaianView.tsx (kode lengkap)
"use client";

import { Tomat, Kriteria } from "@/app/page";

interface PenilaianViewProps {
  tomatList: Tomat[];
  kriteriaList: Kriteria[];
  updateTomat: (newList: Tomat[]) => void;
}

export default function PenilaianView({ tomatList, kriteriaList, updateTomat }: PenilaianViewProps) {
  const updateNilai = (tomatId: number, field: keyof Tomat, value: number) => {
    const updated = tomatList.map((t) =>
      t.id === tomatId ? { ...t, [field]: value } : t
    );
    updateTomat(updated);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Matriks Penilaian</h2>
      <table className="min-w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-3 py-2 text-gray-700">Kode</th>
            <th className="px-3 py-2 text-gray-700">Nama</th>
            {kriteriaList.map((k) => (
              <th key={k.id} className="px-3 py-2 text-gray-700">{k.nama}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tomatList.map((t) => (
            <tr key={t.id} className="border-t">
              <td className="px-3 py-2 text-gray-800">{t.kode}</td>
              <td className="px-3 py-2 text-gray-800">{t.nama}</td>
              <td className="px-3 py-2">
                <input
                  type="number"
                  value={t.berat}
                  onChange={(e) => updateNilai(t.id, "berat", parseInt(e.target.value))}
                  className="w-20 border rounded px-1 text-gray-900"
                />
              </td>
              <td className="px-3 py-2">
                <input
                  type="number"
                  value={t.warna}
                  min={1} max={5}
                  onChange={(e) => updateNilai(t.id, "warna", parseInt(e.target.value))}
                  className="w-20 border rounded px-1 text-gray-900"
                />
              </td>
              <td className="px-3 py-2">
                <input
                  type="number"
                  value={t.kesegaran}
                  min={1} max={10}
                  onChange={(e) => updateNilai(t.id, "kesegaran", parseInt(e.target.value))}
                  className="w-20 border rounded px-1 text-gray-900"
                />
              </td>
              <td className="px-3 py-2">
                <input
                  type="number"
                  value={t.cacat}
                  min={0}
                  onChange={(e) => updateNilai(t.id, "cacat", parseInt(e.target.value))}
                  className="w-20 border rounded px-1 text-gray-900"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}