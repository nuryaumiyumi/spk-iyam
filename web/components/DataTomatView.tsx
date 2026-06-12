"use client";

import { useState } from "react";
import { Tomat } from "@/app/page";
import TomatTable from "./TomatTable";
import Modal from "./Modal";

interface DataTomatViewProps {
  tomatList: Tomat[];
  updateTomat: (newList: Tomat[]) => void;
}

export default function DataTomatView({ tomatList, updateTomat }: DataTomatViewProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTomat, setEditingTomat] = useState<Tomat | null>(null);
  const [form, setForm] = useState({
    kode: "",
    nama: "",
    berat: 0,
    warna: 3,
    kesegaran: 6,
    cacat: 1,
  });

  const handleEdit = (tomat: Tomat) => {
    setEditingTomat(tomat);
    setForm({
      kode: tomat.kode,
      nama: tomat.nama,
      berat: tomat.berat,
      warna: tomat.warna,
      kesegaran: tomat.kesegaran,
      cacat: tomat.cacat,
    });
    setModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Hapus data tomat?")) {
      updateTomat(tomatList.filter((t) => t.id !== id));
    }
  };

  const handleSave = () => {
    if (editingTomat) {
      const updated = tomatList.map((t) =>
        t.id === editingTomat.id ? { ...t, ...form } : t
      );
      updateTomat(updated);
    } else {
      const newId = Math.max(...tomatList.map((t) => t.id), 0) + 1;
      const newTomat: Tomat = { id: newId, ...form };
      updateTomat([...tomatList, newTomat]);
    }
    setModalOpen(false);
    setEditingTomat(null);
    setForm({ kode: "", nama: "", berat: 0, warna: 3, kesegaran: 6, cacat: 1 });
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Data Tomat (Alternatif)</h2>
        <button
          onClick={() => {
            setEditingTomat(null);
            setForm({ kode: "", nama: "", berat: 0, warna: 3, kesegaran: 6, cacat: 1 });
            setModalOpen(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Tambah Tomat
        </button>
      </div>
      <TomatTable data={tomatList} onEdit={handleEdit} onDelete={handleDelete} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingTomat ? "Edit Tomat" : "Tambah Tomat"}>
        <div className="space-y-3">
          <input className="w-full border p-2 rounded" placeholder="Kode" value={form.kode} onChange={(e) => setForm({ ...form, kode: e.target.value })} />
          <input className="w-full border p-2 rounded" placeholder="Nama Tomat" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} />
          <input className="w-full border p-2 rounded" type="number" placeholder="Berat (g)" value={form.berat} onChange={(e) => setForm({ ...form, berat: parseInt(e.target.value) })} />
          <input className="w-full border p-2 rounded" type="number" placeholder="Warna (1-5)" min={1} max={5} value={form.warna} onChange={(e) => setForm({ ...form, warna: parseInt(e.target.value) })} />
          <input className="w-full border p-2 rounded" type="number" placeholder="Kesegaran (1-10)" min={1} max={10} value={form.kesegaran} onChange={(e) => setForm({ ...form, kesegaran: parseInt(e.target.value) })} />
          <input className="w-full border p-2 rounded" type="number" placeholder="Cacat (%)" min={0} max={100} value={form.cacat} onChange={(e) => setForm({ ...form, cacat: parseInt(e.target.value) })} />
          <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded w-full">Simpan</button>
        </div>
      </Modal>
    </div>
  );
}