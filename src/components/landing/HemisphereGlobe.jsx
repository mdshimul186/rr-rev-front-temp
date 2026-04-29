/* eslint-disable react/no-unknown-property */
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const GlobePoints = ({ count = 100 }) => {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      temp.push({
        position: new THREE.Vector3().setFromSphericalCoords(2.5, phi, theta),
        scale: 0.02 + Math.random() * 0.03,
        speed: 0.5 + Math.random() * 0.5,
        offset: Math.random() * Math.PI * 2,
      });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    particles.forEach((particle, i) => {
      const { position, scale, speed, offset } = particle;
      const pulseScale = scale * (0.8 + 0.2 * Math.sin(time * speed + offset));
      dummy.position.copy(position);
      dummy.scale.setScalar(pulseScale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#ff6833" transparent opacity={0.8} />
    </instancedMesh>
  );
};

const HemisphereGlobeMesh = () => {
  const groupRef = useRef();
  
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  const hemisphereGeometry = useMemo(() => {
    const geometry = new THREE.SphereGeometry(2.5, 64, 64, 0, Math.PI * 2, 0, Math.PI / 2);
    return geometry;
  }, []);

  const continentsData = useMemo(() => {
    const points = [];
    for (let i = 0; i < 50; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * (Math.PI / 2);
      const r = 2.52;
      points.push({
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.cos(phi),
        z: r * Math.sin(phi) * Math.sin(theta),
        scale: 0.03 + Math.random() * 0.05,
      });
    }
    return points;
  }, []);

  return (
    <group ref={groupRef}>
      <mesh geometry={hemisphereGeometry}>
        <meshStandardMaterial
          color="#0a3d62"
          metalness={0.3}
          roughness={0.7}
          transparent
          opacity={0.9}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[2.55, 64, 64]} />
        <meshStandardMaterial
          color="#0e83db"
          metalness={0.5}
          roughness={0.3}
          transparent
          opacity={0.2}
          wireframe
        />
      </mesh>
      <GlobePoints count={100} />
      {continentsData.map((point, i) => (
        <mesh key={i} position={[point.x, point.y, point.z]} scale={point.scale}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color="#ff6833" transparent opacity={0.9} />
        </mesh>
      ))}
    </group>
  );
};

const HemisphereGlobe = ({ width = '100%', height = '100%' }) => {
  return (
    <div style={{ width, height, position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#0e83db" />
        <HemisphereGlobeMesh />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={true}
          autoRotate
          autoRotateSpeed={0.5}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
};

export default HemisphereGlobe;
