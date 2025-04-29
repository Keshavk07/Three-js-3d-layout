import { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';

function Cloud({ position, image }) {
  const cloudRef = useRef();
  const texture = useLoader(TextureLoader, image); // use prop image here

  // Define a constant speed for smooth cloud movement
  const speed = 0.002;  // Adjust this value for desired cloud movement speed

  useFrame(() => {
    if (cloudRef.current) {
      // Smooth movement across the X-axis
      cloudRef.current.position.x += speed;
      
      // Wrap around effect (loop back to the left when it moves off the screen)
      if (cloudRef.current.position.x > 10) {
        cloudRef.current.position.x = -10;
      }
    }
  });

  return (
    <mesh position={position} ref={cloudRef} scale={[3.5, 3.5, 2]}>
      <planeGeometry args={[3, 2]} />
      <meshStandardMaterial
        map={texture}
        transparent
        opacity={0.9}
        depthWrite={false}
      />
    </mesh>
  );
}

export default Cloud;
