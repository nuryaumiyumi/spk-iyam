"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Calendar,
  ChevronDown,
  FileText,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  User,
  X,
} from "lucide-react";
import {
  clampNilai,
  Kriteria,
  KRITERIA_DEFAULT,
  Tomat,
  VIEW_LABELS,
  ViewId,
} from "@/lib/types";
import { generateSampleTomat } from "@/lib/data";
import { useLocalStorageRaw, useToday } from "@/lib/hooks";
import ToastProvider from "@/components/Toast";
import ConfirmProvider from "@/components/ConfirmDialog";
import Sidebar from "@/components/Sidebar";
import DashboardView from "@/components/DashboardView";
import DataTomatView from "@/components/DataTomatView";
import KriteriaView from "@/components/KriteriaView";
import PenilaianView from "@/components/PenilaianView";
import PerhitunganSAWView from "@/components/PerhitunganSAWView";
import HasilRankingView from "@/components/HasilRankingView";
import GaleriTomatView from "@/components/GaleriTomatView";
import ImportJsonView from "@/components/ImportJsonView";
import LaporanView from "@/components/LaporanView";
import PengaturanView from "@/components/PengaturanView";

const STORAGE_KEY = "spk-tomat-terbaik:v1";
const SAMPLE_TOMAT = generateSampleTomat();

type StoredState = {
  tomatList: Tomat[];
  kriteriaList: Kriteria[];
  rowsPerPage: number;
};

/** Parse & sanitasi data tersimpan; null bila tidak ada / rusak. */
function parseStored(raw: string | null): StoredState | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed?.tomatList) || !Array.isArray(parsed?.kriteriaList)) {
      return null;
    }
    const tomatList: Tomat[] = (parsed.tomatList as unknown[])
      .filter((r): r is Record<string, unknown> => typeof r === "object" && r !== null)
      .map((r, idx) => ({
        id: Number.isFinite(Number(r.id)) ? Number(r.id) : idx + 1,
        kode: typeof r.kode === "string" ? r.kode : `T${String(idx + 1).padStart(3, "0")}`,
        nama: typeof r.nama === "string" ? r.nama : `Tomat ${idx + 1}`,
        berat: clampNilai("berat", Number(r.berat)),
        warna: clampNilai("warna", Number(r.warna)),
        kesegaran: clampNilai("kesegaran", Number(r.kesegaran)),
        cacat: clampNilai("cacat", Number(r.cacat)),
      }));
    const kriteriaImpor = parsed.kriteriaList as Partial<Kriteria>[];
    const kriteriaList: Kriteria[] = KRITERIA_DEFAULT.map((def) => {
      const match = kriteriaImpor.find((k) => k?.id === def.id);
      if (!match) return { ...def };
      const bobot = Number(match.bobot);
      return {
        ...def,
        bobot: Number.isFinite(bobot) ? Math.min(1, Math.max(0, bobot)) : def.bobot,
        tipe: match.tipe === "cost" ? "cost" : "benefit",
      };
    });
    const rows = Number(parsed.rowsPerPage);
    const rowsPerPage = [10, 15, 25, 50].includes(rows) ? rows : 10;
    return { tomatList, kriteriaList, rowsPerPage };
  } catch {
    return null;
  }
}

