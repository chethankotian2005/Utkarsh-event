"use client";

import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";

/* ─── Single Aperture Blade ─── */
function AptureBlade({
  index,
  total,
  isOpen,
}: {
  index: number;
  total: number;
  isOpen: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const baseAngle = (index / total) * Math.PI * 2;
  const targetRotZ = isOpen ? baseAngle + Math.PI / 1.8 : baseAngle;

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.z = THREE.MathUtils.lerp(
      meshRef.current.rotation.z,
      targetRotZ,
      delta * 3
    );
  });

  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(0.15, 0.6, 0.35, 0.9, 0.08, 1.1);
  shape.bezierCurveTo(-0.1, 1.3, -0.35, 1.1, -0.35, 0.7);
  shape.bezierCurveTo(-0.35, 0.3, -0.2, 0.1, 0, 0);

  const geometry = new THREE.ShapeGeometry(shape);

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      rotation={[0, 0, baseAngle]}
      position={[0, 0, 0]}
    >
      <meshStandardMaterial
        color="#C9A84C"
        metalness={1}
        roughness={0.15}
        envMapIntensity={2}
      />
    </mesh>
  );
}

/* ─── Aperture Group ─── */
function Aperture({
  isOpen,
  mouse,
}: {
  isOpen: boolean;
  mouse: React.RefObject<{ x: number; y: number }>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const BLADES = 6;

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    // Slow rotation always
    groupRef.current.rotation.z += delta * 0.15;
    // Mouse parallax tilt
    const mx = mouse.current?.x ?? 0;
    const my = mouse.current?.y ?? 0;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      my * 0.3,
      delta * 3
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      mx * 0.3,
      delta * 3
    );
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: BLADES }, (_, i) => (
        <AptureBlade key={i} index={i} total={BLADES} isOpen={isOpen} />
      ))}
    </group>
  );
}

/* ─── Starfield ─── */
function Starfield({ mouse }: { mouse: React.RefObject<{ x: number; y: number }> }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 300;

  const positions = new Float32Array(
    Array.from({ length: count * 3 }, () => (Math.random() - 0.5) * 20)
  );

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.03;
    const mx = mouse.current?.x ?? 0;
    const my = mouse.current?.y ?? 0;
    pointsRef.current.rotation.x = THREE.MathUtils.lerp(
      pointsRef.current.rotation.x,
      my * 0.05,
      delta * 2
    );
    pointsRef.current.rotation.y = THREE.MathUtils.lerp(
      pointsRef.current.rotation.y,
      mx * 0.05,
      delta * 2
    );
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial color="#C9A84C" size={0.03} transparent opacity={0.6} />
    </points>
  );
}

/* ─── Scene Lights ─── */
function Lights() {
  return (
    <>
      <ambientLight intensity={0.4} color="#FFD700" />
      <pointLight position={[5, 5, 5]} intensity={6} color="#FFD700" />
      <pointLight position={[-5, -3, 2]} intensity={3} color="#C9A84C" />
      <pointLight position={[0, 3, -3]} intensity={2} color="#FFA500" />
    </>
  );
}

/* ─── Inner Canvas Scene ─── */
function Scene({
  isOpen,
  mouse,
}: {
  isOpen: boolean;
  mouse: React.RefObject<{ x: number; y: number }>;
}) {
  return (
    <>
      <Lights />
      <Starfield mouse={mouse} />
      <Aperture isOpen={isOpen} mouse={mouse} />
      <Environment preset="studio" />
    </>
  );
}

/* ─── CSS Fallback Aperture ─── */
function ApertureFallback({ isOpen }: { isOpen: boolean }) {
  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      <svg
        viewBox="0 0 200 200"
        className={`w-full h-full aperture-svg-fallback transition-all duration-1000 ${isOpen ? "scale-150 opacity-0" : "opacity-100 scale-100"}`}
      >
        <defs>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#B8860B" />
            <stop offset="50%" stopColor="#FFD700" />
            <stop offset="100%" stopColor="#C9A84C" />
          </linearGradient>
        </defs>
        {[0, 60, 120, 180, 240, 300].map((deg, i) => (
          <g key={i} transform={`rotate(${deg} 100 100)`}>
            <path
              d="M100,100 Q115,60 100,20 Q85,60 100,100z"
              fill="url(#goldGrad)"
              opacity="0.9"
            />
          </g>
        ))}
        <circle cx="100" cy="100" r="18" fill="url(#goldGrad)" />
      </svg>
    </div>
  );
}

/* ─── Main Export ─── */
export default function ApertureScene() {
  const [isOpen, setIsOpen] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      setWebglSupported(!!ctx);
    } catch {
      setWebglSupported(false);
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Auto-open after 1.5s
    const timer = setTimeout(() => setIsOpen(true), 1500);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timer);
    };
  }, []);

  if (!webglSupported) {
    return (
      <div
        className="w-full h-full flex items-center justify-center cursor-pointer"
        onClick={() => setIsOpen((p) => !p)}
      >
        <ApertureFallback isOpen={isOpen} />
      </div>
    );
  }

  return (
    <div
      className="w-full h-full cursor-pointer"
      onClick={() => setIsOpen((p) => !p)}
    >
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene isOpen={isOpen} mouse={mouse} />
      </Canvas>
    </div>
  );
}
