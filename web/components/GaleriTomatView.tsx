"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";

// Data varietas tomat dengan gambar placeholder (ganti dengan URL asli jika ada)
const tomatoVarieties = [
  {
    id: 1,
    name: "Tomat Beefsteak",
    latinName: "Solanum lycopersicum",
    description: "Ukuran besar, daging tebal, cocok untuk sandwich, burger, dan salad.",
    karakteristik: "Berat 200-500 gram, warna merah terang, rasa manih",
    imageUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    name: "Tomat Cherry",
    latinName: "Solanum lycopersicum var. cerasiforme",
    description: "Buah kecil, manis, cocok untuk salad, lalapan, atau camilan sehat.",
    karakteristik: "Diameter 2-3 cm, merah terang, rasa manis sedikit asam",
    imageUrl: "https://images.unsplash.com/photo-1546470427-1c3b6c7f4c6f?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    name: "Tomat Roma",
    latinName: "Solanum lycopersicum 'Roma'",
    description: "Berbiji sedikit, daging padat, ideal untuk saus pasta dan jus.",
    karakteristik: "Bentuk lonjong, merah tua, daging tebal",
    imageUrl: "https://images.unsplash.com/photo-1561137867-ef81b3b2a5b8?w=400&h=300&fit=crop",
  },
  {
    id: 4,
    name: "Tomat Plum",
    latinName: "Solanum lycopersicum 'Plum'",
    description: "Mirip Roma, biasa untuk saus, pasta, dan tomat kalengan.",
    karakteristik: "Bentuk oval, daging padat, sedikit biji",
    imageUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop",
  },
  {
    id: 5,
    name: "Tomat Hijau",
    latinName: "Solanum lycopersicum 'Green Zebra'",
    description: "Rasa asam segar, sering digoreng atau untuk salsa hijau.",
    karakteristik: "Warna hijau bergaris, rasa asam",
    imageUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop",
  },
  {
    id: 6,
    name: "Tomat Hitam",
    latinName: "Solanum lycopersicum 'Black Krim'",
    description: "Warna gelap keunguan, rasa smoky dan manis, cocok untuk salad premium.",
    karakteristik: "Warna ungu kehitaman, rasa kompleks",
    imageUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop",
  },
];

export default function GaleriTomatView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVariety, setSelectedVariety] = useState<typeof tomatoVarieties[0] | null>(null);

  const filteredVarieties = tomatoVarieties.filter((v) =>
    v.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header dengan search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">🍅 Galeri Jenis Tomat</h2>
          <p className="text-gray-500 text-sm mt-1">Kenali berbagai varietas tomat berkualitas</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Cari jenis tomat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>
      </div>

      {/* Grid Galeri */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVarieties.map((variety) => (
          <div
            key={variety.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer border border-gray-100"
            onClick={() => setSelectedVariety(variety)}
          >
            <div className="relative h-48 overflow-hidden bg-red-50">
              <img
                src={variety.imageUrl}
                alt={variety.name}
                className="w-full h-full object-cover hover:scale-105 transition duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://placehold.co/400x300?text=Gambar+Tomat";
                }}
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-800">{variety.name}</h3>
              <p className="text-gray-500 text-xs italic">{variety.latinName}</p>
              <p className="text-gray-600 text-sm mt-2 line-clamp-2">{variety.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">🍽️ {variety.karakteristik.split(",")[0]}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredVarieties.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Tidak ditemukan jenis tomat dengan kata "{searchTerm}"
        </div>
      )}

      {/* Modal Detail */}
      {selectedVariety && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <button
                onClick={() => setSelectedVariety(null)}
                className="absolute top-4 right-4 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 z-10"
              >
                <X size={20} />
              </button>
              <img
                src={selectedVariety.imageUrl}
                alt={selectedVariety.name}
                className="w-full h-64 object-cover rounded-t-xl"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://placehold.co/800x400?text=Gambar+Tomat";
                }}
              />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-800">{selectedVariety.name}</h3>
              <p className="text-gray-500 italic">{selectedVariety.latinName}</p>
              <p className="mt-4 text-gray-700">{selectedVariety.description}</p>
              <div className="mt-4 bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold text-red-800">📋 Karakteristik</h4>
                <p className="text-gray-700 text-sm mt-1">{selectedVariety.karakteristik}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-400 text-center border-t pt-4">
        💡 Gambar menggunakan placeholder. Ganti dengan gambar asli di folder <code className="bg-gray-100 px-1 rounded">public/images/tomatoes/</code>
      </p>
    </div>
  );
}