function AppShell() {
  const [currentView, setCurrentView] = useState<ViewId>("dashboard");

  // Data efektif = suntingan sesi ini → data tersimpan → data contoh.
  // localStorage dibaca sebagai external store sehingga bebas hydration mismatch.
  const storedRaw = useLocalStorageRaw(STORAGE_KEY);
  const restored = useMemo(() => parseStored(storedRaw), [storedRaw]);

  const [tomatEdits, setTomatEdits] = useState<Tomat[] | null>(null);
  const [kriteriaEdits, setKriteriaEdits] = useState<Kriteria[] | null>(null);
  const [rowsEdit, setRowsEdit] = useState<number | null>(null);

  const tomatList = tomatEdits ?? restored?.tomatList ?? SAMPLE_TOMAT;
  const kriteriaList = kriteriaEdits ?? restored?.kriteriaList ?? KRITERIA_DEFAULT;
  const rowsPerPage = rowsEdit ?? restored?.rowsPerPage ?? 10;

  // Simpan otomatis setelah ada perubahan dari pengguna.
  useEffect(() => {
    if (tomatEdits === null && kriteriaEdits === null && rowsEdit === null) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ tomatList, kriteriaList, rowsPerPage })
      );
    } catch {
      // Penyimpanan penuh / tidak tersedia — data tetap aman di memori.
    }
  }, [tomatEdits, kriteriaEdits, rowsEdit, tomatList, kriteriaList, rowsPerPage]);

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const today = useToday(true);

  const navigate = useCallback((view: ViewId) => {
    setCurrentView(view);
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, []);

  // Tutup drawer mobile dengan tombol Escape.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  return (
    <div className="print-reset flex h-screen overflow-hidden bg-cream">
      {/* Sidebar desktop */}
      <aside
        className={`print-hidden hidden shrink-0 transition-[width] duration-300 ease-in-out lg:block ${
          collapsed ? "w-[84px]" : "w-[272px]"
        }`}
      >
        <Sidebar
          currentView={currentView}
          onNavigate={navigate}
          collapsed={collapsed}
        />
      </aside>

      {/* Drawer mobile */}
      {mobileOpen && (
        <div className="print-hidden fixed inset-0 z-[60] lg:hidden">
          <div
            className="animate-fade-in absolute inset-0 bg-stone-950/55 backdrop-blur-[2px]"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[280px] shadow-2xl">
            <Sidebar currentView={currentView} onNavigate={navigate} />
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Tutup menu"
              className="absolute top-5 -right-12 flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-white/10 text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-white/20"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      <div className="print-reset flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="print-hidden z-30 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-stone-200/70 bg-white/80 px-4 backdrop-blur-md sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Buka menu navigasi"
              className="cursor-pointer rounded-xl p-2 text-stone-500 transition hover:bg-stone-100 hover:text-stone-800 lg:hidden"
            >
              <Menu size={19} />
            </button>
            <button
              onClick={() => setCollapsed((v) => !v)}
              aria-label={collapsed ? "Bentangkan sidebar" : "Ciutkan sidebar"}
              title={collapsed ? "Bentangkan sidebar" : "Ciutkan sidebar"}
              className="hidden cursor-pointer rounded-xl p-2 text-stone-500 transition hover:bg-stone-100 hover:text-stone-800 lg:block"
            >
              {collapsed ? <PanelLeftOpen size={19} /> : <PanelLeftClose size={19} />}
            </button>
            <div className="min-w-0">
              <h2 className="font-display truncate text-lg font-semibold tracking-tight text-stone-900">
                {VIEW_LABELS[currentView]}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {today && (
              <div className="hidden items-center gap-2 rounded-full bg-stone-50 px-3.5 py-1.5 text-xs font-medium text-stone-500 ring-1 ring-stone-200/80 md:flex">
                <Calendar size={14} className="text-gold-700" />
                <span>{today}</span>
              </div>
            )}

            {/* Menu pengguna */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={userMenuOpen}
                className="flex cursor-pointer items-center gap-2.5 rounded-full bg-white py-1.5 pr-2.5 pl-1.5 ring-1 ring-stone-200 transition hover:ring-stone-300"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-stone-800 to-stone-950 text-white">
                  <User size={15} />
                </span>
                <span className="hidden text-sm font-semibold text-stone-700 sm:block">
                  Administrator
                </span>
                <ChevronDown
                  size={15}
                  className={`text-stone-500 transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
                />
              </button>
              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div
                    role="menu"
                    className="animate-scale-in absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl bg-white py-1.5 shadow-[0_16px_44px_-12px_rgba(28,25,23,0.25)] ring-1 ring-stone-900/[0.07]"
                  >
                    <div className="border-b border-stone-100 px-4 py-3">
                      <p className="text-sm font-semibold text-stone-800">Administrator</p>
                      <p className="text-xs text-stone-500">admin@tomatterbaik.id</p>
                    </div>
                    <button
                      role="menuitem"
                      onClick={() => navigate("laporan")}
                      className="flex w-full cursor-pointer items-center gap-2.5 px-4 py-2.5 text-sm text-stone-600 transition hover:bg-stone-50 hover:text-stone-900"
                    >
                      <FileText size={15} /> Laporan
                    </button>
                    <button
                      role="menuitem"
                      onClick={() => navigate("pengaturan")}
                      className="flex w-full cursor-pointer items-center gap-2.5 px-4 py-2.5 text-sm text-stone-600 transition hover:bg-stone-50 hover:text-stone-900"
                    >
                      <Settings size={15} /> Pengaturan
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Konten */}
        <main className="print-reset flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div key={currentView} className="animate-fade-up mx-auto max-w-[1400px]">
            {currentView === "dashboard" && (
              <DashboardView
                tomatList={tomatList}
                kriteriaList={kriteriaList}
                onNavigate={navigate}
              />
            )}
            {currentView === "dataTomat" && (
              <DataTomatView
                tomatList={tomatList}
                kriteriaList={kriteriaList}
                updateTomat={setTomatEdits}
                rowsPerPage={rowsPerPage}
              />
            )}
            {currentView === "kriteria" && (
              <KriteriaView
                kriteriaList={kriteriaList}
                updateKriteria={setKriteriaEdits}
              />
            )}
            {currentView === "penilaian" && (
              <PenilaianView
                tomatList={tomatList}
                kriteriaList={kriteriaList}
                updateTomat={setTomatEdits}
                rowsPerPage={rowsPerPage}
              />
            )}
            {currentView === "galeri" && <GaleriTomatView />}
            {currentView === "importJson" && (
              <ImportJsonView
                tomatList={tomatList}
                updateTomat={setTomatEdits}
                onNavigate={navigate}
              />
            )}
            {currentView === "perhitunganSaw" && (
              <PerhitunganSAWView
                tomatList={tomatList}
                kriteriaList={kriteriaList}
              />
            )}
            {currentView === "hasilRanking" && (
              <HasilRankingView
                tomatList={tomatList}
                kriteriaList={kriteriaList}
              />
            )}
            {currentView === "laporan" && (
              <LaporanView tomatList={tomatList} kriteriaList={kriteriaList} />
            )}
            {currentView === "pengaturan" && (
              <PengaturanView
                tomatList={tomatList}
                kriteriaList={kriteriaList}
                updateTomat={setTomatEdits}
                updateKriteria={setKriteriaEdits}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsEdit}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <ToastProvider>
      <ConfirmProvider>
        <AppShell />
      </ConfirmProvider>
    </ToastProvider>
  );
}
