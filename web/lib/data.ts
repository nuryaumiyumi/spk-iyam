import { Tomat } from "./types";

// Nama varietas tomat yang umum dibudidayakan di Indonesia.
const VARIETAS = [
  "Servo F1",
  "Betavila F1",
  "Tymoti F1",
  "Sakura F1",
  "Gustavi F1",
  "Palupi",
  "Ratna",
  "Intan",
  "Mirah",
  "Zamrud",
];

const BLOK = ["A", "B", "C", "D", "E"];

/**
 * Data contoh deterministik (tanpa Math.random) agar hasil render
 * server dan client selalu identik — menghindari hydration mismatch.
 */
export function generateSampleTomat(): Tomat[] {
  const data: Tomat[] = [];
  for (let i = 1; i <= 50; i++) {
    const varietas = VARIETAS[(i - 1) % VARIETAS.length];
    const blok = BLOK[Math.floor((i - 1) / VARIETAS.length)];
    data.push({
      id: i,
      kode: `T${String(i).padStart(3, "0")}`,
      nama: `${varietas} · Blok ${blok}`,
      berat: 150 + ((i * 17 + 5) % 61),
      warna: 3 + (i % 3),
      kesegaran: 6 + (i % 5),
      cacat: 1 + ((i * 3 + 2) % 10),
    });
  }
  // Beberapa sampel unggulan agar hasil ranking bermakna.
  data[4] = { ...data[4], berat: 205, warna: 5, kesegaran: 10, cacat: 1 };
  data[0] = { ...data[0], berat: 190, warna: 5, kesegaran: 9, cacat: 2 };
  data[11] = { ...data[11], berat: 198, warna: 5, kesegaran: 9, cacat: 3 };
  data[27] = { ...data[27], berat: 186, warna: 4, kesegaran: 9, cacat: 2 };
  data[40] = { ...data[40], berat: 201, warna: 5, kesegaran: 8, cacat: 4 };
  return data;
}
