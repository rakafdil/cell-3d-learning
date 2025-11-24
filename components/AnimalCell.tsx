// AnimalCell.tsx
"use client";
import ModelViewer, { PartInfo } from "./ModelViewer";
import DetailViewer from "./DetailViewer";
import { useState } from "react";

const cellModels: PartInfo[] = [
  {
    id: "nukleus",
    name: "Nukleus",
    description:
      "Inti sel yang mengandung materi genetik (DNA) dan mengontrol seluruh aktivitas sel.",
    imagePath: "/img/animal_nucleous.png",
  },
  {
    id: "mitokondria",
    name: "Mitokondria",
    description:
      "Pembangkit tenaga sel. Tempat respirasi seluler untuk menghasilkan energi (ATP).",
    imagePath: "/img/animal_mitochondria.png",
    detailModelPath: "/models/mitochondria.glb",
  },
  {
    id: "badan golgi",
    name: "Badan Golgi",
    description:
      "Tempat memodifikasi, menyortir, dan mengemas protein dan lipid dari RE untuk dikirim ke tempat lain.",
    imagePath: "/img/animal_golgi.png",
  },
  {
    id: "re kasar",
    name: "Retikulum Endoplasma Kasar (REK)",
    description:
      "Jalur transportasi yang ditempeli ribosom (bintik merah). Berfungsi untuk sintesis protein.",
    imagePath: "/img/animal_rer.png",
  },
  {
    id: "ser",
    name: "Retikulum Endoplasma Halus (REH)",
    description:
      "Tidak memiliki ribosom. Berfungsi untuk sintesis lipid (lemak), metabolisme karbohidrat, dan detoksifikasi.",
    imagePath: "/img/animal_ser.png",
  },
  {
    id: "lisosom",
    name: "Lisosom",
    description:
      "Sistem pencernaan sel. Berisi enzim untuk memecah limbah, bakteri, atau bagian sel yang rusak.",
    imagePath: "/img/animal_lysosome.png",
  },
  {
    id: "sentriol",
    name: "Sentriol / Sentrosom",
    description:
      "Berperan penting dalam proses pembelahan sel dengan membentuk benang spindel.",
    imagePath: "/img/animal_centriole.png",
  },
  {
    id: "wadah",
    name: "Sitoplasma",
    description:
      "Cairan seperti jeli yang mengisi bagian dalam sel dan mengelilingi organel.",
    imagePath: "/img/animal_cytoplasm.png",
  },
  {
    id: "membran",
    name: "Membran Sel",
    description:
      "Lapisan pelindung terluar yang mengatur keluar masuknya zat dari dan ke dalam sel.",
    imagePath: "/img/animal_membrane.png",
  },
];

export default function AnimalCell() {
  const modelPath = "/models/animal/animal_renamed.glb";
  const [detailPart, setDetailPart] = useState<PartInfo | null>(null);

  return (
    <>
      <ModelViewer
        modelPath={modelPath}
        modelsData={cellModels}
        onViewDetail={(part) => setDetailPart(part)}
      />

      {detailPart && detailPart.detailModelPath && (
        <DetailViewer
          modelPath={detailPart.detailModelPath}
          onClose={() => setDetailPart(null)}
        />
      )}
    </>
  );
}
