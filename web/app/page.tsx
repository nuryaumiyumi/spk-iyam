// app/page.tsx
"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import DashboardView from "@/components/DashboardView";
import DataTomatView from "@/components/DataTomatView";
import KriteriaView from "@/components/KriteriaView";
import PenilaianView from "@/components/PenilaianView";
import PerhitunganSAWView from "@/components/PerhitunganSAWView";
import HasilRankingView from "@/components/HasilRankingView";
import GaleriTomatView from "@/components/GaleriTomatView";
import ImportJsonView from "@/components/ImportJsonView";
import { Menu, Calendar, User, ChevronDown } from "lucide-react";

export type Tomat = {
  id: number;
  kode: string;
  nama: string;
  berat: number;
  warna: number;
  kesegaran: number;
  cacat: number;
};

export type Kriteria = {
  id: string;
  nama: string;
  bobot: number;
  tipe: "benefit" | "cost";
};

const generateDataTomat = (): Tomat[] => {
  const data: Tomat[] = [];
  for (let i = 1; i <= 50; i++) {
    data.push({
      id: i,
      kode: `T${String(i).padStart(3, "0")}`,
      nama: `Tomat ${i}`,
      berat: Math.floor(Math.random() * (210 - 150 + 1) + 150),
      warna: Math.floor(Math.random() * (5 - 3 + 1) + 3),
      kesegaran: Math.floor(Math.random() * (10 - 6 + 1) + 6),
      cacat: Math.floor(Math.random() * (10 - 1 + 1) + 1),
    });
  }
  return data;
};

export default function Home() {
  const [currentView, setCurrentView] = useState("dashboard");
  const [tomatList, setTomatList] = useState<Tomat[]>(generateDataTomat);
  const [kriteriaList, setKriteriaList] = useState<Kriteria[]>([
    { id: "berat", nama: "Berat (g)", bobot: 0.3, tipe: "benefit" },
    { id: "warna", nama: "Warna (1-5)", bobot: 0.2, tipe: "benefit" },
    { id: "kesegaran", nama: "Kesegaran (1-10)", bobot: 0.3, tipe: "benefit" },
    { id: "cacat", nama: "Cacat (%)", bobot: 0.2, tipe: "cost" },
  ]);

  const updateTomat = (newList: Tomat[]) => setTomatList(newList);
  const updateKriteria = (newList: Kriteria[]) => setKriteriaList(newList);

  const today = new Date().toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white h-16 border-b flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button className="text-gray-500 hover:text-gray-700">
              <Menu size={20} />
            </button>
            <h2 className="text-lg font-semibold capitalize text-gray-800">
              {currentView.replace(/([A-Z])/g, ' $1').trim()}
            </h2>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar size={18} />
              <span>{today}</span>
            </div>
            <div className="flex items-center gap-2 cursor-pointer bg-gray-50 py-1.5 px-3 rounded-full border">
              <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                <User size={16} />
              </div>
              <span className="font-medium text-gray-700">Administrator</span>
              <ChevronDown size={16} className="text-gray-400" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {currentView === "dashboard" && <DashboardView tomatList={tomatList} kriteriaList={kriteriaList} />}
          {currentView === "dataTomat" && <DataTomatView tomatList={tomatList} updateTomat={updateTomat} />}
          {currentView === "kriteria" && <KriteriaView kriteriaList={kriteriaList} updateKriteria={updateKriteria} />}
          {currentView === "penilaian" && <PenilaianView tomatList={tomatList} kriteriaList={kriteriaList} updateTomat={updateTomat} />}
          {currentView === "perhitunganSaw" && <PerhitunganSAWView tomatList={tomatList} kriteriaList={kriteriaList} />}
          {currentView === "hasilRanking" && <HasilRankingView tomatList={tomatList} kriteriaList={kriteriaList} />}
          {currentView === "galeri" && <GaleriTomatView />}
          {currentView === "importJson" && <ImportJsonView updateTomat={updateTomat} />}
          {currentView === "laporan" && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800">Laporan</h2>
              <p className="text-gray-600 mt-2">Halaman laporan dalam pengembangan.</p>
            </div>
          )}
          {currentView === "pengaturan" && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800">Pengaturan</h2>
              <p className="text-gray-600 mt-2">Halaman pengaturan dalam pengembangan.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}