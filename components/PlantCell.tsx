"use client";
import { useState } from "react";
import ModelViewer, { PartInfo } from "./ModelViewer";
import DetailViewer from "./DetailViewer";

const organels: PartInfo[] = [
  {
    id: "nucleus",
    name: "Nukleus",
    description:
      "Inti sel yang mengandung materi genetik (DNA) dan mengontrol seluruh aktivitas sel.",
    detailModelPath: "/models/plant/nucleus.glb",
  },
  {
    id: "mitochondria",
    name: "Mitokondria",
    description:
      "Pembangkit tenaga sel. Tempat respirasi seluler untuk menghasilkan energi (ATP).",
    detailModelPath: "/models/plant/mitochondria.glb",
  },
  {
    id: "golgi_apparatus",
    name: "Badan Golgi",
    description:
      "Tempat memodifikasi, menyortir, dan mengemas protein dan lipid dari RE untuk dikirim ke tempat lain.",
    detailModelPath: "/models/plant/golgi_apparatus.glb",
  },
  {
    id: "rer",
    name: "Retikulum Endoplasma Kasar (REK)",
    description:
      "Jalur transportasi yang ditempeli ribosom (bintik merah). Berfungsi untuk sintesis protein.",
    detailModelPath: "/models/plant/rer.glb",
  },
  {
    id: "ser",
    name: "Retikulum Endoplasma Halus(REH)",
    description:
      "Tidak memiliki ribosom. Berfungsi untuk sintesis lipid (lemak), metabolisme karbohidrat, dan detoksifikasi.",
    detailModelPath: "/models/plant/ser.glb",
  },
  {
    id: "centrosome",
    name: "Sentriol / Sentrosom",
    description:
      "Berperan penting dalam proses pembelahan sel dengan membentuk benang spindel.",
    detailModelPath: "/models/plant/centrosome.glb",
  },
  {
    id: "cytoplasm",
    name: "Sitoplasma",
    description:
      "Cairan seperti jeli yang mengisi bagian dalam sel dan mengelilingi organel.",
    detailModelPath: "/models/plant/cytoplasm.glb",
  },
  {
    id: "cell_wall",
    name: "Dinding Sel",
    description:
      "Lapisan pelindung kaku yang melindungi sel tumbuhan dan mempertahankan struktur sel",
    detailModelPath: "/models/plant/cell_wall.glb",
  },
  {
    id: "vacuole",
    name: "Vakuola",
    description:
      "Organel besar berisi cairan yang menyimpan air, nutrisi, dan limbah. Pada sel tumbuhan, vakuola sangat besar dan membantu menjaga tekanan turgor sel.",
    detailModelPath: "/models/plant/vacuole.glb",
  },
  {
    id: "chloroplast",
    name: "Kloroplas",
    description:
      "Organel yang mengandung klorofil untuk proses fotosintesis. Mengubah energi cahaya menjadi energi kimia (glukosa).",
    detailModelPath: "/models/plant/chloroplast.glb",
  },
];

export default function PlantCell() {
  const modelPath = "/models/plant/plant_cell.glb";
    const [detailPart, setDetailPart] = useState<PartInfo | null>(null);
  
    return (
      <>
        <ModelViewer
          modelPath={modelPath}
          modelsData={organels}
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
