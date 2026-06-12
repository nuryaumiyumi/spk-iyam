"use client";

import {
  LayoutDashboard,
  Apple,
  Scale,
  ClipboardList,
  Import,
  Calculator,
  Trophy,
  FileText,
  Settings,
  User,
  ChevronDown,
  Image, // <-- tambahkan ini
} from "lucide-react";

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export default function Sidebar({ currentView, setCurrentView }: SidebarProps) {
  const menuItem = (id: string, label: string, icon: React.ReactNode) => (
    <button
      onClick={() => setCurrentView(id)}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left text-sm transition-colors ${
        currentView === id
          ? "bg-[#D92D20] text-white font-medium shadow-md"
          : "text-gray-300 hover:bg-slate-800 hover:text-white"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <aside className="w-64 bg-[#0F172A] text-white flex flex-col h-full shrink-0">
      <div className="p-6 flex items-center gap-3">
        <div className="text-3xl">🍅</div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">
            Tomat <span className="text-[#D92D20]">Terbaik</span>
          </h1>
          <p className="text-[10px] text-gray-400 font-medium tracking-wider mt-0.5">
            SPK METODE SAW
          </p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-6 overflow-y-auto mt-2">
        {menuItem("dashboard", "Dashboard", <LayoutDashboard size={18} />)}

        <div>
          <p className="px-4 text-[11px] font-semibold text-gray-500 uppercase mb-2">
            Data Master
          </p>
          <div className="space-y-1">
            {menuItem("dataTomat", "Data Tomat (Alternatif)", <Apple size={18} />)}
            {menuItem("kriteria", "Kriteria", <Scale size={18} />)}
            {menuItem("penilaian", "Penilaian", <ClipboardList size={18} />)}
            {/* Menu Galeri Tomat */}
            {menuItem("galeri", "Galeri Tomat", <Image size={18} />)}
          </div>
        </div>

        <div>
          <p className="px-4 text-[11px] font-semibold text-gray-500 uppercase mb-2">
            Proses
          </p>
          <div className="space-y-1">
            {menuItem("importJson", "Import JSON", <Import size={18} />)}
            {menuItem("perhitunganSaw", "Perhitungan SAW", <Calculator size={18} />)}
            {menuItem("hasilRanking", "Hasil Ranking", <Trophy size={18} />)}
          </div>
        </div>

        <div>
          <p className="px-4 text-[11px] font-semibold text-gray-500 uppercase mb-2">
            Laporan
          </p>
          <div className="space-y-1">
            {menuItem("laporan", "Laporan", <FileText size={18} />)}
          </div>
        </div>

        <div>
          <p className="px-4 text-[11px] font-semibold text-gray-500 uppercase mb-2">
            Pengaturan
          </p>
          <div className="space-y-1">
            {menuItem("pengaturan", "Pengaturan", <Settings size={18} />)}
          </div>
        </div>
      </nav>

      <div className="p-4 mx-4 mb-4 mt-4 bg-slate-800 rounded-xl flex items-center justify-between border border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#D92D20] flex items-center justify-center text-sm font-bold">
            A
          </div>
          <div>
            <p className="text-sm font-medium leading-none mb-1">Administrator</p>
            <p className="text-[10px] text-gray-400 leading-none">
              admin@tomatterbaik.id
            </p>
          </div>
        </div>
        <ChevronDown size={16} className="text-gray-400" />
      </div>
    </aside>
  );
}