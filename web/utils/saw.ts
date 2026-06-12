// app/utils/saw.ts

export interface Tomat {
  id: number;
  kode: string;
  nama: string;
  berat: number;
  warna: number;
  kesegaran: number;
  cacat: number;
  [key: string]: any;
}

export interface Kriteria {
  id: string;
  nama: string;
  tipe: string; // 'benefit' | 'cost'
  bobot: number;
}

export function calculateSAW(tomats: Tomat[], kriterias: Kriteria[]) {
  if (tomats.length === 0) return { normalisasi: [], ranking: [] };

  // 1. Cari nilai Max dan Min untuk setiap kriteria
  const maxMin: Record<string, number> = {};
  kriterias.forEach((k) => {
    const key = k.id === "C1" ? "berat" : k.id === "C2" ? "warna" : k.id === "C3" ? "kesegaran" : "cacat";
    const values = tomats.map(t => Number(t[key]));
    maxMin[k.id] = k.tipe === "benefit" ? Math.max(...values) : Math.min(...values);
  });

  // 2. Proses Normalisasi (Matriks R) & Perhitungan Skor Preferensi (V)
  const totalBobot = kriterias.reduce((sum, k) => sum + k.bobot, 0) || 100;
  
  const normalisasi = tomats.map((t) => {
    const r_c1 = maxMin["C1"] ? t.berat / maxMin["C1"] : 0;
    const r_c2 = maxMin["C2"] ? t.warna / maxMin["C2"] : 0;
    const r_c3 = maxMin["C3"] ? t.kesegaran / maxMin["C3"] : 0;
    const r_c4 = t.cacat ? maxMin["C4"] / t.cacat : 0;

    const w1 = kriterias[0].bobot / totalBobot;
    const w2 = kriterias[1].bobot / totalBobot;
    const w3 = kriterias[2].bobot / totalBobot;
    const w4 = kriterias[3].bobot / totalBobot;

    const skorAkhir = (r_c1 * w1) + (r_c2 * w2) + (r_c3 * w3) + (r_c4 * w4);

    return {
      id: t.id,
      kode: t.kode,
      nama: t.nama,
      c1: r_c1,
      c2: r_c2,
      c3: r_c3,
      c4: r_c4,
      skor: skorAkhir
    };
  });

  // 3. Perankingan berdasarkan skor tertinggi
  const ranking = [...normalisasi]
    .sort((a, b) => b.skor - a.skor)
    .map((item, index) => ({
      ...item,
      rank: index + 1
    }));

  return { normalisasi, ranking };
}

export function generateInitialTomats(): Tomat[] {
  const data = [];
  for (let i = 1; i <= 30; i++) {
    data.push({
      id: i,
      kode: `T${String(i).padStart(3, "0")}`,
      nama: `Tomat Cluster ${i}`,
      berat: 120 + ((i * 13 + 7) % 71),
      warna: 2 + (i % 4),
      kesegaran: 5 + (i % 6),
      cacat: 2 + ((i * 7) % 15)
    });
  }
  data[0] = { ...data[0], berat: 185, warna: 5, kesegaran: 10, cacat: 1 };
  data[1] = { ...data[1], berat: 170, warna: 4, kesegaran: 9, cacat: 3 };
  data[2] = { ...data[2], berat: 195, warna: 5, kesegaran: 8, cacat: 5 };
  return data;
}