// components/ImportJsonView.tsx
"use client";

import { useState } from "react";
import { Tomat } from "@/app/page";

interface ImportJsonViewProps {
  updateTomat: (newList: Tomat[]) => void;
}

export default function ImportJsonView({ updateTomat }: ImportJsonViewProps) {
  const [error, setError] = useState("");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        // Validasi struktur data (array of Tomat)
        if (Array.isArray(json) && json.length > 0 && json[0].id && json[0].kode && json[0].nama) {
          updateTomat(json as Tomat[]);
          setError("");
          alert("Data berhasil diimpor!");
        } else {
          setError("Format JSON tidak valid. Harus array of Tomat dengan properti id, kode, nama, berat, warna, kesegaran, cacat.");
        }
      } catch (err) {
        setError("Gagal parse JSON: " + (err as Error).message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Import Data Tomat (JSON)</h2>
      <div className="space-y-4">
        <p className="text-gray-600">Upload file JSON dengan format array data tomat.</p>
        <input
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-sm text-gray-500">Contoh format JSON:</p>
          <pre className="text-xs text-gray-600 mt-2 overflow-x-auto">
{`[
  {
    "id": 1,
    "kode": "T001",
    "nama": "Tomat 1",
    "berat": 180,
    "warna": 4,
    "kesegaran": 8,
    "cacat": 2
  }
]`}
          </pre>
        </div>
      </div>
    </div>
  );
}