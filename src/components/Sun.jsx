import React from 'react';
import * as THREE from 'three';

function Sun() {
  return (
    <>
      {/* Glowing Sun Sphere */}
      <mesh position={[-10, 15, 10]}>
        <sphereGeometry args={[5, 32, 32]} />
        <meshBasicMaterial
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={1.5}
        />
      </mesh>

      {/* Sunlight (Directional Light) */}
      <directionalLight
        position={[-10, 15, 10]} // Position of the sun
        color="#FFD700" // Warm yellow color
        intensity={1.5}
        castShadow
      />
    </>
  );
}

export default Sun;
