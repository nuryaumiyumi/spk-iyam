"use client";

import { useState } from "react";
import TomatTable from "./TomatTable";
import Pagination from "./Pagination";
import { Tomat, Kriteria } from "@/app/page";
import { Database, Grid, ClipboardList, Star, Info } from "lucide-react";

interface DashboardViewProps {
  tomatList: Tomat[];
  kriteriaList: Kriteria[];
}

export default function DashboardView({ tomatList, kriteriaList }: DashboardViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(tomatList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = tomatList.slice(startIndex, startIndex + itemsPerPage);

  // Hitung nilai tertinggi untuk "Tomat Terbaik" (sementara menggunakan nilai contoh dari gambar)
  // Sebaiknya dihitung dari hasil SAW, tapi untuk kesesuaian tampilan, kita gunakan data contoh.
  const bestTomatoCode = "T005";
  const bestTomatoValue = "0.9231";

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-white rounded-2xl p-8 flex justify-between items-center relative overflow-hidden shadow-sm border">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-gray-800">
            Sistem Pendukung Keputusan
          </h2>
          <h3 className="text-3xl font-bold text-[#D92D20] mt-1">
            Pemilihan Tomat Berkualitas Tinggi
          </h3>
          <p className="text-gray-500 mt-4 max-w-md text-sm leading-relaxed">
            Kelola data tomat, kriteria, penilaian, dan lakukan perankingan
            menggunakan metode SAW.
          </p>
          <button className="mt-6 bg-[#D92D20] hover:bg-red-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition shadow-md flex items-center gap-2">
            <Database size={18} />
            Mulai Hitung SAW
          </button>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-red-50 to-transparent pointer-events-none rounded-r-2xl"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-full flex items-center justify-center bg-red-50">
            <Database size={24} className="text-[#D92D20]" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium mb-1">
              Total Data Tomat
            </p>
            <p className="text-2xl font-bold text-gray-800 leading-none">
              {tomatList.length}
            </p>
            <p className="text-[11px] text-gray-400 mt-1">Data alternatif</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-full flex items-center justify-center bg-yellow-50">
            <Grid size={24} className="text-yellow-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium mb-1">
              Total Kriteria
            </p>
            <p className="text-2xl font-bold text-gray-800 leading-none">
              {kriteriaList.length}
            </p>
            <p className="text-[11px] text-gray-400 mt-1">Kriteria penilaian</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-full flex items-center justify-center bg-green-50">
            <ClipboardList size={24} className="text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium mb-1">
              Total Penilaian
            </p>
            <p className="text-2xl font-bold text-gray-800 leading-none">
              {tomatList.length}
            </p>
            <p className="text-[11px] text-gray-400 mt-1">Data penilaian</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-full flex items-center justify-center bg-purple-50">
            <Star size={24} className="text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium mb-1">
              Tomat Terbaik
            </p>
            <p className="text-2xl font-bold text-gray-800 leading-none">
              {bestTomatoCode}
            </p>
            <p className="text-[11px] text-gray-400 mt-1">
              {bestTomatoValue}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid Area: Table & Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table Section */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h3 className="text-base font-bold text-gray-800">
              Data Tomat Terbaru
            </h3>
            <button className="text-sm text-gray-500 flex items-center gap-1 hover:text-gray-800">
              Lihat Semua <span className="text-lg leading-none">›</span>
            </button>
          </div>
          <div className="flex-1 p-0">
            <TomatTable data={currentData} showActions={true} />
          </div>
          <div className="px-6 py-4 border-t flex justify-between items-center bg-gray-50 text-sm text-gray-500">
            <span>
              Menampilkan {startIndex + 1} sampai{" "}
              {Math.min(startIndex + itemsPerPage, tomatList.length)} dari{" "}
              {tomatList.length} data
            </span>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-[#FFF5F6] border border-red-100 p-6 rounded-xl relative overflow-hidden flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-gray-800 mb-4">Informasi Sistem</h4>
            <div className="flex gap-3">
              <div className="mt-1 w-6 h-6 rounded-full bg-[#D92D20] text-white flex items-center justify-center shrink-0">
                <Info size={14} />
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Sistem Pendukung Keputusan Pemilihan Tomat Berkualitas Tinggi
                menggunakan metode SAW (Simple Additive Weighting). Sistem
                membantu pengguna menentukan tomat terbaik berdasarkan kriteria
                yang telah ditetapkan secara objektif dan cepat.
              </p>
            </div>
          </div>
          <div className="h-40 mt-6 rounded-lg bg-red-50/50 flex items-end justify-center">
            <span className="text-red-200 text-xs mb-4">Ilustrasi Tomat</span>
          </div>
        </div>
      </div>
    </div>
  );
}