"use client";

import { Kriteria } from "@/app/page";

interface KriteriaViewProps {
  kriteriaList: Kriteria[];
  updateKriteria: (newList: Kriteria[]) => void;
}

export default function KriteriaView({ kriteriaList, updateKriteria }: KriteriaViewProps) {
  const handleBobotChange = (id: string, newBobot: number) => {
    const updated = kriteriaList.map((k) =>
      k.id === id ? { ...k, bobot: newBobot } : k
    );
    // Normalisasi bobot agar total 1
    const total = updated.reduce((sum, k) => sum + k.bobot, 0);
    if (total !== 1) {
      const normalized = updated.map((k) => ({ ...k, bobot: k.bobot / total }));
      updateKriteria(normalized);
    } else {
      updateKriteria(updated);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Kriteria & Bobot</h2>
      <div className="space-y-4">
        {kriteriaList.map((k) => (
          <div key={k.id} className="flex items-center gap-4">
            <span className="w-32 font-medium">{k.nama}</span>
            <span className="text-sm text-gray-500 w-16">({k.tipe})</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={k.bobot}
              onChange={(e) => handleBobotChange(k.id, parseFloat(e.target.value))}
              className="flex-1"
            />
            <span className="w-16 text-right">{k.bobot.toFixed(2)}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-4">Total bobot: {kriteriaList.reduce((s, k) => s + k.bobot, 0).toFixed(2)}</p>
    </div>
  );
}