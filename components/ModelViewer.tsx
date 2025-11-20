"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import CellSidebar from "./CellSidebar"; // <--- Import komponen baru

// Kita export agar bisa dipakai di file lain
export type PartInfo = {
  fileName: string;
  name: string;
  description: string;
  imagePath?: string; // <--- Tambahkan field opsional untuk gambar
};

type ModelViewerProps = {
  basePath: string;
  models: PartInfo[];
};

export default function ModelViewer({ basePath, models }: ModelViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedPart, setSelectedPart] = useState<PartInfo | null>(null);

  // Ref untuk Three.js objects
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const objectsRef = useRef<THREE.Object3D[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // 1. Setup Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 6;
    cameraRef.current = camera;

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;

    // 3. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // 4. Lighting
    const light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    const hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x444444, 0.6);
    hemisphereLight.position.set(0, 20, 0);
    scene.add(hemisphereLight);

    // 5. Loaders
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
    loader.setDRACOLoader(dracoLoader);

    // 6. Load Models
    const loadAllModels = async () => {
      const promises = models.map((item) => {
        return new Promise<void>((resolve) => {
          loader.load(
            basePath + item.fileName,
            (gltf) => {
              const model = gltf.scene;
              model.name = item.name;

              // Logic Z-Order
              const isWadah = item.fileName.includes("wadahnya");
              const isAir = item.fileName.includes("airnya");

              if (isWadah) model.renderOrder = 2;
              else if (isAir) model.renderOrder = 1;
              else model.renderOrder = 0;

              model.traverse((child) => {
                if ((child as THREE.Mesh).isMesh) {
                  const mesh = child as THREE.Mesh;
                  mesh.userData.originalName = item.name;

                  if (mesh.material) {
                    const originalMaterial = Array.isArray(mesh.material)
                      ? mesh.material[0]
                      : mesh.material;
                    const clonedMaterial = originalMaterial.clone();

                    // Safely copy the texture map only if the material actually has one
                    if (
                      "map" in originalMaterial &&
                      (originalMaterial as any).map
                    ) {
                      (clonedMaterial as any).map = (
                        originalMaterial as any
                      ).map;
                    }

                    if (isWadah || isAir) {
                      clonedMaterial.transparent = true;
                      clonedMaterial.opacity = isWadah ? 0.3 : 0.15;
                      clonedMaterial.depthWrite = false;
                      clonedMaterial.side = THREE.DoubleSide;
                    } else {
                      clonedMaterial.transparent = true;
                      clonedMaterial.opacity = 1;
                      clonedMaterial.depthWrite = true;
                    }

                    clonedMaterial.needsUpdate = true;
                    mesh.material = clonedMaterial;
                  }
                }
              });

              objectsRef.current.push(model);
              scene.add(model);
              resolve();
            },
            undefined,
            () => resolve()
          );
        });
      });

      await Promise.all(promises);
    };

    loadAllModels();

    // 7. Raycaster
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseClick = (event: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();

      // Ignore click di area sidebar (sekarang dihandle di div utama, tapi tetap good practice)
      if (event.clientX > rect.right - 350 && selectedPart) return;

      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(objectsRef.current, true);

      if (intersects.length > 0) {
        const object = intersects[0].object;
        const partName = object.userData.originalName;
        const partInfo = models.find((p) => p.name === partName);
        if (partInfo) setSelectedPart(partInfo);
      } else {
        setSelectedPart(null);
      }
    };

    renderer.domElement.addEventListener("click", onMouseClick);

    // 8. Animation Loop
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
      renderer.domElement.removeEventListener("click", onMouseClick);
      if (
        containerRef.current &&
        renderer.domElement.parentNode === containerRef.current
      ) {
        containerRef.current.removeChild(renderer.domElement);
      }
      controls.dispose();
      renderer.dispose();
      objectsRef.current.forEach((obj) => scene.remove(obj));
      objectsRef.current = [];
    };
  }, [basePath, models]);

  // -- EFFECT KHUSUS FOKUS --
  useEffect(() => {
    if (!objectsRef.current.length) return;

    objectsRef.current.forEach((group) => {
      const isSelected = selectedPart ? group.name === selectedPart.name : true;
      const isWadah = group.name.toLowerCase().includes("wadah");
      const isAir = group.name.toLowerCase().includes("air");

      group.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          const mat = Array.isArray(mesh.material)
            ? mesh.material[0]
            : mesh.material;

          if (selectedPart === null) {
            if (isWadah) mat.opacity = 0.3;
            else if (isAir) mat.opacity = 0.15;
            else mat.opacity = 1;
          } else {
            if (isSelected) {
              if (isWadah || isAir) mat.opacity = 0.3;
              else mat.opacity = 1;
            } else {
              mat.opacity = 0.1;
            }
          }
          mat.needsUpdate = true;
        }
      });
    });
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
      {/* AREA 3D */}
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "100%",
          cursor: selectedPart ? "default" : "pointer",
        }}
      />

      {/* UI SIDEBAR (DIPISAH) */}
      <CellSidebar
        selectedPart={selectedPart}
        onClose={() => setSelectedPart(null)}
      />
    </div>
  );
}
