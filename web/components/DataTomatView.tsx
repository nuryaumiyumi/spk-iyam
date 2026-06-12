"use client";

import { useMemo, useState } from "react";
import { Download, Plus, Search } from "lucide-react";
import {
  Kriteria,
  KRITERIA_RANGE,
  KriteriaId,
  Tomat,
} from "@/lib/types";
import { hitungSAW } from "@/lib/saw";
import { ui } from "@/lib/ui";
import { downloadCsv } from "@/lib/export";
import { useToast } from "./Toast";
import { useConfirm } from "./ConfirmDialog";
import TomatTable from "./TomatTable";
import Pagination from "./Pagination";
import Modal from "./Modal";

interface DataTomatViewProps {
  tomatList: Tomat[];
  kriteriaList: Kriteria[];
  updateTomat: (newList: Tomat[]) => void;
  rowsPerPage: number;
}

type FormState = {
  kode: string;
  nama: string;
  berat: string;
  warna: string;
  kesegaran: string;
  cacat: string;
};

const EMPTY_FORM: FormState = {
  kode: "",
  nama: "",
  berat: "170",
  warna: "4",
  kesegaran: "8",
  cacat: "2",
};

const NUMERIC_FIELDS: { id: KriteriaId; label: string; suffix: string }[] = [
  { id: "berat", label: "Berat", suffix: "gram" },
  { id: "warna", label: "Warna", suffix: "skala 1–5" },
  { id: "kesegaran", label: "Kesegaran", suffix: "skala 1–10" },
  { id: "cacat", label: "Cacat", suffix: "%" },
];

