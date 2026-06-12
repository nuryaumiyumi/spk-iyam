"use client";

import { useRef, useState } from "react";
import {
  CheckCheck,
  CloudUpload,
  FileDown,
  FileJson,
  ListPlus,
  Replace,
  X,
} from "lucide-react";
import { clampNilai, KriteriaId, Tomat, ViewId } from "@/lib/types";
import { ui } from "@/lib/ui";
import { downloadJson } from "@/lib/export";
import { useToast } from "./Toast";

interface ImportJsonViewProps {
  tomatList: Tomat[];
  updateTomat: (newList: Tomat[]) => void;
  onNavigate: (view: ViewId) => void;
}

type ParseResult = {
  fileName: string;
  valid: Tomat[];
  errors: string[];
};

const NUMERIC_KEYS: KriteriaId[] = ["berat", "warna", "kesegaran", "cacat"];

const SAMPLE = [
  { kode: "T901", nama: "Servo F1 · Sampel", berat: 185, warna: 5, kesegaran: 9, cacat: 2 },
  { kode: "T902", nama: "Betavila F1 · Sampel", berat: 172, warna: 4, kesegaran: 8, cacat: 4 },
];

function parseRows(raw: unknown): Omit<ParseResult, "fileName"> {
  if (!Array.isArray(raw)) {
    return { valid: [], errors: ["Struktur JSON harus berupa array data tomat."] };
  }
  const valid: Tomat[] = [];
  const errors: string[] = [];

  raw.forEach((row, idx) => {
    const baris = `Baris ${idx + 1}`;
    if (typeof row !== "object" || row === null) {
      errors.push(`${baris}: bukan objek yang valid.`);
      return;
    }
    const r = row as Record<string, unknown>;
    const kode = typeof r.kode === "string" ? r.kode.trim().toUpperCase() : "";
    const nama = typeof r.nama === "string" ? r.nama.trim() : "";
    if (!kode || !nama) {
      errors.push(`${baris}: properti "kode" dan "nama" wajib berupa teks.`);
      return;
    }
    const values: Partial<Record<KriteriaId, number>> = {};
    for (const key of NUMERIC_KEYS) {
      const n = Number(r[key]);
      if (!Number.isFinite(n)) {
        errors.push(`${baris}: properti "${key}" harus berupa angka.`);
        return;
      }
      values[key] = clampNilai(key, n);
    }
    valid.push({
      id: 0, // id final ditetapkan saat diterapkan
      kode,
      nama,
      berat: values.berat!,
      warna: values.warna!,
      kesegaran: values.kesegaran!,
      cacat: values.cacat!,
    });
  });

  return { valid, errors };
}

