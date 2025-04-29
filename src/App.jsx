import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';  // Import THREE for materials

// Cloud image paths
import cloud1 from './assets/cloud1.png';
import cloud2 from './assets/cloud2.png';
import cloud3 from './assets/cloud3.png';
import butterflyTexture from './assets/butterfly.jpg';  // Add butterfly texture import

// Trunk texture (use a realistic bark texture for better realism)
import barkTexture from './assets/barkTexture.jpg'; 
import leavesTexture from './assets/leavesTexture.jpg';

function Mountain({ position = [0, 1, -30], scale = [1, 1.5, 1] }) {
  return (
    <group position={position} scale={scale}>
      {/* Base Layer */}
      <mesh position={[0, 0, 0]}>
        <coneGeometry args={[12, 10, 8]} />
        <meshStandardMaterial color="#5C4033" />
      </mesh>

      {/* Middle smaller layer */}
      <mesh position={[0, 5, 0]}>
        <coneGeometry args={[8, 6, 8]} />
        <meshStandardMaterial color="#4A3623" />
      </mesh>

      {/* Snowy peak */}
      <mesh position={[0, 8, 0]}>
        <coneGeometry args={[3, 4, 6]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}









function Butterfly() {
  const butterflyRef = useRef();
  const [movement, setMovement] = useState({ x: 0, y: 0, z: 0 });
  const speed = 0.5;

  // Keyboard controls to move the butterfly
  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowUp':
        setMovement((prev) => ({ ...prev, y: prev.y + speed }));
        break;
      case 'ArrowDown':
        setMovement((prev) => ({ ...prev, y: prev.y - speed }));
        break;
      case 'ArrowLeft':
        setMovement((prev) => ({ ...prev, x: prev.x - speed }));
        break;
      case 'ArrowRight':
        setMovement((prev) => ({ ...prev, x: prev.x + speed }));
        break;
      case 'w':
        setMovement((prev) => ({ ...prev, z: prev.z + speed }));
        break;
      case 's':
        setMovement((prev) => ({ ...prev, z: prev.z - speed }));
        break;
      default:
        break;
    }
  };

  // Add event listener on mount and cleanup on unmount
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Animate the butterfly based on the movement state
  useFrame(() => {
    if (butterflyRef.current) {
      // Keep butterfly above the platform (e.g., y position stays positive)
      butterflyRef.current.position.x += movement.x;
      butterflyRef.current.position.y = Math.max(butterflyRef.current.position.y + movement.y, 1); // Keep it above the platform
      butterflyRef.current.position.z += movement.z;
    }
  });

  return (
    <mesh ref={butterflyRef} position={[0, 5, 5]}> {/* Start above the platform */}
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={new THREE.TextureLoader().load(butterflyTexture)} transparent />
    </mesh>
  );
}




