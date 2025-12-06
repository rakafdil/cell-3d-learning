"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Quiz from "@/components/Quiz";
import { generateQuiz, QuizQuestion } from "@/lib/gemini";

const organels = [
  "Inti sel yang mengandung materi genetik (DNA) dan mengontrol seluruh aktivitas sel.",
  "Pembangkit tenaga sel. Tempat respirasi seluler untuk menghasilkan energi (ATP).",
  "Tempat memodifikasi, menyortir, dan mengemas protein dan lipid dari RE untuk dikirim ke tempat lain.",
  "Jalur transportasi yang ditempeli ribosom. Berfungsi untuk sintesis protein.",
  "Tidak memiliki ribosom. Berfungsi untuk sintesis lipid (lemak), metabolisme karbohidrat, dan detoksifikasi.",
  "Berperan penting dalam proses pembelahan sel dengan membentuk benang spindel.",
  "Cairan seperti jeli yang mengisi bagian dalam sel dan mengelilingi organel.",
  "Lapisan pelindung kaku yang melindungi sel tumbuhan dan mempertahankan struktur sel",
  "Organel besar berisi cairan yang menyimpan air, nutrisi, dan limbah. Pada sel tumbuhan, vakuola sangat besar dan membantu menjaga tekanan turgor sel.",
  "Organel yang mengandung klorofil untuk proses fotosintesis. Mengubah energi cahaya menjadi energi kimia (glukosa).",
];

export default function PlantQuizPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setIsLoading(true);
        const quizData = await generateQuiz(organels, "Tumbuhan");
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
          <div className="w-16 h-16 border-4 border-gray-700 border-t-green-500 rounded-full animate-spin mx-auto"></div>
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
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
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
      cellType="Tumbuhan"
    />
  );
}
