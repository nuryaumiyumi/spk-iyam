import { getNilaiKriteria, Kriteria, Tomat } from "./types";

export type HasilNormalisasi = {
  normalizedMatrix: { tomatId: number; normalized: number[] }[];
  maxValues: Record<string, number>;
  minValues: Record<string, number>;
};

export type HasilRanking = {
  tomat: Tomat;
  nilai: number;
  rank: number;
};

/**
 * Normalisasi matriks keputusan (R).
 * Benefit: Rij = Xij / max(Xj) — Cost: Rij = min(Xj) / Xij.
 * Pembagian nol dijaga: max = 0 menghasilkan 0, dan Xij = 0 pada kriteria
 * cost berarti nilai terbaik (min pasti 0 juga) sehingga Rij = 1.
 */
export function hitungNormalisasi(
  tomatList: Tomat[],
  kriteriaList: Kriteria[]
): HasilNormalisasi {
  const maxValues: Record<string, number> = {};
  const minValues: Record<string, number> = {};

  kriteriaList.forEach((k) => {
    const semuaNilai = tomatList.map((t) => getNilaiKriteria(t, k.id));
    maxValues[k.id] = semuaNilai.length ? Math.max(...semuaNilai) : 0;
    minValues[k.id] = semuaNilai.length ? Math.min(...semuaNilai) : 0;
  });

  const normalizedMatrix = tomatList.map((tomat) => {
    const normalized = kriteriaList.map((k) => {
      const nilai = getNilaiKriteria(tomat, k.id);
      if (k.tipe === "benefit") {
        return maxValues[k.id] > 0 ? nilai / maxValues[k.id] : 0;
      }
      if (nilai <= 0) return 1;
      return minValues[k.id] / nilai;
    });
    return { tomatId: tomat.id, normalized };
  });

  return { normalizedMatrix, maxValues, minValues };
}

/** Total bobot seluruh kriteria. */
export function totalBobot(kriteriaList: Kriteria[]): number {
  return kriteriaList.reduce((sum, k) => sum + k.bobot, 0);
}

/** Apakah total bobot sudah (mendekati) 1. */
export function bobotValid(kriteriaList: Kriteria[]): boolean {
  return Math.abs(totalBobot(kriteriaList) - 1) < 0.001;
}

/**
 * Nilai preferensi V = Σ(Rij × Wj), diurutkan menurun.
 * Bobot dinormalisasi terhadap totalnya agar hasil tetap proporsional
 * meskipun pengguna belum membuat total bobot tepat 1.
 */
export function hitungSAW(
  tomatList: Tomat[],
  kriteriaList: Kriteria[]
): HasilRanking[] {
  const { normalizedMatrix } = hitungNormalisasi(tomatList, kriteriaList);
  const total = totalBobot(kriteriaList);
  const bobotEfektif = kriteriaList.map((k) =>
    total > 0 ? k.bobot / total : 1 / Math.max(kriteriaList.length, 1)
  );

  const tomatById = new Map(tomatList.map((t) => [t.id, t]));
  const hasil = normalizedMatrix.map((item) => {
    const tomat = tomatById.get(item.tomatId)!;
    const nilai = item.normalized.reduce(
      (sum, r, i) => sum + r * bobotEfektif[i],
      0
    );
    return { tomat, nilai };
  });

  return hasil
    .sort((a, b) => b.nilai - a.nilai || a.tomat.kode.localeCompare(b.tomat.kode))
    .map((item, idx) => ({ ...item, rank: idx + 1 }));
}
