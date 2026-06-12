import { Tomat, Kriteria } from "@/app/page";

export function hitungNormalisasi(tomatList: Tomat[], kriteriaList: Kriteria[]) {
  // Cari max/min per kriteria
  const maxValues: Record<string, number> = {};
  const minValues: Record<string, number> = {};
  kriteriaList.forEach((k) => {
    const allNilai = tomatList.map((t) => {
      switch (k.id) {
        case "berat": return t.berat;
        case "warna": return t.warna;
        case "kesegaran": return t.kesegaran;
        case "cacat": return t.cacat;
        default: return 0;
      }
    });
    maxValues[k.id] = Math.max(...allNilai);
    minValues[k.id] = Math.min(...allNilai);
  });

  const normalizedMatrix = tomatList.map((tomat) => {
    const normalized = kriteriaList.map((k) => {
      let nilai = 0;
      switch (k.id) {
        case "berat": nilai = tomat.berat; break;
        case "warna": nilai = tomat.warna; break;
        case "kesegaran": nilai = tomat.kesegaran; break;
        case "cacat": nilai = tomat.cacat; break;
      }
      if (k.tipe === "benefit") {
        return nilai / maxValues[k.id];
      } else {
        return minValues[k.id] / nilai;
      }
    });
    return { tomatId: tomat.id, normalized };
  });

  return { normalizedMatrix, maxValues, minValues };
}

export function hitungSAW(tomatList: Tomat[], kriteriaList: Kriteria[]) {
  const { normalizedMatrix } = hitungNormalisasi(tomatList, kriteriaList);
  const hasil = normalizedMatrix.map((item, idx) => {
    const tomat = tomatList.find((t) => t.id === item.tomatId)!;
    let total = 0;
    item.normalized.forEach((norm, i) => {
      total += norm * kriteriaList[i].bobot;
    });
    return { tomat, nilai: total };
  });
  return hasil.sort((a, b) => b.nilai - a.nilai);
}