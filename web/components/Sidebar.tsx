"use client";

import { ReactNode } from "react";
import {
  LayoutDashboard,
  Cherry,
  Scale,
  ClipboardList,
  Import,
  Calculator,
  Trophy,
  FileText,
  Settings,
  Image as ImageIcon,
} from "lucide-react";
import { ViewId } from "@/lib/types";
import TomatIllustration from "./TomatIllustration";

interface SidebarProps {
  currentView: ViewId;
  onNavigate: (view: ViewId) => void;
  collapsed?: boolean;
}

type MenuEntry = { id: ViewId; label: string; icon: ReactNode };

const DASHBOARD: MenuEntry = {
  id: "dashboard",
  label: "Dashboard",
  icon: <LayoutDashboard size={17} />,
};

const SECTIONS: { title: string; items: MenuEntry[] }[] = [
  {
    title: "Data Master",
    items: [
      { id: "dataTomat", label: "Data Tomat", icon: <Cherry size={17} /> },
      { id: "kriteria", label: "Kriteria & Bobot", icon: <Scale size={17} /> },
      { id: "penilaian", label: "Penilaian", icon: <ClipboardList size={17} /> },
      { id: "galeri", label: "Galeri Tomat", icon: <ImageIcon size={17} /> },
    ],
  },
  {
    title: "Proses",
    items: [
      { id: "importJson", label: "Import JSON", icon: <Import size={17} /> },
      { id: "perhitunganSaw", label: "Perhitungan SAW", icon: <Calculator size={17} /> },
      { id: "hasilRanking", label: "Hasil Ranking", icon: <Trophy size={17} /> },
    ],
  },
  {
    title: "Lainnya",
    items: [
      { id: "laporan", label: "Laporan", icon: <FileText size={17} /> },
      { id: "pengaturan", label: "Pengaturan", icon: <Settings size={17} /> },
    ],
  },
];

export default function Sidebar({
  currentView,
  onNavigate,
  collapsed = false,
}: SidebarProps) {
  const navItem = (item: MenuEntry) => {
    const active = currentView === item.id;
    return (
      <button
        key={item.id}
        onClick={() => onNavigate(item.id)}
        title={collapsed ? item.label : undefined}
        aria-current={active ? "page" : undefined}
        className={`flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] font-medium transition-colors duration-150 ${
          collapsed ? "justify-center px-0" : ""
        } ${
          active
            ? "bg-gradient-to-r from-rose-700 to-rose-800 text-white shadow-[0_4px_12px_-4px_rgba(159,18,57,0.5)]"
            : "text-stone-400 hover:bg-white/[0.06] hover:text-white"
        }`}
      >
        <span className="shrink-0">{item.icon}</span>
        {!collapsed && <span className="truncate">{item.label}</span>}
      </button>
    );
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-stone-950 text-white">
      {/* Brand */}
      <div
        className={`flex items-center gap-3 px-5 pt-5 pb-4 ${
          collapsed ? "justify-center px-0" : ""
        }`}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-700 to-rose-950 ring-1 ring-white/10">
          <TomatIllustration className="h-6 w-6" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <h1 className="text-[15px] leading-tight font-semibold tracking-tight whitespace-nowrap">
              Tomat <span className="text-gold-300">Terbaik</span>
            </h1>
            <p className="text-[10px] font-medium tracking-[0.14em] text-stone-500 uppercase">
              SPK Metode SAW
            </p>
          </div>
        )}
      </div>

      {/* Navigasi — scrollbar disembunyikan, konten dipadatkan agar muat */}
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {navItem(DASHBOARD)}

        {SECTIONS.map((section) => (
          <div key={section.title}>
            {!collapsed ? (
              <p className="mb-1.5 px-3 text-[10px] font-semibold tracking-[0.12em] text-stone-500 uppercase">
                {section.title}
              </p>
            ) : (
              <div className="mx-2 mb-2 h-px bg-white/[0.07]" />
            )}
            <div className="space-y-0.5">{section.items.map(navItem)}</div>
          </div>
        ))}
      </nav>

      {/* Pengguna */}
      <div
        className={`flex items-center gap-2.5 border-t border-white/[0.07] px-5 py-3.5 ${
          collapsed ? "justify-center px-0" : ""
        }`}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold-300 to-gold-600 text-xs font-bold text-stone-900">
          A
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-[13px] leading-tight font-medium">
              Administrator
            </p>
            <p className="truncate text-[11px] text-stone-500">
              admin@tomatterbaik.id
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
