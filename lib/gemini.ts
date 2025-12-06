import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
);

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export async function generateQuiz(
  descriptions: string[],
  cellType: string
): Promise<QuizQuestion[]> {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
Buatkan 10 soal pilihan ganda dalam bahasa Indonesia tentang organel sel ${cellType} berdasarkan deskripsi berikut:

${descriptions.map((desc, i) => `${i + 1}. ${desc}`).join("\n\n")}

Format jawaban harus dalam JSON array dengan struktur:
[
  {
    "question": "Pertanyaan soal",
    "options": ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D"],
    "correctAnswer": 0,
    "explanation": "Penjelasan jawaban"
  }
]

Pastikan:
- Soal bervariasi (fungsi, struktur, karakteristik)
- correctAnswer adalah index (0-3) dari jawaban yang benar
- Semua dalam bahasa Indonesia
- Hanya kembalikan JSON array tanpa teks tambahan
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  // Extract JSON from response
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error("Failed to parse quiz data");
  }

  return JSON.parse(jsonMatch[0]);
}
