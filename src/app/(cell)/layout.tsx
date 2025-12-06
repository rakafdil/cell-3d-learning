"use client";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type CellLayoutProps = {
  children: ReactNode;
};

export default function CellLayout({ children }: CellLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const isAnimal = pathname?.includes("hewan");
  const isPlant = pathname?.includes("tumbuhan");

  // Loading state saat navigasi
  // useEffect(() => {
  //   setIsLoading(true);

  //   // Loading 5 detik untuk tumbuhan, 2 detik untuk hewan
  //   const loadingDuration = isPlant ? 5000 : 2500;

  //   const timer = setTimeout(() => {
  //     setIsLoading(false);
  //   }, loadingDuration);

  //   return () => clearTimeout(timer);
  // }, [pathname, isPlant]);

  const handleToggle = () => {
    if (isAnimal) {
      window.location.href = "/tumbuhan";
    } else {
      window.location.href = "/hewan";
    }
  };

  const handleQuiz = () => {
    if (isAnimal) {
      router.push("/hewan/quiz");
    } else if (isPlant) {
      router.push("/tumbuhan/quiz");
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-gray-900 flex flex-col items-center justify-center"
          >
            <div className="relative">
              {/* Spinner */}
              <div className="w-16 h-16 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin"></div>

              {/* Emoji di tengah spinner */}
              <div className="absolute inset-0 flex items-center justify-center text-2xl">
                {isAnimal ? "🐾" : "🌱"}
              </div>
            </div>

            <p className="mt-6 text-white text-lg font-medium">
              Memuat Model {isAnimal ? "Sel Hewan" : "Sel Tumbuhan"}...
            </p>

            {/* Progress bar */}
            <div className="w-64 h-1 bg-gray-700 rounded-full mt-4 overflow-hidden">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-blue-500 to-green-500"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-2 bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between px-6 py-4">
          <button
            onClick={() => {
              router.push("/");
            }}
            className="text-white hover:text-blue-400 transition-colors flex items-center gap-2"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span className="text-lg font-semibold">Kembali</span>
          </button>

          <h1 className="text-2xl font-bold text-white">
            {isAnimal ? "Sel Hewan" : isPlant ? "Sel Tumbuhan" : "Sel 3D"}
          </h1>

          <div className="flex items-center gap-3">
            {/* Quiz Button */}
            {(isAnimal || isPlant) && (
              <button
                onClick={handleQuiz}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-medium transition-all duration-300 flex items-center gap-2"
              >
                <span>📝</span>
                <span>Kuis</span>
              </button>
            )}

            {/* Switch Button */}
            <div className="flex items-center gap-3 bg-gray-800/50 rounded-full p-1 border border-white/10">
              <button
                onClick={handleToggle}
                disabled={isLoading}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                  isAnimal
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-white"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                🐾 Hewan
              </button>
              <button
                onClick={handleToggle}
                disabled={isLoading}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                  isPlant
                    ? "bg-green-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-white"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                🌱 Tumbuhan
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Control Panel */}
      <div className="absolute bottom-6 left-6 z-40 bg-black/30 backdrop-blur-md rounded-lg p-4 border border-white/10">
        <h3 className="text-sm font-semibold text-white mb-3">Kontrol 3D</h3>
        <div className="space-y-2 text-xs text-gray-300">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              🖱️
            </div>
            <span>Drag untuk rotasi</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-600 rounded flex items-center justify-center">
              🔍
            </div>
            <span>Scroll untuk zoom</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center">
              👆
            </div>
            <span>Klik untuk info</span>
          </div>
        </div>
      </div>

      {/* Main Content dengan Transisi */}
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {/* Info Badge */}
      <div className="absolute top-30 left-6 z-40 bg-black/30 backdrop-blur-md rounded-full px-4 py-2 border border-white/10">
        <span className="text-white text-sm font-medium">
          {isAnimal ? "🐾 Mode Hewan" : isPlant ? "🌱 Mode Tumbuhan" : ""}
        </span>
      </div>
    </div>
  );
}
