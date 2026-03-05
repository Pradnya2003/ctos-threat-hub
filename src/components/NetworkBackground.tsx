"use client";

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function Particles({ count = 2000 }) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, initialPositions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const initialPos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 1) * 20; // Spread along Z
      
      initialPos[i * 3] = pos[i * 3];
      initialPos[i * 3 + 1] = pos[i * 3 + 1];
      initialPos[i * 3 + 2] = pos[i * 3 + 2];
    }
    return [pos, initialPos];
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      const time = state.clock.getElapsedTime();
      const positionsAttr = pointsRef.current.geometry.attributes.position;
      
      for (let i = 0; i < count; i++) {
        // Move towards viewer (tunnel effect)
        let z = positionsAttr.getZ(i) + 0.05;
        if (z > 5) z = -15; // Reset to back
        positionsAttr.setZ(i, z);
      }
      positionsAttr.needsUpdate = true;
      
      pointsRef.current.rotation.z = time * 0.05;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#E05224"
        size={0.03}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.4}
      />
    </Points>
  );
}

function GridLines() {
    const meshRef = useRef<THREE.Mesh>(null);
    
    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.position.z = (state.clock.getElapsedTime() * 1.5) % 2;
        }
    });

    return (
        <group>
            {Array.from({ length: 20 }).map((_, i) => (
                <mesh key={i} position={[0, 0, -i * 2]}>
                    <ringGeometry args={[0, 15, 64]} />
                    <meshBasicMaterial 
                        color="#1E293B" 
                        wireframe 
                        transparent 
                        opacity={0.1 - (i * 0.005)} 
                    />
                </mesh>
            ))}
        </group>
    );
}

export default function NetworkBackground() {
  return (
    <div className="fixed inset-0 z-0 bg-[#020817]">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <color attach="background" args={['#020817']} />
        <fog attach="fog" args={['#020817', 5, 15]} />
        <ambientLight intensity={0.5} />
        <Particles count={2000} />
        <GridLines />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-t from-[#020817] via-transparent to-[#020817] opacity-60" />
    </div>
  );
}
