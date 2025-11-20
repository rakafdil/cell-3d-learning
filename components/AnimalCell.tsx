"use client";
import ModelViewer from "./ModelViewer";

// Kita buat array yang berisi path file, nama untuk deteksi, dan deskripsi
const cellModels = [
  {
    fileName: "Nucleus.glb",
    name: "Nucleus",
    description: "Inti sel yang mengandung materi genetik...",
    imagePath: "/img/animal_nucleous.png", // <--- Tambahkan ini!
  },
  {
    fileName: "Mitochondria.glb",
    name: "Mitochondria",
    description: "Mitokondria: Tempat produksi energi (ATP).",
  },
  {
    fileName: "Golgi Apparatus.glb",
    name: "Golgi Apparatus",
    description: "Badan Golgi: Memproses dan mengemas protein.",
  },
  {
    fileName: "Rough Endoplasmic Reticulum.glb",
    name: "Rough ER",
    description:
      "Retikulum Endoplasma Kasar: Tempat sintesis protein (ada ribosom).",
  },
  {
    fileName: "Smooth Endoplasmic Reticulum.glb",
    name: "Smooth ER",
    description:
      "Retikulum Endoplasma Halus: Sintesis lipid dan detoksifikasi.",
  },
  // File "kuning-kuning.glb" mungkin lisosom atau sentriol, sesuaikan namanya
  {
    fileName: "kuning-kuning.glb",
    name: "Lysosome",
    description: "Lisosom: Mencerna bagian sel yang rusak atau zat asing.",
  },
  // Bagian wadah/cairan biasanya tidak perlu interaktif, tapi tetap diload visualnya
  {
    fileName: "airnya.glb",
    name: "Cytoplasm",
    description: "Sitoplasma: Cairan tempat organel berada.",
  },
  {
    fileName: "wadahnya.glb",
    name: "Membrane",
    description: "Membran Sel: Pelindung luar sel.",
  },
];

export default function AnimalCell() {
  // Base path folder kamu di public
  const basePath = "/models/animal/";

  return <ModelViewer basePath={basePath} models={cellModels} />;
}
