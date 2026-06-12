"use client";

import { Tomat } from "@/lib/types";
import { ui } from "@/lib/ui";
import { Eye, PackageOpen, Pencil, Trash2 } from "lucide-react";

interface TomatTableProps {
  data: Tomat[];
  startNumber?: number;
  onDetail?: (tomat: Tomat) => void;
  onEdit?: (tomat: Tomat) => void;
  onDelete?: (tomat: Tomat) => void;
}

export default function TomatTable({
  data,
  startNumber = 1,
  onDetail,
  onEdit,
  onDelete,
}: TomatTableProps) {
  const showActions = Boolean(onDetail || onEdit || onDelete);

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-stone-500">
          <PackageOpen size={26} />
        </div>
        <div>
          <p className="text-sm font-semibold text-stone-700">Belum ada data tomat</p>
          <p className="mt-1 text-xs text-stone-500">
            Tambahkan data baru atau muat data contoh melalui halaman Pengaturan.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-stone-100 bg-stone-50/60">
            <th className={ui.th}>No</th>
            <th className={ui.th}>Kode</th>
            <th className={ui.th}>Nama Tomat</th>
            <th className={`${ui.th} text-center`}>Berat (g)</th>
            <th className={`${ui.th} text-center`}>Warna (1–5)</th>
            <th className={`${ui.th} text-center`}>Kesegaran (1–10)</th>
            <th className={`${ui.th} text-center`}>Cacat (%)</th>
            {showActions && <th className={`${ui.th} text-center`}>Aksi</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-50">
          {data.map((tomat, idx) => (
            <tr key={tomat.id} className="transition-colors hover:bg-stone-50/70">
              <td className={`${ui.td} text-stone-500`}>{startNumber + idx}</td>
              <td className={ui.td}>
                <span className="rounded-lg bg-stone-100 px-2 py-1 font-mono text-xs font-semibold text-stone-700">
                  {tomat.kode}
                </span>
              </td>
              <td className={`${ui.td} font-medium text-stone-800`}>{tomat.nama}</td>
              <td className={`${ui.td} text-center font-mono tabular-nums`}>{tomat.berat}</td>
              <td className={`${ui.td} text-center font-mono tabular-nums`}>{tomat.warna}</td>
              <td className={`${ui.td} text-center font-mono tabular-nums`}>{tomat.kesegaran}</td>
              <td className={`${ui.td} text-center font-mono tabular-nums`}>{tomat.cacat}</td>
              {showActions && (
                <td className={ui.td}>
                  <div className="flex items-center justify-center gap-1">
                    {onDetail && (
                      <button
                        onClick={() => onDetail(tomat)}
                        aria-label={`Detail ${tomat.kode}`}
                        title="Lihat detail"
                        className="cursor-pointer rounded-lg p-2 text-stone-500 transition hover:bg-stone-100 hover:text-stone-700"
                      >
                        <Eye size={16} />
                      </button>
                    )}
                    {onEdit && (
                      <button
                        onClick={() => onEdit(tomat)}
                        aria-label={`Edit ${tomat.kode}`}
                        title="Edit data"
                        className="cursor-pointer rounded-lg p-2 text-gold-700 transition hover:bg-gold-50 hover:text-gold-800"
                      >
                        <Pencil size={16} />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(tomat)}
                        aria-label={`Hapus ${tomat.kode}`}
                        title="Hapus data"
                        className="cursor-pointer rounded-lg p-2 text-rose-600 transition hover:bg-rose-50 hover:text-rose-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
