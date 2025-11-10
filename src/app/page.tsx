"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

type ButtonProps = {
  href: string;
  children: ReactNode;
};

const Button = ({ href, children }: ButtonProps) => (
  <a
    href={href}
    className="bg-white/40 text-4xl backdrop-blur-2xl px-20 py-4 text-black hover:bg-white w-full"
  >
    {children}
  </a>
);

function BackgroundModel() {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = "0";
    renderer.domElement.style.left = "0";
    renderer.domElement.style.width = "100vw";
    renderer.domElement.style.height = "100vh";
    renderer.domElement.style.zIndex = "0";
    renderer.domElement.style.pointerEvents = "none";
    renderer.domElement.style.filter = "blur(8px) brightness(0.7)";

    if (bgRef.current) {
      bgRef.current.appendChild(renderer.domElement);
    }

    const light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);

    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
    loader.setDRACOLoader(dracoLoader);

    loader.load("/models/animal_cell.glb", (gltf) => {
      scene.add(gltf.scene);
      const animate = () => {
        requestAnimationFrame(animate);
        gltf.scene.rotation.y += 0.005;
        gltf.scene.rotation.x += 0.005;
        renderer.render(scene, camera);
      };
      animate();
    });

    return () => {
      if (bgRef.current && renderer.domElement.parentNode === bgRef.current) {
        bgRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={bgRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        overflow: "hidden",
      }}
      aria-hidden="true"
    />
  );
}

export default function Home() {
  const router = useRouter();
  return (
    <div className="relative flex flex-col min-h-screen items-center justify-center font-sans bg-black/20 gap-10">
      <BackgroundModel />
      <h1 className="z-10 text-8xl">Pembelajaran Sel Interaktif</h1>
      <div className="flex gap-10 z-10 max-w-3xl">
        <Button href={"/hewan"}>Hewan</Button>
        <Button href={"/tumbuhan"}>Tumbuhan</Button>
      </div>
    </div>
  );
}