export default function DataTomatView({
  tomatList,
  kriteriaList,
  updateTomat,
  rowsPerPage,
}: DataTomatViewProps) {
  const { notify } = useToast();
  const { confirm } = useConfirm();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Tomat | null>(null);
  const [detail, setDetail] = useState<Tomat | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return tomatList;
    return tomatList.filter(
      (t) =>
        t.kode.toLowerCase().includes(q) || t.nama.toLowerCase().includes(q)
    );
  }, [tomatList, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * rowsPerPage;
  const pageData = filtered.slice(startIndex, startIndex + rowsPerPage);

  const ranking = useMemo(
    () => hitungSAW(tomatList, kriteriaList),
    [tomatList, kriteriaList]
  );
  const detailRank = detail
    ? ranking.find((r) => r.tomat.id === detail.id)
    : undefined;

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (tomat: Tomat) => {
    setEditing(tomat);
    setForm({
      kode: tomat.kode,
      nama: tomat.nama,
      berat: String(tomat.berat),
      warna: String(tomat.warna),
      kesegaran: String(tomat.kesegaran),
      cacat: String(tomat.cacat),
    });
    setErrors({});
    setModalOpen(true);
  };

  const handleDelete = async (tomat: Tomat) => {
    const ok = await confirm({
      title: "Hapus Data Tomat",
      message: `Data ${tomat.kode} — ${tomat.nama} akan dihapus permanen. Lanjutkan?`,
      confirmLabel: "Ya, hapus",
      tone: "danger",
    });
    if (!ok) return;
    updateTomat(tomatList.filter((t) => t.id !== tomat.id));
    notify("success", `Data ${tomat.kode} berhasil dihapus.`);
  };

  const validate = (): Tomat | null => {
    const next: Partial<Record<keyof FormState, string>> = {};
    const kode = form.kode.trim().toUpperCase();
    const nama = form.nama.trim();

    if (!kode) next.kode = "Kode wajib diisi.";
    else if (
      tomatList.some((t) => t.kode.toUpperCase() === kode && t.id !== editing?.id)
    )
      next.kode = "Kode sudah dipakai data lain.";
    if (!nama) next.nama = "Nama wajib diisi.";

    const values: Partial<Record<KriteriaId, number>> = {};
    for (const field of NUMERIC_FIELDS) {
      const raw = Number(form[field.id]);
      const { min, max } = KRITERIA_RANGE[field.id];
      if (form[field.id].trim() === "" || !Number.isFinite(raw)) {
        next[field.id] = "Harus berupa angka.";
      } else if (raw < min || raw > max) {
        next[field.id] = `Rentang valid ${min}–${max}.`;
      } else {
        values[field.id] = raw;
      }
    }

    setErrors(next);
    if (Object.keys(next).length > 0) return null;

    return {
      id: editing?.id ?? Math.max(0, ...tomatList.map((t) => t.id)) + 1,
      kode,
      nama,
      berat: values.berat!,
      warna: values.warna!,
      kesegaran: values.kesegaran!,
      cacat: values.cacat!,
    };
  };

  const handleSave = () => {
    const tomat = validate();
    if (!tomat) return;
    if (editing) {
      updateTomat(tomatList.map((t) => (t.id === editing.id ? tomat : t)));
      notify("success", `Data ${tomat.kode} berhasil diperbarui.`);
    } else {
      updateTomat([...tomatList, tomat]);
      notify("success", `Data ${tomat.kode} berhasil ditambahkan.`);
    }
    setModalOpen(false);
  };

  const handleExport = () => {
    downloadCsv("data-tomat.csv", [
      ["No", "Kode", "Nama", "Berat (g)", "Warna (1-5)", "Kesegaran (1-10)", "Cacat (%)"],
      ...tomatList.map((t, i) => [
        i + 1,
        t.kode,
        t.nama,
        t.berat,
        t.warna,
        t.kesegaran,
        t.cacat,
      ]),
    ]);
    notify("success", "Data tomat diekspor sebagai CSV.");
  };

  const setField = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  return (
    <div className="space-y-6">
      <div className={`${ui.card} overflow-hidden`}>
        {/* Toolbar */}
        <div className="flex flex-col gap-4 border-b border-stone-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className={ui.sectionTitle}>Data Tomat</h2>
            <p className="mt-0.5 text-xs text-stone-500">
              {tomatList.length} alternatif terdaftar
              {search && ` · ${filtered.length} hasil pencarian`}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative w-full sm:w-auto">
              <Search
                size={15}
                className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-stone-500"
              />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Cari kode atau nama…"
                aria-label="Cari data tomat"
                className={`${ui.input} w-full pl-9 sm:w-56`}
              />
            </div>
            <button onClick={handleExport} className={ui.btnOutline}>
              <Download size={15} />
              CSV
            </button>
            <button onClick={openCreate} className={`${ui.btnPrimary} flex-1 sm:flex-none`}>
              <Plus size={15} />
              Tambah Tomat
            </button>
          </div>
        </div>

        <TomatTable
          data={pageData}
          startNumber={startIndex + 1}
          onDetail={setDetail}
          onEdit={openEdit}
          onDelete={handleDelete}
        />

        {filtered.length > 0 && (
          <div className="flex flex-col items-center justify-between gap-3 border-t border-stone-100 bg-stone-50/50 px-6 py-4 sm:flex-row">
            <p className="text-xs text-stone-500">
              Menampilkan {startIndex + 1}–
              {Math.min(startIndex + rowsPerPage, filtered.length)} dari{" "}
              {filtered.length} data
            </p>
            <Pagination
              currentPage={safePage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      {/* Modal tambah / edit */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Data Tomat" : "Tambah Data Tomat"}
        subtitle={
          editing
            ? `Memperbarui ${editing.kode}`
            : "Lengkapi atribut alternatif baru"
        }
      >
        <div className="space-y-5">
          {/* Identitas */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[140px_1fr]">
            <div>
              <label className={ui.label} htmlFor="form-kode">
                Kode
              </label>
              <input
                id="form-kode"
                className={`${ui.input} font-mono uppercase ${
                  errors.kode ? "border-rose-400 focus:border-rose-500" : ""
                }`}
                placeholder="T051"
                value={form.kode}
                onChange={(e) => setField("kode", e.target.value)}
              />
              <p className={`mt-1.5 text-xs ${errors.kode ? "text-rose-600" : "text-stone-500"}`}>
                {errors.kode ?? "Unik, mis. T051"}
              </p>
            </div>
            <div>
              <label className={ui.label} htmlFor="form-nama">
                Nama Tomat
              </label>
              <input
                id="form-nama"
                className={`${ui.input} ${
                  errors.nama ? "border-rose-400 focus:border-rose-500" : ""
                }`}
                placeholder="Servo F1 · Blok F"
                value={form.nama}
                onChange={(e) => setField("nama", e.target.value)}
              />
              <p className={`mt-1.5 text-xs ${errors.nama ? "text-rose-600" : "text-stone-500"}`}>
                {errors.nama ?? "Varietas atau identitas sampel"}
              </p>
            </div>
          </div>

          {/* Nilai kriteria */}
          <div className="rounded-2xl bg-stone-50/70 p-4 ring-1 ring-stone-100 sm:p-5">
            <p className="text-[13px] font-semibold text-stone-800">
              Nilai Kriteria
            </p>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {NUMERIC_FIELDS.map((field) => {
                const range = KRITERIA_RANGE[field.id];
                return (
                  <div key={field.id}>
                    <label className={ui.label} htmlFor={`form-${field.id}`}>
                      {field.label}
                    </label>
                    <div className="relative">
                      <input
                        id={`form-${field.id}`}
                        type="number"
                        inputMode="numeric"
                        min={range.min}
                        max={range.max}
                        className={`${ui.input} pr-20 font-mono tabular-nums ${
                          errors[field.id]
                            ? "border-rose-400 focus:border-rose-500"
                            : ""
                        }`}
                        value={form[field.id]}
                        onChange={(e) => setField(field.id, e.target.value)}
                      />
                      <span className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-xs font-medium text-stone-500">
                        {field.suffix}
                      </span>
                    </div>
                    <p
                      className={`mt-1.5 text-xs ${
                        errors[field.id] ? "text-rose-600" : "text-stone-500"
                      }`}
                    >
                      {errors[field.id] ?? `Rentang ${range.min}–${range.max}`}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-stone-100 pt-4 sm:flex-row sm:justify-end">
            <button
              onClick={() => setModalOpen(false)}
              className={`${ui.btnOutline} w-full sm:w-auto`}
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              className={`${ui.btnPrimary} w-full sm:w-auto`}
            >
              {editing ? "Simpan Perubahan" : "Tambah Data"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal detail */}
      <Modal
        isOpen={detail !== null}
        onClose={() => setDetail(null)}
        title={detail ? `${detail.kode} — ${detail.nama}` : ""}
        subtitle="Detail alternatif & posisi ranking"
        size="sm"
      >
        {detail && (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-2xl bg-gradient-to-br from-stone-900 to-stone-950 px-5 py-4 text-white">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.16em] text-stone-400 uppercase">
                  Peringkat Saat Ini
                </p>
                <p className="font-display mt-1 text-2xl font-semibold">
                  #{detailRank?.rank ?? "—"}
                  <span className="ml-1.5 text-sm font-normal text-stone-400">
                    dari {ranking.length}
                  </span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-semibold tracking-[0.16em] text-stone-400 uppercase">
                  Skor SAW
                </p>
                <p className="mt-1 font-mono text-xl font-bold text-gold-300 tabular-nums">
                  {detailRank?.nilai.toFixed(4) ?? "—"}
                </p>
              </div>
            </div>
            <dl className="divide-y divide-stone-100 rounded-2xl ring-1 ring-stone-100">
              {NUMERIC_FIELDS.map((field) => (
                <div
                  key={field.id}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <dt className="text-sm text-stone-500">{field.label}</dt>
                  <dd className="font-mono text-sm font-bold text-stone-800 tabular-nums">
                    {detail[field.id]}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </Modal>
    </div>
  );
}
