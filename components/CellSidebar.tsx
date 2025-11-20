"use client";

import { PartInfo } from "./ModelViewer"; // Kita import tipe datanya nanti

interface CellSidebarProps {
  selectedPart: PartInfo | null;
  onClose: () => void;
}

export default function CellSidebar({
  selectedPart,
  onClose,
}: CellSidebarProps) {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        right: selectedPart ? 0 : "-350px", // Animasi slide in/out
        width: "350px",
        height: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        boxShadow: "-5px 0 15px rgba(0,0,0,0.1)",
        transition: "right 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        zIndex: 10,
        padding: "30px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        borderLeft: "1px solid #e0e0e0",
        overflowY: "auto", // Agar bisa discroll jika konten panjang
      }}
    >
      {selectedPart && (
        <>
          <button
            onClick={onClose}
            style={{
              alignSelf: "flex-end",
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              color: "#888",
              marginBottom: "10px",
            }}
          >
            &times;
          </button>

          <h2
            style={{
              marginTop: 0,
              color: "#222",
              fontSize: "24px",
              borderBottom: "2px solid #4CAF50",
              paddingBottom: "10px",
              marginBottom: "20px",
            }}
          >
            {selectedPart.name}
          </h2>

          {/* --- BAGIAN GAMBAR 2D --- */}
          {selectedPart.imagePath && (
            <div style={{ marginBottom: "20px", textAlign: "center" }}>
              <img
                src={selectedPart.imagePath}
                alt={selectedPart.name}
                style={{
                  maxWidth: "100%",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  border: "1px solid #ddd",
                }}
              />
            </div>
          )}

          <div style={{ lineHeight: "1.6", color: "#444", fontSize: "16px" }}>
            <p>{selectedPart.description}</p>
          </div>
        </>
      )}
    </div>
  );
}
