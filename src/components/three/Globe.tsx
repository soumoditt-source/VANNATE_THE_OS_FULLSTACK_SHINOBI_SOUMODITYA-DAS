"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, Stars } from "@react-three/drei";
import * as THREE from "three";

function GlobeMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  // Rotating arcs for "connections"
  const arcs = useMemo(() => {
    return Array.from({ length: 80 }, (_, i) => {
      const phi = Math.acos(-1 + (2 * i) / 80);
      const theta = Math.sqrt(80 * Math.PI) * phi;
      return [
        Math.sin(phi) * Math.cos(theta),
        Math.sin(phi) * Math.sin(theta),
        Math.cos(phi),
      ];
    });
  }, []);

  useFrame((state) => {
    if (meshRef.current) meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.12;
    if (glowRef.current) glowRef.current.rotation.y = state.clock.getElapsedTime() * 0.08;
  });

  return (
    <group>
      {/* Outer glow */}
      <Sphere ref={glowRef} args={[2.15, 64, 64]}>
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.04} side={THREE.BackSide} />
      </Sphere>

      {/* Main globe */}
      <Sphere ref={meshRef} args={[2, 64, 64]}>
        <MeshDistortMaterial
          color="#0f172a"
          emissive="#1e3a5f"
          emissiveIntensity={0.3}
          roughness={0.8}
          metalness={0.2}
          distort={0.08}
          speed={1.5}
          wireframe={false}
        />
      </Sphere>

      {/* Wireframe overlay */}
      <Sphere args={[2.02, 32, 32]}>
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.08} wireframe />
      </Sphere>

      {/* Dot points */}
      {arcs.map((pos, i) => (
        <mesh key={i} position={[pos[0] * 2.03, pos[1] * 2.03, pos[2] * 2.03]}>
          <sphereGeometry args={[0.012, 8, 8]} />
          <meshBasicMaterial color={i % 7 === 0 ? "#60a5fa" : "#1d4ed8"} />
        </mesh>
      ))}

      {/* Ambient light ring */}
      <pointLight position={[4, 2, 4]} color="#3b82f6" intensity={2} distance={10} />
      <pointLight position={[-4, -2, -4]} color="#8b5cf6" intensity={1} distance={10} />
    </group>
  );
}

export default function Globe() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      style={{ width: "100%", height: "100%" }}
      gl={{ antialias: true, alpha: true }}
    >
      <Stars radius={80} depth={50} count={3000} factor={3} fade speed={0.5} />
      <ambientLight intensity={0.1} />
      <GlobeMesh />
    </Canvas>
  );
}
