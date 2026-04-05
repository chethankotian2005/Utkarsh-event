"use client";

import { useEffect, useRef, Suspense, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { motion } from "framer-motion";
import Image from "next/image";

const taglineWords = "My SMVITM, My Pride".split(" ");

function ApertureBlades({ enableParallax }: { enableParallax: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const bladesRef = useRef<THREE.Mesh[]>([]);
  const targetRotation = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Entrance animation
    const tl = gsap.timeline();
    
    // Animate entire group scale
    if (groupRef.current) {
      tl.fromTo(
        groupRef.current.scale,
        { x: 0.1, y: 0.1, z: 0.1 },
        { x: 1, y: 1, z: 1, duration: 1.4, ease: "power3.out" },
        0
      );
    }

    // Animate individual blades opening
    bladesRef.current.forEach((blade, i) => {
      if (!blade) return;
      const angle = (Math.PI * 2 / 7) * i;
      // Start slightly rotated inward
      tl.fromTo(
        blade.rotation,
        { z: angle + Math.PI / 4 },
        { z: angle, duration: 1.4, ease: "power3.out" },
        0
      );
    });

    if (!enableParallax) return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      // map to [-0.3, 0.3]
      targetRotation.current = { x: -y * 0.3, y: x * 0.3 };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [enableParallax]);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Idle rotation
    groupRef.current.rotation.z += 0.003;
    
    // Pulse scale
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    groupRef.current.scale.set(pulse, pulse, pulse);

    // Mouse parallax
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotation.current.x,
      0.05
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotation.current.y,
      0.05
    );
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: 7 }).map((_, i) => {
        const angle = (Math.PI * 2) / 7 * i;
        // Tangent offset logic
        const radius = 0.7;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        return (
          <mesh
            key={i}
            ref={(el) => {
              if (el) bladesRef.current[i] = el;
            }}
            position={[x, y, 0]}
            rotation={[0, 0, angle]}
          >
            <boxGeometry args={[0.15, 1.2, 0.08]} />
            <meshStandardMaterial
              color="#C9A84C"
              metalness={0.95}
              roughness={0.1}
              envMapIntensity={1.5}
            />
          </mesh>
        );
      })}
    </group>
  );
}

export default function ApertureHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.4, ease: "power2.out" }
      );
    }

    const updateViewport = () => {
      setIsMobile(window.innerWidth < 768 || window.matchMedia("(hover: none)").matches);
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);

    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  return (
    <section className="relative w-full overflow-hidden" style={{ height: "100svh" }}>
      {/* 3D Canvas Container */}
         <div ref={containerRef} className="hero-canvas-wrapper absolute inset-0 z-0">
        <Suspense fallback={<div className="w-full h-full bg-black" />}>
          <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={isMobile ? 1 : [1, 2]}>
            <ambientLight intensity={0.3} />
            <pointLight position={[3, 3, 3]} intensity={2} color="#FFD700" />
            <ApertureBlades enableParallax={!isMobile} />
            <Environment preset="city" />
          </Canvas>
        </Suspense>
      </div>

      {/* HTML Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
        
        {/* Floating Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mb-8 pointer-events-auto"
        >
          <motion.div
            animate={{ y: ["-8px", "8px", "-8px"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div
              className="hero-logo"
              style={{
                width: '88px',
                height: '88px',
                borderRadius: '50%',
                overflow: 'hidden',
                flexShrink: 0,
                position: 'relative',
                boxShadow: "0 0 0 2px rgba(212,175,55,0.6), 0 0 30px rgba(212,175,55,0.4)",
                filter: "drop-shadow(0 0 20px rgba(212,175,55,0.9))",
              }}
            >
              <Image
                src="/utkarsh-logo.jpg"
                alt="Utkarsh Logo"
                fill
                style={{ objectFit: 'cover', objectPosition: 'center' }}
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Small Label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="uppercase text-gold font-mono mb-4 text-center px-4"
          style={{ letterSpacing: "0.3em", fontSize: "11px" }}
        >
          UTKARSH — SMVITM MEDIA TEAM PRESENTS
        </motion.p>

        {/* Main Tagline */}
        <div className="hero-tagline flex flex-wrap justify-center gap-x-4 px-6 text-center">
          {taglineWords.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 + i * 0.15, ease: [0.215, 0.61, 0.355, 1] }}
              className="font-display text-white"
              style={{ fontSize: "clamp(3.5rem, 8vw, 7rem)", lineHeight: 1.1, display: "inline-block", marginRight: "0.25em" }}
            >
              {word}
            </motion.span>
          ))}
        </div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.6 }}
          className="hero-cta-group mt-12 flex flex-col sm:flex-row gap-6 pointer-events-auto"
        >
          <a href="#treasure-hunt" className="hero-cta">
            TREASURE HUNT
          </a>
          <a href="#viral-selfie" className="hero-cta">
            VIRAL SELFIE
          </a>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center opacity-70">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: "1px", height: "60px", background: "var(--gold)" }}
        />
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-2 h-2 mt-1 rotate-45 border-b border-r border-gold"
        />
      </div>
    </section>
  );
}
