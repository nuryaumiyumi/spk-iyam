"use client";

import { useState } from "react";
import { Leaf, Ruler, Search, UtensilsCrossed } from "lucide-react";
import { ui } from "@/lib/ui";
import Modal from "./Modal";
import TomatIllustration, { TomatPalette } from "./TomatIllustration";

type Varietas = {
  id: number;
  name: string;
  latinName: string;
  description: string;
  karakteristik: string;
  penggunaan: string;
  palette: TomatPalette;
  surface: string;
};

const VARIETAS_TOMAT: Varietas[] = [
  {
    id: 1,
    name: "Tomat Beefsteak",
    latinName: "Solanum lycopersicum",
    description:
      "Berukuran besar dengan daging tebal dan kandungan air rendah — pilihan utama untuk sandwich, burger, dan hidangan panggang premium.",
    karakteristik: "Berat 200–500 gram · warna merah terang · rasa manis penuh",
    penggunaan: "Sandwich, burger, salad potong",
    palette: { from: "#EA6A52", to: "#9F1239", leaf: "#3F6B35" },
    surface: "from-rose-100 via-rose-50 to-white",
  },
  {
    id: 2,
    name: "Tomat Cherry",
    latinName: "Solanum lycopersicum var. cerasiforme",
    description:
      "Buah mungil dengan rasa manis segar dan tekstur renyah, sering disajikan utuh sebagai camilan sehat atau penghias hidangan.",
    karakteristik: "Diameter 2–3 cm · merah cerah · manis sedikit asam",
    penggunaan: "Salad, lalapan, camilan",
    palette: { from: "#F87171", to: "#B91C1C", leaf: "#4D7C3A" },
    surface: "from-red-100 via-red-50 to-white",
  },
  {
    id: 3,
    name: "Tomat Roma",
    latinName: "Solanum lycopersicum 'Roma'",
    description:
      "Berbentuk lonjong dengan biji sedikit dan daging padat, menjadikannya standar industri untuk saus pasta dan jus tomat.",
    karakteristik: "Bentuk lonjong · merah tua · daging tebal",
    penggunaan: "Saus pasta, jus, pasta kalengan",
    palette: { from: "#E25822", to: "#9A3412", leaf: "#3F6B35" },
    surface: "from-orange-100 via-orange-50 to-white",
  },
  {
    id: 4,
    name: "Tomat Plum",
    latinName: "Solanum lycopersicum 'Plum'",
    description:
      "Kerabat dekat Roma dengan bentuk oval simetris, kadar gula seimbang, dan hasil olahan saus yang halus serta pekat.",
    karakteristik: "Bentuk oval · daging padat · sedikit biji",
    penggunaan: "Saus, sup, tomat kalengan",
    palette: { from: "#DC5B45", to: "#7F1D1D", leaf: "#456B3B" },
    surface: "from-rose-100 via-orange-50 to-white",
  },
  {
    id: 5,
    name: "Tomat Green Zebra",
    latinName: "Solanum lycopersicum 'Green Zebra'",
    description:
      "Varietas heirloom bercorak garis hijau keemasan dengan rasa asam segar yang khas — favorit koki untuk salsa dan hidangan goreng.",
    karakteristik: "Hijau bergaris emas · rasa asam segar",
    penggunaan: "Salsa hijau, fried green tomato",
    palette: { from: "#A3C76D", to: "#3F6212", leaf: "#2D4A22" },
    surface: "from-lime-100 via-lime-50 to-white",
  },
  {
    id: 6,
    name: "Tomat Black Krim",
    latinName: "Solanum lycopersicum 'Black Krim'",
    description:
      "Varietas premium berwarna merah kehitaman dengan cita rasa smoky kompleks — kerap hadir di salad fine dining.",
    karakteristik: "Ungu kehitaman · rasa smoky manis",
    penggunaan: "Salad premium, caprese",
    palette: { from: "#8E4A52", to: "#3B1722", leaf: "#3A5232" },
    surface: "from-stone-200 via-stone-100 to-white",
  },
];

