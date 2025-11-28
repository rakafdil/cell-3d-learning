"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap"; // Tetap kita pakai untuk animasi smooth
import CellSidebar from "./CellSidebar";
import { useControls, Leva } from "leva";

export type PartInfo = {
  id: string;
  name: string;
  description: string;
  imagePath?: string;
  detailModelPath?: string;
};

type ModelViewerProps = {
  modelPath: string;
  modelsData: PartInfo[];
  onViewDetail: (part: PartInfo) => void;
};

export default function ModelViewer({
  modelPath,
  modelsData,
  onViewDetail,
}: ModelViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedPart, setSelectedPart] = useState<PartInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true); // State loading

  // Refs
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const interactableMeshesRef = useRef<THREE.Mesh[]>([]);
  const animationIdRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    setIsLoading(true); // Mulai loading

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // 1. Setup Scene
    const scene = new THREE.Scene();
    // scene.background = new THREE.Color("#111827"); // Opsional: hapus jika ingin transparan total
    sceneRef.current = scene;

    // --- SETTING CAMERA (Sesuai request: Z = 6) ---
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 5, 0); // Posisi di atas (Y positif besar)
    camera.lookAt(0, 0, 0); // Menghadap ke pusat scene
    cameraRef.current = camera;

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Aktifkan shadow map agar lighting directional bekerja maksimal
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // 3. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    // --- SETTING LIGHTING (Sesuai request code kamu) ---

    // Light 1: Ambient Kuat
    const light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);

    // Light 2: Ambient Tambahan (Sesuai snippet)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Light 3: Directional (Matahari)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Light 4: Hemisphere (Langit & Tanah)
    const hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x444444, 0.6);
    hemisphereLight.position.set(0, 20, 0);
    scene.add(hemisphereLight);

    // 5. Loaders
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
    loader.setDRACOLoader(dracoLoader);

    // 6. Load SINGLE Model
    loader.load(
      modelPath,
      (gltf) => {
        const root = gltf.scene;

        root.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;

            // Aktifkan shadow
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            // Bersihkan nama untuk logic ID
            const rawName = mesh.name;
            // Hapus angka, underscore jadi spasi, lowercase
            const cleanName = rawName
              .toLowerCase()
              .replace(/_/g, " ")
              .replace(/[0-9]/g, "")
              .trim();

            const isWadah =
              cleanName.includes("wadah") || cleanName.includes("membrane") || cleanName.includes("cell wall");
            const isAir =
              cleanName.includes("air") || cleanName.includes("cytoplasm");

            // --- LOGIC MATERIAL (Sesuai request: Texture Safety) ---
            if (mesh.material) {
              const originalMat = Array.isArray(mesh.material)
                ? mesh.material[0]
                : mesh.material;

              // Clone material
              const newMat = (
                originalMat as THREE.MeshStandardMaterial
              ).clone();

              // PENTING: Copy Texture Map jika ada (Sesuai snippet kamu)
              if ("map" in originalMat && (originalMat as any).map) {
                newMat.map = (originalMat as any).map;
              }

              // Setting Transparansi Awal
              newMat.transparent = true;
              newMat.opacity = isWadah ? 0.3 : isAir ? 0.15 : 1;
              newMat.side =
                isWadah || isAir ? THREE.DoubleSide : THREE.FrontSide;
              newMat.depthWrite = !(isWadah || isAir);

              mesh.material = newMat;
            }

            // Simpan data
            mesh.userData.originalName = rawName;

            // Pencocokan dengan modelsData
            const dataMatch = modelsData.find((d) =>
              cleanName.includes(d.id.toLowerCase().replace(/_/g, " "))
            );

            if (dataMatch) {
              mesh.userData.linkedId = dataMatch.id;
              if (!isWadah && !isAir) {
                interactableMeshesRef.current.push(mesh);
              }
            }
          }
        });

        scene.add(root);
        // Model selesai di-load
        setTimeout(() => {
          setIsLoading(false);
        }, 500); // Delay 500ms untuk smooth transition
      },
      (xhr) => {
        // Progress loading (opsional)
        const percentComplete = (xhr.loaded / xhr.total) * 100;
        console.log(`Loading: ${Math.round(percentComplete)}%`);
      },
      (error) => {
        console.error("Error loading model:", error);
        setIsLoading(false); // Stop loading meskipun error
      }
    );
    // 7. Raycaster
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseClick = (event: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();

      // Ignore click sidebar area
      if (event.clientX > rect.right - 350 && selectedPart) return;

      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // Raycast ke optimized array
      const intersects = raycaster.intersectObjects(
        interactableMeshesRef.current,
        false
      );

      if (intersects.length > 0) {
        const object = intersects[0].object;
        const linkedId = object.userData.linkedId;
        const foundData = modelsData.find((p) => p.id === linkedId);

        if (foundData) {
          setSelectedPart(foundData);
        }
      }
      // HAPUS bagian else ini:
      // else {
      //   setSelectedPart(null);
      // }
    };

    renderer.domElement.addEventListener("click", onMouseClick);

    // 8. Animation Loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      if (controls.enabled) controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener("resize", handleResize);
    containerRef.current.appendChild(renderer.domElement);

    return () => {
      cancelAnimationFrame(animationIdRef.current);
      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener("click", onMouseClick);
      if (containerRef.current)
        containerRef.current.removeChild(renderer.domElement);
      renderer.dispose();
      scene.clear();
    };
  }, [modelPath]);

  // --- EFFECT: VISUAL STATE & AUTO ZOOM (GSAP) ---
  useEffect(() => {
    if (!sceneRef.current || !cameraRef.current || !controlsRef.current) return;

    const camera = cameraRef.current;
    const controls = controlsRef.current;

    // Update Opacity
    sceneRef.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        const cleanName = mesh.name.toLowerCase();
        const isWadah =
          cleanName.includes("wadah") || cleanName.includes("membrane");
        const isAir =
          cleanName.includes("air") || cleanName.includes("cytoplasm");

        let targetOpacity = 1;

        if (!selectedPart) {
          if (isWadah) targetOpacity = 0.3;
          else if (isAir) targetOpacity = 0.15;
          else targetOpacity = 1;
        } else {
          const isSelected = mesh.userData.linkedId === selectedPart.id;
          if (isSelected) {
            targetOpacity = 1;
            if (isWadah) targetOpacity = 0.5;
          } else {
            targetOpacity = 0.1;
          }
        }

        // GSAP Opacity Transition
        gsap.to(mat, {
          opacity: targetOpacity,
          duration: 0.5,
          onUpdate: () => {
            mat.needsUpdate = true;
          },
        });
      }
    });

    // AUTO ZOOM LOGIC
    // ... (kode sebelumnya di dalam useEffect)

    // 2. LOGIC AUTO ZOOM (GSAP) - VERSI ANTI ZOOM OUT KEJAUHAN
    if (selectedPart) {
      const targetMesh = interactableMeshesRef.current.find(
        (m) => m.userData.linkedId === selectedPart.id
      );

      if (targetMesh) {
        const box = new THREE.Box3().setFromObject(targetMesh);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);

        // --- PERBAIKAN DI SINI ---
        // Masalah lama: distance = maxDim * 3 + 2 (Kalau objek lebar, dia mundur jauh)

        // Solusi baru: Kita batasi (Clamp) jaraknya.
        // Walaupun objeknya segede gaban, maksimal jarak cuma 5 unit + sedikit buffer.
        // Math.min(A, B) artinya pilih angka yang lebih kecil.

        const zoomFactor = 2.5; // Faktor zoom
        let finalDistance = maxDim * zoomFactor;

        // BATAS ATAS (Cap): Jangan lebih jauh dari 8 unit
        if (finalDistance > 8) finalDistance = 4;

        // BATAS BAWAH (Min): Jangan lebih dekat dari 4 unit (biar gak nembus muka)
        if (finalDistance < 4) finalDistance = 4;

        // Tentukan posisi kamera baru
        // Kita taruh kamera agak ke atas (y + ...) dan mundur (z + ...)
        const targetPos = new THREE.Vector3(
          center.x + finalDistance * 0.5, // Geser dikit ke samping
          center.y + finalDistance * 0.5, // Geser dikit ke atas
          center.z + finalDistance // Mundur ke belakang
        );

        gsap.to(camera.position, {
          x: targetPos.x,
          y: targetPos.y,
          z: targetPos.z,
          duration: 1.5,
          ease: "power2.out",
        });

        gsap.to(controls.target, {
          x: center.x,
          y: center.y,
          z: center.z,
          duration: 1.5,
          ease: "power2.out",
        });
      }
    } else {
      // RESET CAMERA (Posisi Awal)
      gsap.to(camera.position, {
        x: 0.01,
        y: 5.6,
        z: 0 / 2,
        duration: 1.5,
        ease: "power2.inOut",
      });

      gsap.to(controls.target, {
        x: 0.25,
        y: -0,
        z: 0.21,
        duration: 1.5,
        ease: "power2.inOut",
      });
    }
  }, [selectedPart]);

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Loading Overlay */}
      {isLoading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(17, 24, 39, 0.9)",
            zIndex: 1000,
            backdropFilter: "blur(10px)",
          }}
        >
          {/* Spinner */}
          <div
            style={{
              width: "60px",
              height: "60px",
              border: "5px solid rgba(255, 255, 255, 0.1)",
              borderTop: "5px solid #4CAF50",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />

          {/* Loading Text */}
          <p
            style={{
              marginTop: "20px",
              color: "white",
              fontSize: "18px",
              fontWeight: "600",
            }}
          >
            Memuat Model 3D...
          </p>

          {/* CSS Animation */}
          <style jsx>{`
            @keyframes spin {
              0% {
                transform: rotate(0deg);
              }
              100% {
                transform: rotate(360deg);
              }
            }
          `}</style>
        </div>
      )}

      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "100%",
          cursor: selectedPart ? "default" : "pointer",
          opacity: isLoading ? 0 : 1,
          transition: "opacity 0.5s ease-in-out",
        }}
      />

      <CellSidebar
        selectedPart={selectedPart}
        onClose={() => setSelectedPart(null)}
      />
    </div>
  );
}
