import { useRef, Suspense, useMemo } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { MeshReflectorMaterial, Environment } from '@react-three/drei';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import {
  EffectComposer,
  Bloom,
  Vignette,
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

// ─── Shared scroll state ───────────────────────────────────────────────────────
const scroll = { value: 0 };
if (typeof window !== 'undefined') {
  window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    scroll.value = max > 0 ? window.scrollY / max : 0;
  }, { passive: true });
}

// ─── Mobile detection ─────────────────────────────────────────────────────────
const IS_MOBILE =
  typeof window !== 'undefined' &&
  (window.innerWidth / window.innerHeight < 1.1 || window.innerWidth < 768);

// ─── Star field (shared) ──────────────────────────────────────────────────────
const STAR_COUNT = IS_MOBILE ? 600 : 2000;
const starPositions = (() => {
  const pos = new Float32Array(STAR_COUNT * 3);
  for (let i = 0; i < STAR_COUNT; i++) {
    pos[i * 3]     = (Math.random() - 0.5) * 200;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 120;
    pos[i * 3 + 2] = -5 - Math.random() * 80;
  }
  return pos;
})();

function StarField() {
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[starPositions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#b8d4ff"
        size={IS_MOBILE ? 0.1 : 0.07}
        sizeAttenuation
        transparent
        opacity={0.85}
        toneMapped={false}
      />
    </points>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  MOBILE SCENE — glowing solid AIS text + stars, no complexity
// ══════════════════════════════════════════════════════════════════════════════

function MobileAISText() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const font = useLoader(FontLoader, '/fonts/helvetiker_bold.typeface.json') as any;
  const { viewport } = useThree();
  const meshRef = useRef<THREE.Mesh>(null);

  // Scale font to fill ~80% of portrait screen width
  const fontSize = viewport.aspect < 0.8 ? 2.8 : 3.8;

  const geometry = useMemo(() => {
    const shapes: THREE.Shape[] = font.generateShapes('AIS', fontSize);
    const geo = new THREE.ExtrudeGeometry(shapes, {
      depth: 0.55,
      bevelEnabled: true,
      bevelSize: 0.07,
      bevelThickness: 0.07,
      bevelSegments: 2,
    });
    geo.computeBoundingBox();
    const box = geo.boundingBox!;
    const cx = (box.min.x + box.max.x) / 2;
    const cy = (box.min.y + box.max.y) / 2;
    geo.translate(-cx, -cy, -0.28);
    return geo;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [font, fontSize]);

  // Subtle breathing pulse
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1.1 + Math.sin(clock.elapsedTime * 0.9) * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial
        color="#030B20"
        emissive="#1850F5"
        emissiveIntensity={1.1}
        metalness={0.96}
        roughness={0.08}
        toneMapped={false}
      />
    </mesh>
  );
}

function MobileCameraController() {
  useFrame(({ camera }) => {
    const s = scroll.value;
    // Gentle drift toward the text, no dramatic fly-through on mobile
    const tZ = 11 - s * 5;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, tZ, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0, 0.04);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function MobileScene() {
  return (
    <>
      <color attach="background" args={['#020610']} />
      <ambientLight intensity={0.06} color="#050A20" />

      <StarField />

      {/* Front-left key light — catches metallic face */}
      <spotLight
        position={[-3, 5, 9]} intensity={18} color="#AACCFF"
        angle={Math.PI / 9} penumbra={0.5} distance={28} decay={2}
      />
      {/* Back rim — brightens bevel edges with blue glow */}
      <spotLight
        position={[0, 3, -7]} intensity={14} color="#2255FF"
        angle={Math.PI / 6} penumbra={0.6} distance={20} decay={2}
      />
      {/* Subtle right fill */}
      <pointLight position={[5, 0, 4]} intensity={6} color="#8AAEFF" distance={18} decay={2} />

      <Suspense fallback={null}>
        <MobileAISText />
      </Suspense>

      <MobileCameraController />
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  DESKTOP SCENE — cinematic portal wall (space visible through AIS holes)
// ══════════════════════════════════════════════════════════════════════════════

function Moons() {
  return (
    <group position={[0, 0, -45]}>
      <mesh position={[-14, 8, 0]}>
        <sphereGeometry args={[4.0, 16, 16]} />
        <meshBasicMaterial color="#FFFFFF" toneMapped={false} />
      </mesh>
      <pointLight position={[-14, 8, 0]} color="#44AAFF" intensity={3000} distance={120} decay={1.5} />

      <mesh position={[14, -4, 10]}>
        <sphereGeometry args={[5.0, 16, 16]} />
        <meshStandardMaterial color="#2B1A60" emissive="#150840" emissiveIntensity={1.2} roughness={0.8} />
      </mesh>
      <pointLight position={[14, -4, 10]} color="#6622FF" intensity={1500} distance={100} decay={2.0} />

      <pointLight position={[0, 0, -20]} color="#0055FF" intensity={2000} distance={150} decay={1.5} />
    </group>
  );
}

function CorridorRoom() {
  const mat = (
    <meshPhysicalMaterial color="#060C1A" metalness={0.8} roughness={0.45} envMapIntensity={0.4} />
  );
  return (
    <group>
      <mesh position={[-22, 1, 2]}><boxGeometry args={[0.6, 28, 38]} />{mat}</mesh>
      <mesh position={[22, 1, 2]}><boxGeometry args={[0.6, 28, 38]} />{mat}</mesh>
      <mesh position={[0, 13, 2]}><boxGeometry args={[46, 0.6, 38]} />{mat}</mesh>
    </group>
  );
}

function NeonFloorStrip() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 2.6 + Math.sin(clock.elapsedTime * 1.8) * 0.4;
    }
  });
  return (
    <group position={[0, -8.55, 0]}>
      <mesh ref={meshRef} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[44, 1.2]} />
        <meshStandardMaterial color="#00CCFF" emissive="#00AAFF" emissiveIntensity={3.0} toneMapped={false} />
      </mesh>
      <pointLight color="#00BBFF" intensity={80} distance={18} decay={1.8} position={[0, 0.5, 0]} />
      <pointLight color="#00BBFF" intensity={50} distance={12} decay={1.5} position={[-12, 0.5, 0]} />
      <pointLight color="#00BBFF" intensity={50} distance={12} decay={1.5} position={[12, 0.5, 0]} />
      <pointLight color="#003E88" intensity={30} distance={25} decay={2} position={[0, -1, 0]} />
    </group>
  );
}

