export type Tomat = {
  id: number;
  kode: string;
  nama: string;
  berat: number;
  warna: number;
  kesegaran: number;
  cacat: number;
};

export type KriteriaId = "berat" | "warna" | "kesegaran" | "cacat";

export type Kriteria = {
  id: KriteriaId;
  nama: string;
  bobot: number;
  tipe: "benefit" | "cost";
};

export type ViewId =
  | "dashboard"
  | "dataTomat"
  | "kriteria"
  | "penilaian"
  | "galeri"
  | "importJson"
  | "perhitunganSaw"
  | "hasilRanking"
  | "laporan"
  | "pengaturan";

export const VIEW_LABELS: Record<ViewId, string> = {
  dashboard: "Dashboard",
  dataTomat: "Data Tomat",
  kriteria: "Kriteria & Bobot",
  penilaian: "Penilaian",
  galeri: "Galeri Tomat",
  importJson: "Import JSON",
  perhitunganSaw: "Perhitungan SAW",
  hasilRanking: "Hasil Ranking",
  laporan: "Laporan",
  pengaturan: "Pengaturan",
};

// Rentang nilai valid per kriteria — dipakai untuk validasi form & clamping input.
export const KRITERIA_RANGE: Record<KriteriaId, { min: number; max: number; satuan: string }> = {
  berat: { min: 1, max: 1000, satuan: "gram" },
  warna: { min: 1, max: 5, satuan: "skala 1–5" },
  kesegaran: { min: 1, max: 10, satuan: "skala 1–10" },
  cacat: { min: 0, max: 100, satuan: "persen" },
};

export const KRITERIA_DEFAULT: Kriteria[] = [
  { id: "berat", nama: "Berat (g)", bobot: 0.3, tipe: "benefit" },
  { id: "warna", nama: "Warna (1–5)", bobot: 0.2, tipe: "benefit" },
  { id: "kesegaran", nama: "Kesegaran (1–10)", bobot: 0.3, tipe: "benefit" },
  { id: "cacat", nama: "Cacat (%)", bobot: 0.2, tipe: "cost" },
];

export function getNilaiKriteria(tomat: Tomat, id: KriteriaId): number {
  return tomat[id];
}

export function clampNilai(id: KriteriaId, value: number): number {
  const { min, max } = KRITERIA_RANGE[id];
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}
