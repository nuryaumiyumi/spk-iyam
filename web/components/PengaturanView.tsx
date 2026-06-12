"use client";

import { useRef } from "react";
import {
  DatabaseBackup,
  FolderUp,
  Info,
  ListRestart,
  Trash2,
} from "lucide-react";
import { Kriteria, KRITERIA_DEFAULT, Tomat, clampNilai } from "@/lib/types";
import { ui } from "@/lib/ui";
import { generateSampleTomat } from "@/lib/data";
import { downloadJson } from "@/lib/export";
import { useToast } from "./Toast";
import { useConfirm } from "./ConfirmDialog";

interface PengaturanViewProps {
  tomatList: Tomat[];
  kriteriaList: Kriteria[];
  updateTomat: (newList: Tomat[]) => void;
  updateKriteria: (newList: Kriteria[]) => void;
  rowsPerPage: number;
  setRowsPerPage: (rows: number) => void;
}

const ROWS_OPTIONS = [10, 15, 25, 50];

export default function PengaturanView({
  tomatList,
  kriteriaList,
  updateTomat,
  updateKriteria,
  rowsPerPage,
  setRowsPerPage,
}: PengaturanViewProps) {
  const { notify } = useToast();
  const { confirm } = useConfirm();
  const backupInputRef = useRef<HTMLInputElement>(null);

  const handleExportBackup = () => {
    downloadJson("backup-spk-tomat.json", {
      app: "spk-tomat-terbaik",
      version: 1,
      exportedAt: new Date().toISOString(),
      tomatList,
      kriteriaList,
    });
    notify("success", "Cadangan data berhasil diunduh.");
  };

  const handleImportBackup = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(String(e.target?.result ?? ""));
        if (!Array.isArray(json?.tomatList) || !Array.isArray(json?.kriteriaList)) {
          notify("error", "File cadangan tidak dikenali — properti tomatList/kriteriaList tidak ditemukan.");
          return;
        }
        const tomat: Tomat[] = (json.tomatList as unknown[])
          .filter(
            (r): r is Record<string, unknown> =>
              typeof r === "object" && r !== null
          )
          .map((r, idx) => ({
            id: idx + 1,
            kode:
              typeof r.kode === "string" && r.kode.trim()
                ? r.kode.trim().toUpperCase()
                : `T${String(idx + 1).padStart(3, "0")}`,
            nama: typeof r.nama === "string" && r.nama.trim() ? r.nama.trim() : `Tomat ${idx + 1}`,
            berat: clampNilai("berat", Number(r.berat)),
            warna: clampNilai("warna", Number(r.warna)),
            kesegaran: clampNilai("kesegaran", Number(r.kesegaran)),
            cacat: clampNilai("cacat", Number(r.cacat)),
          }));

        const kriteriaImpor = json.kriteriaList as Partial<Kriteria>[];
        const kriteria: Kriteria[] = KRITERIA_DEFAULT.map((def) => {
          const match = kriteriaImpor.find((k) => k?.id === def.id);
          if (!match) return { ...def };
          const bobot = Number(match.bobot);
          return {
            ...def,
            bobot: Number.isFinite(bobot) ? Math.min(1, Math.max(0, bobot)) : def.bobot,
            tipe: match.tipe === "cost" ? "cost" : "benefit",
          };
        });

        updateTomat(tomat);
        updateKriteria(kriteria);
        notify("success", `Cadangan dipulihkan — ${tomat.length} data tomat dimuat.`);
      } catch {
        notify("error", "File cadangan bukan JSON yang valid.");
      }
    };
    reader.readAsText(file);
  };

  const handleResetSample = async () => {
    const ok = await confirm({
      title: "Muat Ulang Data Contoh",
      message:
        "Seluruh data saat ini akan diganti dengan 50 data contoh bawaan beserta bobot kriteria default. Lanjutkan?",
      confirmLabel: "Ya, muat ulang",
    });
    if (!ok) return;
    updateTomat(generateSampleTomat());
    updateKriteria(KRITERIA_DEFAULT.map((k) => ({ ...k })));
    notify("success", "Data contoh dan bobot default berhasil dimuat.");
  };

  const handleClearAll = async () => {
    const ok = await confirm({
      title: "Hapus Semua Data",
      message: `${tomatList.length} data tomat akan dihapus permanen. Tindakan ini tidak dapat dibatalkan. Lanjutkan?`,
      confirmLabel: "Ya, hapus semua",
      tone: "danger",
    });
    if (!ok) return;
    updateTomat([]);
    notify("info", "Seluruh data tomat telah dihapus.");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className={ui.sectionTitle}>Pengaturan</h2>
        <p className="mt-0.5 text-xs text-stone-500">
          Kelola data aplikasi dan preferensi tampilan
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Manajemen data */}
        <div className={`${ui.card} p-6`}>
          <h3 className="text-sm font-bold tracking-wider text-stone-500 uppercase">
            Manajemen Data
          </h3>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between gap-4 rounded-2xl bg-stone-50 p-4 ring-1 ring-stone-100">
              <div className="flex items-start gap-3">
                <DatabaseBackup size={18} className="mt-0.5 shrink-0 text-stone-500" />
                <div>
                  <p className="text-sm font-semibold text-stone-800">Cadangkan Data</p>
                  <p className="mt-0.5 text-xs text-stone-500">
                    Unduh {tomatList.length} data tomat &amp; bobot kriteria sebagai JSON
                  </p>
                </div>
              </div>
              <button onClick={handleExportBackup} className={`${ui.btnOutline} shrink-0 px-3.5 py-2 text-xs`}>
                Unduh
              </button>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-2xl bg-stone-50 p-4 ring-1 ring-stone-100">
              <div className="flex items-start gap-3">
                <FolderUp size={18} className="mt-0.5 shrink-0 text-stone-500" />
                <div>
                  <p className="text-sm font-semibold text-stone-800">Pulihkan Cadangan</p>
                  <p className="mt-0.5 text-xs text-stone-500">
                    Muat file cadangan yang pernah diunduh
                  </p>
                </div>
              </div>
              <input
                ref={backupInputRef}
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImportBackup(file);
                  e.target.value = "";
                }}
              />
              <button
                onClick={() => backupInputRef.current?.click()}
                className={`${ui.btnOutline} shrink-0 px-3.5 py-2 text-xs`}
              >
                Pilih File
              </button>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-2xl bg-gold-50/60 p-4 ring-1 ring-gold-500/15">
              <div className="flex items-start gap-3">
                <ListRestart size={18} className="mt-0.5 shrink-0 text-gold-700" />
                <div>
                  <p className="text-sm font-semibold text-stone-800">Muat Data Contoh</p>
                  <p className="mt-0.5 text-xs text-stone-500">
                    Kembalikan 50 data contoh &amp; bobot default
                  </p>
                </div>
              </div>
              <button onClick={handleResetSample} className={`${ui.btnGold} shrink-0 px-3.5 py-2 text-xs`}>
                Muat Ulang
              </button>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-2xl bg-rose-50/60 p-4 ring-1 ring-rose-600/10">
              <div className="flex items-start gap-3">
                <Trash2 size={18} className="mt-0.5 shrink-0 text-rose-600" />
                <div>
                  <p className="text-sm font-semibold text-stone-800">Hapus Semua Data</p>
                  <p className="mt-0.5 text-xs text-stone-500">
                    Kosongkan seluruh data tomat secara permanen
                  </p>
                </div>
              </div>
              <button onClick={handleClearAll} className={`${ui.btnDanger} shrink-0 px-3.5 py-2 text-xs`}>
                Hapus
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Preferensi */}
          <div className={`${ui.card} p-6`}>
            <h3 className="text-sm font-bold tracking-wider text-stone-500 uppercase">
              Preferensi Tampilan
            </h3>
            <div className="mt-4">
              <p className="text-sm font-semibold text-stone-800">Baris per Halaman</p>
              <p className="mt-0.5 text-xs text-stone-500">
                Jumlah data per halaman pada tabel Data Tomat &amp; Penilaian
              </p>
              <div className="mt-3 flex gap-2">
                {ROWS_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setRowsPerPage(opt);
                      notify("success", `Tabel kini menampilkan ${opt} baris per halaman.`);
                    }}
                    className={`flex-1 cursor-pointer rounded-xl px-3 py-2.5 font-mono text-sm font-bold transition ${
                      rowsPerPage === opt
                        ? "bg-stone-900 text-white shadow-md"
                        : "bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-700"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tentang */}
          <div className={`${ui.card} p-6`}>
            <h3 className="text-sm font-bold tracking-wider text-stone-500 uppercase">
              Tentang Aplikasi
            </h3>
            <div className="mt-4 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-600">
                <Info size={18} />
              </div>
              <div className="text-sm leading-relaxed text-stone-600">
                <p className="font-semibold text-stone-800">
                  SPK Tomat Terbaik · v1.0
                </p>
                <p className="mt-1.5 text-[13px]">
                  Sistem Pendukung Keputusan pemilihan tomat berkualitas tinggi
                  menggunakan metode{" "}
                  <strong>Simple Additive Weighting (SAW)</strong>. Data
                  tersimpan secara lokal di peramban Anda (localStorage) dan
                  dapat dicadangkan kapan saja.
                </p>
                <p className="mt-2 text-xs text-stone-500">
                  Dibangun dengan Next.js, React, dan Tailwind CSS.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