function PortalWall() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const font = useLoader(FontLoader, '/fonts/helvetiker_bold.typeface.json') as any;

  const geometry = useMemo(() => {
    const fontSize = 5.5;
    const shapes: THREE.Shape[] = font.generateShapes('AIS', fontSize);

    const bb = new THREE.Box2();
    shapes.forEach(s => s.getPoints(10).forEach(p => bb.expandByPoint(p)));
    const cx = (bb.min.x + bb.max.x) / 2;
    const cy = (bb.min.y + bb.max.y) / 2;

    const W = 150, H = 100;
    const wallShape = new THREE.Shape([
      new THREE.Vector2(-W / 2 + cx, -H / 2 + cy),
      new THREE.Vector2( W / 2 + cx, -H / 2 + cy),
      new THREE.Vector2( W / 2 + cx,  H / 2 + cy),
      new THREE.Vector2(-W / 2 + cx,  H / 2 + cy),
    ]);
    shapes.forEach(shape => {
      wallShape.holes.push(new THREE.Path(shape.getPoints(10)));
    });

    const geo = new THREE.ExtrudeGeometry(wallShape, {
      depth: 3.5,
      bevelEnabled: true,
      bevelSize: 0.12,
      bevelThickness: 0.2,
      bevelSegments: 10,
    });
    geo.translate(-cx, -cy, -1.75);
    return geo;
  }, [font]);

  return (
    <mesh geometry={geometry} position={[0, -1.5, -1]} castShadow receiveShadow>
      <meshPhysicalMaterial
        color="#07101F"
        metalness={0.92}
        roughness={0.2}
        clearcoat={0.7}
        clearcoatRoughness={0.1}
        envMapIntensity={0.8}
        side={THREE.FrontSide}
      />
    </mesh>
  );
}

function DesktopFloor() {
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, -8.6, 0]} receiveShadow>
      <planeGeometry args={[150, 80]} />
      <MeshReflectorMaterial
        blur={[300, 80]}
        resolution={512}
        mixBlur={0.6}
        mixStrength={120}
        roughness={0.75}
        depthScale={1.1}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#030810"
        metalness={0.95}
        mirror={0.9}
      />
    </mesh>
  );
}

function DesktopCameraController() {
  useFrame(({ camera }) => {
    const s = scroll.value;
    const e = s < 0.5 ? 2 * s * s : 1 - Math.pow(-2 * s + 2, 2) / 2;
    const tZ = 18 - e * 68;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, tZ, 0.055);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, -1.5, 0.055);
    camera.rotation.z = THREE.MathUtils.lerp(camera.rotation.z, e * -0.015, 0.04);
    camera.lookAt(0, -1.5, camera.position.z - 10);
  });
  return null;
}

function DesktopScene() {
  return (
    <>
      <Environment preset="night" />
      <StarField />
      <Moons />
      <CorridorRoom />

      <ambientLight intensity={0.015} color="#000510" />
      <spotLight position={[-6, 8, 14]} intensity={60} color="#C8DFFF"
        angle={Math.PI / 10} penumbra={0.3} distance={40} decay={2}
        castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
      />
      <spotLight position={[0, 6, -14]} intensity={50} color="#00BBFF"
        angle={Math.PI / 7} penumbra={0.55} distance={35} decay={2}
      />
      <spotLight position={[9, 5, -8]} intensity={25} color="#0088CC"
        angle={Math.PI / 8} penumbra={0.6} distance={28} decay={2}
      />

      <NeonFloorStrip />
      <Suspense fallback={null}>
        <PortalWall />
      </Suspense>
      <DesktopFloor />
      <DesktopCameraController />

      <EffectComposer>
        <Bloom luminanceThreshold={0.12} mipmapBlur intensity={1.2} radius={0.6} />
        <Vignette offset={0.18} darkness={0.95} blendFunction={BlendFunction.NORMAL} />
      </EffectComposer>
    </>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function HeroScene() {
  return IS_MOBILE ? <MobileScene /> : <DesktopScene />;
}
