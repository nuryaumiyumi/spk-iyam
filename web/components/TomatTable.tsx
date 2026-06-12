import { Tomat } from "@/utils/saw";
import { Edit, Trash2, Eye } from "lucide-react";

interface TomatTableProps {
  data: Tomat[];
  onEdit?: (tomat: Tomat) => void;
  onDelete?: (id: number) => void;
  showActions?: boolean;
}

export default function TomatTable({ data, onEdit, onDelete, showActions = true }: TomatTableProps) {
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-white border-b text-gray-500 font-medium">
          <tr>
            <th className="px-6 py-4 font-semibold">No</th>
            <th className="px-6 py-4 font-semibold">Kode</th>
            <th className="px-6 py-4 font-semibold">Nama Tomat</th>
            <th className="px-6 py-4 text-center font-semibold">Berat (g)</th>
            <th className="px-6 py-4 text-center font-semibold">Warna (1-5)</th>
            <th className="px-6 py-4 text-center font-semibold">Kesegaran (1-10)</th>
            <th className="px-6 py-4 text-center font-semibold">Cacat (%)</th>
            {showActions && <th className="px-6 py-4 text-center font-semibold">Aksi</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((tomat, idx) => (
            <tr key={tomat.id} className="hover:bg-gray-50/50 transition">
              <td className="px-6 py-4 text-gray-600">{idx + 1}</td>
              <td className="px-6 py-4 font-medium text-gray-800">{tomat.kode}</td>
              <td className="px-6 py-4 text-gray-600">{tomat.nama}</td>
              <td className="px-6 py-4 text-center text-gray-600">{tomat.berat}</td>
              <td className="px-6 py-4 text-center text-gray-600">{tomat.warna}</td>
              <td className="px-6 py-4 text-center text-gray-600">{tomat.kesegaran}</td>
              <td className="px-6 py-4 text-center text-gray-600">{tomat.cacat}</td>
              {showActions && (
                <td className="px-6 py-4 text-center">
                  <div className="flex gap-3 justify-center items-center">
                    <button className="text-gray-400 hover:text-gray-600">
                      <Eye size={18} />
                    </button>
                    <button 
                      onClick={() => onEdit?.(tomat)} 
                      className="text-amber-500 hover:text-amber-600"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => onDelete?.(tomat.id)} 
                      className="text-[#D92D20] hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
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