export default function ImportJsonView({
  tomatList,
  updateTomat,
  onNavigate,
}: ImportJsonViewProps) {
  const { notify } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [result, setResult] = useState<ParseResult | null>(null);
  const [mode, setMode] = useState<"replace" | "append">("replace");

  const readFile = (file: File) => {
    if (!file.name.toLowerCase().endsWith(".json")) {
      notify("error", "File harus berformat .json");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(String(e.target?.result ?? ""));
        const parsed = parseRows(json);
        setResult({ fileName: file.name, ...parsed });
        if (parsed.valid.length === 0) {
          notify("error", "Tidak ada baris valid pada file tersebut.");
        }
      } catch (err) {
        setResult({
          fileName: file.name,
          valid: [],
          errors: [`JSON tidak dapat dibaca: ${(err as Error).message}`],
        });
        notify("error", "Format JSON tidak valid.");
      }
    };
    reader.readAsText(file);
  };

  const applyImport = () => {
    if (!result || result.valid.length === 0) return;

    const base = mode === "replace" ? [] : [...tomatList];
    let nextId = Math.max(0, ...base.map((t) => t.id)) + 1;
    const usedKode = new Set(base.map((t) => t.kode.toUpperCase()));
    let renamed = 0;

    const applied = result.valid.map((row) => {
      let kode = row.kode;
      while (usedKode.has(kode)) {
        kode = `T${String(nextId).padStart(3, "0")}`;
        renamed++;
      }
      usedKode.add(kode);
      return { ...row, id: nextId++, kode };
    });

    updateTomat([...base, ...applied]);
    notify(
      "success",
      `${applied.length} data berhasil diimpor${
        renamed > 0 ? ` (${renamed} kode duplikat diganti otomatis)` : ""
      }.`
    );
    setResult(null);
    onNavigate("dataTomat");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        {/* Dropzone */}
        <div className={`${ui.card} p-6 xl:col-span-3`}>
          <h2 className={ui.sectionTitle}>Import Data Tomat</h2>
          <p className="mt-0.5 text-xs text-stone-500">
            Unggah file JSON berisi array data tomat
          </p>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              const file = e.dataTransfer.files?.[0];
              if (file) readFile(file);
            }}
            onClick={() => inputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
            }}
            className={`mt-5 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-12 text-center transition ${
              dragActive
                ? "border-rose-700/50 bg-rose-50/60"
                : "border-stone-200 bg-stone-50/60 hover:border-stone-300 hover:bg-stone-50"
            }`}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-rose-700 shadow-sm ring-1 ring-stone-900/5">
              <CloudUpload size={26} />
            </div>
            <div>
              <p className="text-sm font-semibold text-stone-700">
                Seret file ke sini atau{" "}
                <span className="text-rose-700 underline-offset-2 hover:underline">
                  pilih file
                </span>
              </p>
              <p className="mt-1 text-xs text-stone-500">
                Format .json · maksimal satu file
              </p>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) readFile(file);
                e.target.value = "";
              }}
            />
          </div>

          {/* Mode impor */}
          <div className="mt-5">
            <p className={ui.label}>Mode Impor</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                onClick={() => setMode("replace")}
                className={`flex cursor-pointer items-start gap-3 rounded-2xl p-4 text-left ring-1 transition ${
                  mode === "replace"
                    ? "bg-rose-50/70 ring-rose-700/30"
                    : "bg-white ring-stone-200 hover:ring-stone-300"
                }`}
              >
                <Replace
                  size={18}
                  className={mode === "replace" ? "mt-0.5 text-rose-700" : "mt-0.5 text-stone-500"}
                />
                <span>
                  <span className="block text-sm font-semibold text-stone-800">
                    Ganti Semua
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-stone-500">
                    Data lama dihapus, diganti isi file
                  </span>
                </span>
              </button>
              <button
                onClick={() => setMode("append")}
                className={`flex cursor-pointer items-start gap-3 rounded-2xl p-4 text-left ring-1 transition ${
                  mode === "append"
                    ? "bg-rose-50/70 ring-rose-700/30"
                    : "bg-white ring-stone-200 hover:ring-stone-300"
                }`}
              >
                <ListPlus
                  size={18}
                  className={mode === "append" ? "mt-0.5 text-rose-700" : "mt-0.5 text-stone-500"}
                />
                <span>
                  <span className="block text-sm font-semibold text-stone-800">
                    Tambahkan
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-stone-500">
                    Digabung setelah {tomatList.length} data yang ada
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Panduan format */}
        <div className={`${ui.card} p-6 xl:col-span-2`}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-stone-600">
              <FileJson size={18} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-stone-800">
                Format yang Diharapkan
              </h3>
              <p className="text-xs text-stone-500">
                Properti <code>id</code> bersifat opsional
              </p>
            </div>
          </div>
          <pre className="mt-4 overflow-x-auto rounded-2xl bg-stone-950 p-4 font-mono text-[11px] leading-relaxed text-stone-300">
            {JSON.stringify(SAMPLE, null, 2)}
          </pre>
          <button
            onClick={() => downloadJson("contoh-data-tomat.json", SAMPLE)}
            className={`${ui.btnOutline} mt-4 w-full`}
          >
            <FileDown size={15} />
            Unduh Contoh File
          </button>
          <ul className="mt-4 space-y-1.5 text-xs leading-relaxed text-stone-500">
            <li>· berat: 1–1000 gram</li>
            <li>· warna: skala 1–5 · kesegaran: skala 1–10</li>
            <li>· cacat: 0–100 persen</li>
            <li>· nilai di luar rentang disesuaikan otomatis</li>
          </ul>
        </div>
      </div>

      {/* Hasil parse & pratinjau */}
      {result && (
        <div className={`${ui.card} animate-fade-up p-6`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className={ui.sectionTitle}>Pratinjau Impor</h3>
              <p className="mt-0.5 text-xs text-stone-500">
                {result.fileName} · {result.valid.length} baris valid ·{" "}
                {result.errors.length} masalah
              </p>
            </div>
            <button
              onClick={() => setResult(null)}
              aria-label="Tutup pratinjau"
              className="cursor-pointer rounded-xl p-2 text-stone-500 transition hover:bg-stone-100 hover:text-stone-700"
            >
              <X size={18} />
            </button>
          </div>

          {result.errors.length > 0 && (
            <div className="mt-4 rounded-2xl bg-rose-50 p-4 ring-1 ring-rose-600/15">
              <p className="text-xs font-bold tracking-wider text-rose-700 uppercase">
                Baris bermasalah (dilewati)
              </p>
              <ul className="mt-2 space-y-1 text-xs leading-relaxed text-rose-700/90">
                {result.errors.slice(0, 6).map((err, i) => (
                  <li key={i}>· {err}</li>
                ))}
                {result.errors.length > 6 && (
                  <li>· … dan {result.errors.length - 6} masalah lainnya</li>
                )}
              </ul>
            </div>
          )}

          {result.valid.length > 0 && (
            <>
              <div className="mt-4 overflow-x-auto rounded-xl ring-1 ring-stone-100">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-stone-100 bg-stone-50/60">
                      <th className={ui.th}>Kode</th>
                      <th className={ui.th}>Nama</th>
                      <th className={`${ui.th} text-center`}>Berat</th>
                      <th className={`${ui.th} text-center`}>Warna</th>
                      <th className={`${ui.th} text-center`}>Kesegaran</th>
                      <th className={`${ui.th} text-center`}>Cacat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50">
                    {result.valid.slice(0, 5).map((t, i) => (
                      <tr key={i}>
                        <td className={`${ui.td} font-mono text-xs font-semibold`}>{t.kode}</td>
                        <td className={ui.td}>{t.nama}</td>
                        <td className={`${ui.td} text-center font-mono tabular-nums`}>{t.berat}</td>
                        <td className={`${ui.td} text-center font-mono tabular-nums`}>{t.warna}</td>
                        <td className={`${ui.td} text-center font-mono tabular-nums`}>{t.kesegaran}</td>
                        <td className={`${ui.td} text-center font-mono tabular-nums`}>{t.cacat}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {result.valid.length > 5 && (
                <p className="mt-2 text-xs text-stone-500">
                  … dan {result.valid.length - 5} baris lainnya
                </p>
              )}
              <div className="mt-5 flex justify-end border-t border-stone-100 pt-4">
                <button onClick={applyImport} className={ui.btnPrimary}>
                  <CheckCheck size={16} />
                  Terapkan {result.valid.length} Data (
                  {mode === "replace" ? "Ganti Semua" : "Tambahkan"})
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
