"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Quiz from "@/../components/Quiz";
import { generateQuiz, QuizQuestion } from "@/../lib/gemini";

const cellModels = [
  "Nukleus berbentuk bulat/oval dan berada di tengah sel. Di dalamnya terdapat nukleolus dan kromosom yang membawa DNA atau RNA. Nukleus diselubungi membran rangkap dan berfungsi sebagai pusat pengatur seluruh kegiatan sel.",
  "Mitokondria memiliki membran luar dan dalam yang berlekuk membentuk krista. Di dalamnya berlangsung respirasi menghasilkan energi, sehingga disebut 'power house' sel.",
  "Badan Golgi terdiri dari kantong dan gelembung kecil bertumpuk. Berfungsi memproses, mengemas, dan mengirim protein serta lendir. Pada tumbuhan disebut diktiosom.",
  "Retikulum endoplasma kasar disebut demikian karena permukaannya ditempeli banyak ribosom. Berfungsi untuk sintesis dan penyaluran protein.",
  "Retikulum Endoplasma Halus tidak memiliki ribosom. Berfungsi mensintesis lipid, kolesterol, dan melakukan detoksifikasi.",
  "Lisosom adalah kantong bermembran tunggal yang mengandung enzim pencernaan. Berfungsi mencerna bagian sel yang rusak atau zat asing yang masuk ke dalam sel.",
  "Sentriol adalah organel silinder kecil yang biasanya berpasangan (sentrosom) dan berperan penting dalam pembelahan sel dengan membentuk benang spindel.",
  "Sitoplasma adalah cairan tempat semua organel berada. Mengandung air, mineral, protein, dan berbagai senyawa lain untuk menunjang proses metabolisme sel.",
  "Membran sel atau membran plasma bersifat semipermeabel. Berfungsi melindungi sel serta mengatur keluar masuknya zat.",
];

export default function AnimalQuizPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setIsLoading(true);
        const quizData = await generateQuiz(cellModels, "Hewan");
        setQuestions(quizData);
      } catch (err) {
        setError("Gagal memuat kuis. Silakan coba lagi.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuiz();
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-white text-lg">Membuat kuis dengan AI...</p>
        </div>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-gray-900 p-8 rounded-lg text-center">
          <p className="text-red-500 mb-4">{error || "Tidak ada pertanyaan"}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <Quiz
      questions={questions}
      onClose={() => router.back()}
      cellType="Hewan"
    />
  );
}
