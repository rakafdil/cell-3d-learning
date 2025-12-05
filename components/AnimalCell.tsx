"use client";
import ModelViewer, { PartInfo } from "./ModelViewer";
import DetailViewer from "./DetailViewer";
import { useState } from "react";

const cellModels: PartInfo[] = [
  {
    id: "nukleus",
    name: "Nukleus",
    description:
      "Nukleus berbentuk bulat/oval dan berada di tengah sel. Di dalamnya terdapat nukleolus dan kromosom yang membawa DNA atau RNA. Nukleus diselubungi membran rangkap dan berfungsi sebagai pusat pengatur seluruh kegiatan sel.",
    imagePath: "/img/animal_nucleous.png",
  },
  {
    id: "mitokondria",
    name: "Mitokondria",
    description:
      "Mitokondria memiliki membran luar dan dalam yang berlekuk membentuk krista. Di dalamnya berlangsung respirasi menghasilkan energi, sehingga disebut ‘power house’ sel.",
    imagePath: "/img/animal_mitochondria.png",
    detailModelPath: "/models/mitochondria.glb",
  },
  {
    id: "badan golgi",
    name: "Badan Golgi",
    description:
      "Badan Golgi terdiri dari kantong dan gelembung kecil bertumpuk. Berfungsi memproses, mengemas, dan mengirim protein serta lendir. Pada tumbuhan disebut diktiosom.",
    imagePath: "/img/animal_golgi.png",
  },
  {
    id: "re kasar",
    name: "Retikulum Endoplasma Kasar (REK)",
    description:
      "Retikulum endoplasma yaitu struktur benang-benang yang bermuara di inti sel.Retikulum endoplasma kasar disebut demikian karena permukaannya ditempeli banyak ribosom. Ribosom yang mulai mensintesis protein dengan tempat tujuan tertentu, seperti organel tertentu atau membran, akan menempel pada retikulum endoplasma kasar. Berfungsi untuk sintesis dan penyaluran protein.",
    imagePath: "/img/animal_rer.png",
  },
  {
    id: "ser",
    name: "Retikulum Endoplasma Halus (REH)",
    description:
      "Retikulum endoplasma yaitu struktur benang-benang yang bermuara di inti sel. Retikulum Endoplasma Halus tidak memiliki ribosom. Berfungsi mensintesis lipid, kolesterol, dan melakukan detoksifikasi.",
    imagePath: "/img/animal_ser.png",
  },
  {
    id: "lisosom",
    name: "Lisosom",
    description:
      "Lisosom adalah kantong bermembran tunggal yang mengandung enzim pencernaan. Berfungsi mencerna bagian sel yang rusak atau zat asing yang masuk ke dalam sel.",
    imagePath: "/img/animal_lysosome.png",
  },
  {
    id: "sentriol",
    name: "Sentriol / Sentrosom",
    description:
      "Sentriol adalah organel silinder kecil yang biasanya berpasangan (sentrosom) dan berperan penting dalam pembelahan sel dengan membentuk benang spindel, menentukan arah pembelahan, serta membantu pembentukan silia dan flagela.",
    imagePath: "/img/animal_centriole.png",
  },
  {
    id: "wadah",
    name: "Sitoplasma",
    description:
      "Sitoplasma adalah cairan tempat semua organel berada. Mengandung air, mineral, protein, dan berbagai senyawa lain untuk menunjang proses metabolisme sel.",
    imagePath: "/img/animal_cytoplasm.png",
  },
  {
    id: "membran",
    name: "Membran Sel",
    description:
      "Membran sel atau membran plasma bersifat semipermeabel, sehingga hanya zat tertentu yang dapat melewatinya. Berfungsi melindungi sel serta mengatur keluar masuknya zat.",
    imagePath: "/img/animal_cytoplasm.png",
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
