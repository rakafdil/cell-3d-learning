"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default function AnimalCell() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Refs untuk Three.js objects
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animationIdRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    setIsLoading(true);

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // 1. Setup Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Setup Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;

    // 3. Setup Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Aktifkan shadow mapping
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // 4. Setup Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    // 5. Setup Lighting
    // Ambient Light
    const light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Directional Light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Hemisphere Light
    const hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x444444, 0.6);
    hemisphereLight.position.set(0, 20, 0);
    scene.add(hemisphereLight);

    // 6. Setup Loaders
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
    loader.setDRACOLoader(dracoLoader);

    // 7. Load Model
    loader.load(
      "/models/plant_cell_organelles.glb",
      (gltf) => {
        const root = gltf.scene;

        // Process setiap mesh dalam model
        root.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;

            // Aktifkan shadow
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            // Simpan nama original
            mesh.userData.originalName = mesh.name;
          }
        });

        scene.add(root);

        // Stop loading setelah model dimuat
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      },
      (xhr) => {
        // Progress loading
        const percentComplete = (xhr.loaded / xhr.total) * 100;
        console.log(`Loading: ${Math.round(percentComplete)}%`);
      },
      (error) => {
        console.error("Error loading model:", error);
        setIsLoading(false);
      }
    );

    // 8. Animation Loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      if (controls.enabled) controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 9. Handle Resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener("resize", handleResize);

    // 10. Mount renderer ke DOM
    containerRef.current.appendChild(renderer.domElement);

    // 11. Cleanup
    return () => {
      cancelAnimationFrame(animationIdRef.current);
      window.removeEventListener("resize", handleResize);
      if (
        containerRef.current &&
        renderer.domElement.parentNode === containerRef.current
      ) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      controls.dispose();
      scene.clear();
    };
  }, []);

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

      {/* 3D Container */}
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "100%",
          cursor: "grab",
          opacity: isLoading ? 0 : 1,
          transition: "opacity 0.5s ease-in-out",
        }}
      />
    </div>
  );
}
