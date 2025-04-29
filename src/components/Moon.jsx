import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

function Moon({ position }) {
  const moonRef = useRef();

  // Animate the moon's position for night
  useFrame(() => {
    if (moonRef.current) {
      const time = Date.now() * 0.0001;
      moonRef.current.position.x = Math.sin(time) * 10;  // Horizontal movement
      moonRef.current.position.y = Math.cos(time) * 5;   // Vertical movement
    }
  });

  return (
    <mesh position={position} ref={moonRef}>
      <sphereGeometry args={[2]} />
      <meshStandardMaterial emissive="silver" emissiveIntensity={1.5} />
    </mesh>
  );
}

export default Moon;