// Cloud Component
function Tree({ position, scale = 1 }) {
  const trunkRef = useRef();
  const leavesRef = useRef();

  useFrame((state) => {
    if (trunkRef.current && leavesRef.current) {
      const time = state.clock.elapsedTime;
      trunkRef.current.rotation.y = Math.sin(time * 0.5) * 0.05;
      leavesRef.current.rotation.y = Math.sin(time * 0.5) * 0.1;
    }
  });

  // Proportional dimensions
  const trunkHeight = 5 * scale;
  const trunkRadius = 0.3 * scale;

  const lowerLeavesRadius = 2.5 * scale;
  const midLeavesRadius = 2 * scale;
  const topLeavesRadius = 1.5 * scale;

  const branchLength = 2 * scale;
  const branchRadius = 0.1 * scale;

  return (
    <group position={position}>
      {/* Trunk */}
      <mesh ref={trunkRef} position={[0, trunkHeight / 2, 0]}>
        <cylinderGeometry args={[trunkRadius, trunkRadius, trunkHeight, 16]} />
        <meshStandardMaterial map={new THREE.TextureLoader().load(barkTexture)} />
      </mesh>

      {/* Leaves */}
      <group ref={leavesRef} position={[0, trunkHeight, 0]}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[lowerLeavesRadius, 16, 16]} />
          <meshStandardMaterial
            map={new THREE.TextureLoader().load(leavesTexture)}
            transparent
            opacity={0.8}
          />
        </mesh>
        <mesh position={[0, 2 * scale, 0]}>
          <sphereGeometry args={[midLeavesRadius, 12, 12]} />
          <meshStandardMaterial
            map={new THREE.TextureLoader().load(leavesTexture)}
            transparent
            opacity={0.7}
          />
        </mesh>
        <mesh position={[0, 4 * scale, 0]}>
          <sphereGeometry args={[topLeavesRadius, 8, 8]} />
          <meshStandardMaterial
            map={new THREE.TextureLoader().load(leavesTexture)}
            transparent
            opacity={0.6}
          />
        </mesh>
      </group>

      {/* Branches */}
      <mesh position={[0.5 * scale, trunkHeight * 0.6, 0]} rotation={[Math.PI / 6, 0, 0]}>
        <cylinderGeometry args={[branchRadius, branchRadius, branchLength, 8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh position={[-0.5 * scale, trunkHeight * 0.6, 0]} rotation={[-Math.PI / 6, 0, 0]}>
        <cylinderGeometry args={[branchRadius, branchRadius, branchLength, 8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
    </group>
  );
}








// Flower component with smooth blooming and dying animation
function Flower({ position }) {
  const flowerRef = useRef();
  const [scaleFactor, setScaleFactor] = useState(1);

  useEffect(() => {
    // Set an interval to animate the flower continuously
    const timer = setInterval(() => {
      setScaleFactor((prev) => (prev === 1 ? 3 : 1));  // Toggle between 1 and 2 for blooming and fading
    }, 5000);  // Adjust this value for how long the bloom or fade lasts

    return () => clearInterval(timer); // Cleanup interval on unmount
  }, []);

  useFrame(() => {
    if (flowerRef.current) {
      // Animate blooming and fading in a loop
      const scale = Math.sin(Date.now() * 0.001) * (scaleFactor - 1) + 1.5; // Smooth transition between 1 and 2
      flowerRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group ref={flowerRef} position={position}>
      {/* Stem */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.6, 8]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>

      {/* Petals (multiple small spheres around a center) */}
      <mesh position={[0, 0.65, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#FF69B4" />
      </mesh>
      <mesh position={[0.1, 0.65, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#FF69B4" />
      </mesh>
      <mesh position={[-0.1, 0.65, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#FF69B4" />
      </mesh>
      <mesh position={[0, 0.65, 0.1]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#FF69B4" />
      </mesh>
      <mesh position={[0, 0.65, -0.1]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#FF69B4" />
      </mesh>

      {/* Flower Center */}
      <mesh position={[0, 0.65, 0]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>
    </group>
  );
}

function Cloud({ position, image }) {
  const cloudRef = useRef();
  const texture = new THREE.TextureLoader().load(image);

  const GROUND_Y = 0; // set this to your actual ground level
  const RAIN_START_Y = 15; // Fixed height for raindrops

  const [raindrops] = useState(() => {
    return Array.from({ length: 100 }, () => ({
      x: Math.random() * 4 - 2,
      y: RAIN_START_Y, // Fixed height for all raindrops
      z: Math.random() * 4 - 2,
      speed: 0.1 + Math.random() * 0.2
    }));
  });

  const dropsRef = useRef([]);

  useFrame((state, delta) => {
    if (cloudRef.current) {
      const cloudY = cloudRef.current.position.y;

      // Animate cloud floating
      cloudRef.current.position.x += Math.sin(state.clock.elapsedTime * 0.1) * 0.001;

      // Animate each raindrop
      dropsRef.current.forEach((drop, i) => {
        if (drop) {
          drop.position.y -= drop.speed; // fall speed

          // Reset if it falls below ground
          if (drop.position.y < GROUND_Y) {
            drop.position.y = RAIN_START_Y; // Reset to fixed height
          }
        }
      });
    }
  });

  return (
    <group ref={cloudRef} position={position}>
      {/* Cloud plane */}
      <mesh>
        <planeGeometry args={[4, 2]} />
        <meshStandardMaterial map={texture} transparent opacity={0.9} />
      </mesh>

      {/* Raindrops */}
      {raindrops.map((drop, i) => (
        <mesh
          key={i}
          ref={(el) => (dropsRef.current[i] = el)}
          position={[drop.x, drop.y, drop.z]}
        >
          <sphereGeometry args={[0.03, 6, 6]} />
          <meshStandardMaterial color="#00aaff" transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
}


// Sun Component
function Sun() {
  return (
    <mesh position={[10, 20, -25]}>
      <sphereGeometry args={[5, 36, 36]} />
      <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={1} />
    </mesh>
  );
}

function App() {

  const flowerPositions = Array.from({ length: 100 }, () => {
    const x = (Math.random() - 0.5) * 20;
    const z = (Math.random() - 0.5) * 20;
    return [x, 1, z];
  });
  
  return (
    <Canvas
  camera={{ position: [0, 15, 35], fov: 60, near: 0.1, far: 1000 }}
  gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
  style={{ width: '100%', height: '100vh' }}
>

<Butterfly />
<fog attach="fog" args={['#87CEEB', 40, 150]} />

      <color attach="background" args={['#87CEEB']} /> {/* Sky blue for day */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />

      {/* Add the Sun component */}
      <Sun />
      <Tree position={[-5, 3, 0]} />
      <Tree position={[0, 3, 5]} />
      <Tree position={[5, 3, -2]} />
      <Tree position={[5, 4, 4]} />
      <Tree position={[-7, 4, 4]} />
      <Tree position={[-10, 3, 7]} />

      {/* Add the Mountains */}
      <Mountain position={[0, 1, -20]} scale={[2, 2.2, 2]} />
<Mountain position={[-15, 1, -18]} scale={[1.5, 1.7, 1.5]} />
<Mountain position={[15, 1, -19]} scale={[1.8, 2, 1.8]} />

      {/* Add the Clouds */}
      <Cloud position={[-4, 18, -5]} image={cloud1} />
      <Cloud position={[0, 18, -3]} image={cloud2} />
      <Cloud position={[3, 17, -1]} image={cloud3} />
      <Cloud position={[-4, 17.5, -4]} image={cloud3} />
      <Cloud position={[3, 17, -4]} image={cloud3} />
      <Cloud position={[-2, 16, -3]} image={cloud1} />
      <Cloud position={[-6, 18, -3]} image={cloud1} />
      <Cloud position={[-7, 13, -3]} image={cloud1} />
      <Cloud position={[5, 17, 1]} image={cloud2} />
      <Cloud position={[-6, 11, -4]} image={cloud3} />
      <Cloud position={[3, 12, -4]} image={cloud3} />
      <Cloud position={[5, 16, 1]} image={cloud2} />
      <Cloud position={[-5, 16, 1]} image={cloud2} />
      <Cloud position={[-5, 14, 1]} image={cloud2} />



   {/* Add the flowers */}
   {flowerPositions.map((pos, index) => (
        <Flower key={index} position={pos} />
      ))}


      {/* Create a thick cuboid platform above the clouds */}
      <mesh position={[0, 0, 0]}>
  <boxGeometry args={[80, 2, 80]} />
  <meshStandardMaterial
    color="#228B22"
    roughness={0.2}
    metalness={0.1}
    reflectivity={1}
  />
</mesh>



      <OrbitControls />
    </Canvas>
  );
}

export default App;
