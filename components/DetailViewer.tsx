"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

type DetailViewerProps = {
  modelPath: string;
  onClose: () => void;
};

export default function DetailViewer({
  modelPath,
  onClose,
}: DetailViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#000000"); // Background hitam pekat/elegan

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 2, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Setup Lighting Bagus
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);
    const backLight = new THREE.DirectionalLight(0x5555ff, 1); // Rim light biru biar keren
    backLight.position.set(-5, 0, -5);
    scene.add(backLight);

    // 2. Load Model
    const loader = new GLTFLoader();
    loader.load(modelPath, (gltf) => {
      const model = gltf.scene;

      // Auto Center Model (Penting biar pas di tengah)
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      model.position.sub(center); // Geser model ke titik 0,0,0

      scene.add(model);
    });

    // 3. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true; // Biar muter sendiri kayak pameran
    controls.autoRotateSpeed = 2.0;

    // 4. Animation
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    containerRef.current.appendChild(renderer.domElement);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      renderer.dispose();
      scene.clear();
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [modelPath]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-[80vw] h-[80vh] bg-gray-900 rounded-2xl overflow-hidden border border-gray-700 shadow-2xl">
        {/* Tombol Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition"
        >
          ✕ Close
        </button>

        {/* Canvas Area */}
        <div ref={containerRef} className="w-full h-full" />

        <div className="absolute bottom-4 left-0 right-0 text-center text-white/50 text-sm pointer-events-none">
          Click & Drag to Rotate • Scroll to Zoom
        </div>
      </div>
    </div>
  );
}