export default function GaleriTomatView() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Varietas | null>(null);

  const filtered = VARIETAS_TOMAT.filter((v) =>
    v.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Kepala halaman */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className={ui.sectionTitle}>Galeri Varietas Tomat</h2>
          <p className="mt-0.5 text-xs text-stone-500">
            Kenali karakter varietas unggulan sebagai referensi penilaian
          </p>
        </div>
        <div className="relative w-full sm:w-auto">
          <Search
            size={15}
            className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-stone-500"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari varietas…"
            aria-label="Cari varietas tomat"
            className={`${ui.input} w-full pl-9 sm:w-64`}
          />
        </div>
      </div>

      {/* Grid kartu */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((variety) => (
          <button
            key={variety.id}
            onClick={() => setSelected(variety)}
            className={`${ui.card} group cursor-pointer overflow-hidden text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_-16px_rgba(28,25,23,0.22)]`}
          >
            <div
              className={`relative flex h-44 items-center justify-center bg-gradient-to-br ${variety.surface}`}
            >
              <TomatIllustration
                palette={variety.palette}
                className="h-32 w-32 drop-shadow-[0_14px_18px_rgba(28,25,23,0.18)] transition-transform duration-500 group-hover:scale-110"
              />
              <span className="absolute top-3.5 right-3.5 rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-bold tracking-wider text-stone-500 uppercase ring-1 ring-stone-900/5 backdrop-blur">
                Varietas
              </span>
            </div>
            <div className="p-5">
              <h3 className="font-display text-lg font-semibold tracking-tight text-stone-900">
                {variety.name}
              </h3>
              <p className="text-xs text-stone-500 italic">{variety.latinName}</p>
              <p className="mt-2.5 line-clamp-2 text-[13px] leading-relaxed text-stone-500">
                {variety.description}
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-[11px] font-semibold text-gold-700">
                <UtensilsCrossed size={12} />
                {variety.penggunaan}
              </div>
            </div>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className={`${ui.card} px-6 py-16 text-center`}>
          <p className="text-sm font-semibold text-stone-600">
            Varietas tidak ditemukan
          </p>
          <p className="mt-1 text-xs text-stone-500">
            Tidak ada varietas yang cocok dengan kata kunci &ldquo;{search}&rdquo;.
          </p>
        </div>
      )}

      {/* Modal detail */}
      <Modal
        isOpen={selected !== null}
        onClose={() => setSelected(null)}
        title={selected?.name ?? ""}
        subtitle={selected?.latinName}
        size="lg"
      >
        {selected && (
          <div className="space-y-5">
            <div
              className={`flex h-52 items-center justify-center rounded-2xl bg-gradient-to-br ${selected.surface} ring-1 ring-stone-900/5`}
            >
              <TomatIllustration
                palette={selected.palette}
                className="h-40 w-40 drop-shadow-[0_18px_22px_rgba(28,25,23,0.2)]"
              />
            </div>
            <p className="text-sm leading-relaxed text-stone-600">
              {selected.description}
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-stone-100">
                <div className="flex items-center gap-2 text-stone-700">
                  <Ruler size={15} className="text-gold-700" />
                  <p className="text-xs font-bold tracking-wider uppercase">
                    Karakteristik
                  </p>
                </div>
                <p className="mt-2 text-[13px] leading-relaxed text-stone-500">
                  {selected.karakteristik}
                </p>
              </div>
              <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-stone-100">
                <div className="flex items-center gap-2 text-stone-700">
                  <Leaf size={15} className="text-emerald-600" />
                  <p className="text-xs font-bold tracking-wider uppercase">
                    Penggunaan Ideal
                  </p>
                </div>
                <p className="mt-2 text-[13px] leading-relaxed text-stone-500">
                  {selected.penggunaan}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
