'use client';
import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

function Particles({ count = 350 }) {
  const mesh = useRef<THREE.Points>(null!);
  const { camera } = useThree();
  const mouse = useRef(new THREE.Vector2(9999, 9999));

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  // Generate initial positions and velocities
  const { positions, velocities, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3); // vx, vy, vz
    const colors = new Float32Array(count * 3);

    const goldColors = [
      [0.83, 0.69, 0.30],  // #C9A84C
      [1.00, 0.84, 0.00],  // #FFD700
      [0.72, 0.53, 0.04],  // #B8860B
      [1.00, 1.00, 1.00],  // white accent
    ];

    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 20;  // x: spread -10 to 10
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;  // y: spread -6 to 6
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;   // z: spread -4 to 4

      velocities[i * 3]     = (Math.random() - 0.5) * 0.005;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.005;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.003;

      const c = goldColors[Math.floor(Math.random() * goldColors.length)];
      colors[i * 3]     = c[0];
      colors[i * 3 + 1] = c[1];
      colors[i * 3 + 2] = c[2];
    }

    return { positions, velocities, colors };
  }, [count]);

  // Store positions in a ref for mutation each frame
  const posRef = useRef(positions.slice());

  useFrame(() => {
    if (!mesh.current) return;
    const pos = posRef.current;
    const geo = mesh.current.geometry;

    // Unproject mouse to world space at z=0
    const mouseWorld = new THREE.Vector3(mouse.current.x, mouse.current.y, 0.5);
    mouseWorld.unproject(camera);
    const dir = mouseWorld.sub(camera.position).normalize();
    const dist = -camera.position.z / dir.z;
    const mw = camera.position.clone().add(dir.multiplyScalar(dist));

    for (let i = 0; i < count; i++) {
      const ix = i * 3, iy = i * 3 + 1, iz = i * 3 + 2;

      // Vector from particle to mouse in world space
      const dx = pos[ix] - mw.x;
      const dy = pos[iy] - mw.y;
      const dz = pos[iz];
      const distSq = dx * dx + dy * dy + dz * dz;
      const influenceRadius = 3.5; // world units

      if (distSq < influenceRadius * influenceRadius && distSq > 0.01) {
        const d = Math.sqrt(distSq);
        const force = (influenceRadius - d) / influenceRadius * 0.04;
        velocities[ix]     += (dx / d) * force;
        velocities[iy]     += (dy / d) * force;
      }

      // Apply drag
      velocities[ix]     *= 0.96;
      velocities[iy]     *= 0.96;
      velocities[iz]     *= 0.96;

      // Move particle
      pos[ix]     += velocities[ix];
      pos[iy]     += velocities[iy];
      pos[iz]     += velocities[iz];

      // Wrap around bounds
      if (pos[ix] >  10) pos[ix] = -10;
      if (pos[ix] < -10) pos[ix] =  10;
      if (pos[iy] >   6) pos[iy] = -6;
      if (pos[iy] <  -6) pos[iy] =  6;
    }

    (geo.attributes.position as THREE.BufferAttribute).array = pos;
    geo.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

export default function ParticleField3D() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 0,
      pointerEvents: 'none',
      background: 'transparent',
      isolation: 'isolate',
    }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
        style={{
          width: '100%',
          height: '100%',
          background: 'transparent',
          display: 'block',
        }}
      >
        {/* Temporary sphere for testing visibility */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshBasicMaterial color="white" />
        </mesh>
        <Particles count={350} />
      </Canvas>
    </div>
  );
}
