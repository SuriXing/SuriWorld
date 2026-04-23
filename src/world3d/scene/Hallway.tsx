import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Edges } from '@react-three/drei';
import { ROOM, GAP, FLOOR_Y } from '../constants';
import { useWorldStore } from '../store/worldStore';

const HALL_COLOR = '#1e2233';
const HALL_LEN = ROOM * 2 + GAP * 2 + 1;
const HALL_WIDTH = GAP * 2;

// R4.1: 4 doorway threshold patches DELETED. Closed-volume Room.tsx now
// extends each room's floor 0.20u toward the corridor, so the room floor
// tile-meets the hallway X-arm with a small overlap at the doorway. No
// gap → no need for the per-doorway tinted patches.

// Ceiling beams + tint pool deleted with the wood-blocks-in-corridor pass.

interface PlantProps {
  x: number;
  z: number;
  groupRef?: (el: THREE.Group | null) => void;
}

function Plant({ x, z, groupRef }: PlantProps) {
  return (
    <group position={[x, 0, z]}>
      {/* Pot (static, anchored) */}
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.15, 0.12, 0.25, 8]} />
        <meshPhongMaterial color="#cc7744" flatShading />
      </mesh>
      <mesh position={[0, 0.38, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 0.03, 8]} />
        <meshPhongMaterial color="#4a3520" flatShading />
      </mesh>
      {/* Foliage group — F3.21: refs the sway pivot. Pivots at top of pot
          (y=0.4) so the foliage rocks like a real stem instead of orbiting. */}
      <group ref={groupRef} position={[0, 0.4, 0]}>
        <mesh position={[0, 0.2, 0]}>
          <sphereGeometry args={[0.22, 6, 6]} />
          <meshPhongMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.15} flatShading />
        </mesh>
        <mesh position={[0.08, 0.38, 0]}>
          <sphereGeometry args={[0.15, 6, 6]} />
          <meshPhongMaterial color="#16a34a" emissive="#22c55e" emissiveIntensity={0.1} flatShading />
        </mesh>
        <mesh position={[-0.05, 0.45, 0.05]}>
          <coneGeometry args={[0.12, 0.25, 6]} />
          <meshPhongMaterial color="#15803d" flatShading />
        </mesh>
      </group>
    </group>
  );
}

const STEAM_OFFSETS: ReadonlyArray<readonly [number, number, number]> = [
  [-0.05, 0.85, 0],
  [0.03, 0.95, 0],
  [-0.02, 1.05, 0],
];

// Per-plant sway phase offsets (module scope = baked once, no useMemo needed).
const PLANT_PHASES: ReadonlyArray<number> = [0, Math.PI * 0.5, Math.PI, Math.PI * 1.5];

// Inner-x / inner-z room walls form the corridor side walls (the ones
// without doors). Mount stylized "art" frames on them. Each frame is a
// chunky outer plate + a brighter inner canvas with a tiny abstract motif.
// Procedural primitives only — no textures, no GLTF.
interface WallArtProps {
  /** World-space center of the FRAME face. */
  x: number;
  y: number;
  z: number;
  /** Wall normal axis: 'x' = mounted on a wall whose normal is ±x. */
  axis: 'x' | 'z';
  /** Which side of the wall the art face points to (sign of normal). */
  facing: 1 | -1;
  width: number;
  height: number;
  /** Frame (mat) hex. */
  frameColor: string;
  /** Canvas (art) hex. */
  artColor: string;
  /** Optional accent color for the simple abstract motif. */
  motifColor?: string;
  /** Motif kind — keeps each frame visually distinct. */
  motif?: 'circle' | 'stripes' | 'cross' | 'square';
}

function WallArt({
  x, y, z, axis, facing, width, height,
  frameColor, artColor, motifColor, motif = 'circle',
}: WallArtProps) {
  const FRAME_T = 0.04;       // total frame thickness off the wall
  const MAT = 0.08;           // mat (visible frame border) on each side
  // Box args follow the wall orientation.
  const frameArgs: [number, number, number] = axis === 'x'
    ? [FRAME_T, height, width]
    : [width, height, FRAME_T];
  const canvasArgs: [number, number, number] = axis === 'x'
    ? [FRAME_T * 0.5, height - MAT * 2, width - MAT * 2]
    : [width - MAT * 2, height - MAT * 2, FRAME_T * 0.5];
  // Push the canvas slightly proud of the frame, on the facing side.
  const canvasOffset = (FRAME_T * 0.5 + 0.001) * facing;
  const canvasPos: [number, number, number] = axis === 'x'
    ? [x + canvasOffset, y, z]
    : [x, y, z + canvasOffset];
  // Motif sits another hair proud of the canvas.
  const motifOffset = canvasOffset + 0.002 * facing;
  const motifPos: [number, number, number] = axis === 'x'
    ? [x + motifOffset, y, z]
    : [x, y, z + motifOffset];

  return (
    <group>
      {/* Outer frame (mat) */}
      <mesh position={[x, y, z]}>
        <boxGeometry args={frameArgs} />
        <meshPhongMaterial color={frameColor} flatShading />
      </mesh>
      {/* Canvas */}
      <mesh position={canvasPos}>
        <boxGeometry args={canvasArgs} />
        <meshPhongMaterial
          color={artColor}
          emissive={artColor}
          emissiveIntensity={0.18}
          flatShading
        />
      </mesh>
      {/* Tiny abstract motif so each piece reads as "art", not a swatch. */}
      {motifColor && motif === 'circle' && (
        <mesh position={motifPos} rotation={axis === 'x' ? [0, Math.PI / 2, 0] : [0, 0, 0]}>
          <cylinderGeometry args={[Math.min(width, height) * 0.22, Math.min(width, height) * 0.22, 0.005, 24]} />
          <meshPhongMaterial color={motifColor} emissive={motifColor} emissiveIntensity={0.3} flatShading />
        </mesh>
      )}
      {motifColor && motif === 'square' && (
        <mesh position={motifPos}>
          <boxGeometry args={axis === 'x' ? [0.005, height * 0.45, width * 0.45] : [width * 0.45, height * 0.45, 0.005]} />
          <meshPhongMaterial color={motifColor} emissive={motifColor} emissiveIntensity={0.3} flatShading />
        </mesh>
      )}
      {motifColor && motif === 'stripes' && [-0.25, 0, 0.25].map((o, i) => (
        <mesh key={i} position={axis === 'x' ? [motifPos[0], y, z + o * width] : [x + o * width, y, motifPos[2]]}>
          <boxGeometry args={axis === 'x' ? [0.005, height * 0.55, width * 0.10] : [width * 0.10, height * 0.55, 0.005]} />
          <meshPhongMaterial color={motifColor} emissive={motifColor} emissiveIntensity={0.3} flatShading />
        </mesh>
      ))}
      {motifColor && motif === 'cross' && (
        <group>
          <mesh position={motifPos}>
            <boxGeometry args={axis === 'x' ? [0.005, height * 0.6, width * 0.12] : [width * 0.12, height * 0.6, 0.005]} />
            <meshPhongMaterial color={motifColor} emissive={motifColor} emissiveIntensity={0.3} flatShading />
          </mesh>
          <mesh position={motifPos}>
            <boxGeometry args={axis === 'x' ? [0.005, height * 0.12, width * 0.6] : [width * 0.6, height * 0.12, 0.005]} />
            <meshPhongMaterial color={motifColor} emissive={motifColor} emissiveIntensity={0.3} flatShading />
          </mesh>
        </group>
      )}
    </group>
  );
}

// 8 frames — 2 per corridor arm (one per side wall). Mounted at eye-ish
// height (y ≈ 1.25). Wall surface sits at ±(GAP + 0.05) = ±1.25; place the
// frame center 0.05 inboard so the back of the frame just kisses the wall.
const ART_Y = 1.25;
const ART_INSET = 1.20; // 1.25 wall − 0.05 = inboard center
const ART_PIECES: ReadonlyArray<Omit<WallArtProps, 'y'>> = [
  // +z arm (looking up from origin) — left wall (book room inner-x at x=-1.25), right wall (idealab at x=+1.25)
  { x: -ART_INSET, z: 2.4, axis: 'x', facing: 1,  width: 0.95, height: 0.7, frameColor: '#3a2410', artColor: '#f4a8b8', motifColor: '#9f1239', motif: 'circle' },
  { x:  ART_INSET, z: 2.4, axis: 'x', facing: -1, width: 0.95, height: 0.7, frameColor: '#3a2410', artColor: '#fde68a', motifColor: '#a16207', motif: 'stripes' },
  // -z arm — left wall (myroom at x=-1.25), right wall (product at x=+1.25)
  { x: -ART_INSET, z: -2.4, axis: 'x', facing: 1,  width: 0.95, height: 0.7, frameColor: '#3a2410', artColor: '#a78bfa', motifColor: '#4c1d95', motif: 'cross' },
  { x:  ART_INSET, z: -2.4, axis: 'x', facing: -1, width: 0.95, height: 0.7, frameColor: '#3a2410', artColor: '#7dd3fc', motifColor: '#0c4a6e', motif: 'square' },
  // +x arm — back wall (idealab at z=+1.25), front wall (product at z=-1.25)
  { x: 2.4, z:  ART_INSET, axis: 'z', facing: -1, width: 0.95, height: 0.7, frameColor: '#3a2410', artColor: '#fca5a5', motifColor: '#7f1d1d', motif: 'stripes' },
  { x: 2.4, z: -ART_INSET, axis: 'z', facing: 1,  width: 0.95, height: 0.7, frameColor: '#3a2410', artColor: '#86efac', motifColor: '#14532d', motif: 'circle' },
  // -x arm — back wall (book at z=+1.25), front wall (myroom at z=-1.25)
  { x: -2.4, z:  ART_INSET, axis: 'z', facing: -1, width: 0.95, height: 0.7, frameColor: '#3a2410', artColor: '#fed7aa', motifColor: '#9a3412', motif: 'square' },
  { x: -2.4, z: -ART_INSET, axis: 'z', facing: 1,  width: 0.95, height: 0.7, frameColor: '#3a2410', artColor: '#bae6fd', motifColor: '#075985', motif: 'cross' },
];

export function Hallway() {
  const steamRef = useRef<THREE.Group>(null);
  // F3.21 idle loops: plant sway groups (4 plants) + beam-dust mote refs.
  const plantRefs = useRef<Array<THREE.Group | null>>([null, null, null, null]);
  const dustMoteRef = useRef<THREE.Mesh>(null);
  const runnerRefs = useRef<Array<THREE.Mesh | null>>([null, null]);
  const theme = useWorldStore((s) => s.theme);
  const edgeColor = theme === 'dark' ? '#0a0a14' : '#5a4830';

  useFrame(({ clock }) => {
    // Hallway is only visible in the overview; inside a room we don't
    // render it, so skip the idle-loop work.
    if (useWorldStore.getState().viewMode !== 'overview') return;
    const t = clock.getElapsedTime();

    // ----- Steam — position bob ONLY. Opacity drift removed in the
    //       zero-brightness-motion pass. -----
    const g = steamRef.current;
    if (g) {
      const children = g.children;
      const n = children.length;
      for (let i = 0; i < n; i++) {
        const child = children[i];
        child.position.y = STEAM_OFFSETS[i][1] + Math.sin(t * 2 + i) * 0.05;
      }
    }

    // ----- Plant sway — was ±0.02 rad (invisible). Bumped to ±0.06 rad
    //       at 0.7 rad/s with per-plant phase offsets. Reads as actual sway. -----
    const plants = plantRefs.current;
    for (let i = 0; i < 4; i++) {
      const p = plants[i];
      if (!p) continue;
      p.rotation.z = Math.sin(t * 0.7 + PLANT_PHASES[i]) * 0.06;
    }

    // ----- Beam dust drift (idle loop #3) — Y bob only. Opacity pulse
    //       removed (transparent mesh alpha flicker). -----
    const dust = dustMoteRef.current;
    if (dust) {
      dust.position.y = 2.55 + Math.sin(t * 0.7) * 0.08;
    }

    // ----- Runner rug pulse (idle loop #4) — subtle ±1% scale breathing.
    //       Uses scale.x only (scalar write, zero alloc). -----
    const runners = runnerRefs.current;
    const pulse = 1 + Math.sin(t * 0.6) * 0.01;
    for (let i = 0; i < 2; i++) {
      const r = runners[i];
      if (!r) continue;
      r.scale.x = pulse;
    }
  });

  return (
    <group>
      {/* Hallway floor cross — F3.19: de-emissived to restore lantern visual authority */}
      <mesh position={[0, FLOOR_Y - 0.02, 0]}>
        <boxGeometry args={[HALL_WIDTH, 0.08, HALL_LEN]} />
        <meshPhongMaterial color={HALL_COLOR} flatShading />
      </mesh>
      <mesh position={[0, FLOOR_Y - 0.02, 0]}>
        <boxGeometry args={[HALL_LEN, 0.08, HALL_WIDTH]} />
        <meshPhongMaterial color={HALL_COLOR} flatShading />
      </mesh>

      {/* R4.1: doorway threshold patches DELETED. Room.tsx floor extends
          0.20u into the corridor so the floors tile-meet at every doorway. */}

      {/* Coffee machine */}
      <mesh position={[-1.5, 0.42, 0]}>
        <boxGeometry args={[0.4, 0.6, 0.35]} />
        <meshPhongMaterial color="#222222" flatShading />
      </mesh>
      <mesh position={[-1.5, 0.75, 0]}>
        <boxGeometry args={[0.38, 0.1, 0.33]} />
        <meshPhongMaterial color="#333333" flatShading />
      </mesh>
      <mesh position={[-1.5, 0.55, 0.18]}>
        <boxGeometry args={[0.06, 0.06, 0.01]} />
        <meshPhongMaterial color="#e94560" emissive="#e94560" emissiveIntensity={3.0} flatShading />
      </mesh>

      {/* Steam */}
      <group ref={steamRef} position={[-1.5, 0, 0]}>
        {STEAM_OFFSETS.map((p, i) => (
          <mesh key={i} position={[...p]}>
            <boxGeometry args={[0.03, 0.03, 0.03]} />
            <meshPhongMaterial color="#ffffff" transparent opacity={0.3} flatShading />
          </mesh>
        ))}
      </group>

      {/* Plants — intersection corners (2x2). F3.21: each foliage group is
          ref'd into plantRefs so useFrame can sway it ±0.02 rad. */}
      <Plant x={1.3} z={-0.5} groupRef={(el) => { plantRefs.current[0] = el; }} />
      <Plant x={1.5} z={0.6} groupRef={(el) => { plantRefs.current[1] = el; }} />
      <Plant x={-1.35} z={0.6} groupRef={(el) => { plantRefs.current[2] = el; }} />
      <Plant x={-1.35} z={-0.55} groupRef={(el) => { plantRefs.current[3] = el; }} />

      {/* Runner strip (long narrow rug between corridor doors) — F3.19: de-emissived.
          F3.21: ref'd for ±1% scale.x pulse idle-loop. */}
      <mesh
        ref={(el) => { runnerRefs.current[0] = el; }}
        position={[0, FLOOR_Y + 0.005, 2.2]}
       
      >
        <boxGeometry args={[0.55, 0.01, 3.0]} />
        <meshPhongMaterial color="#6b3216" flatShading />
        <Edges color={edgeColor} lineWidth={1} />
      </mesh>
      <mesh
        ref={(el) => { runnerRefs.current[1] = el; }}
        position={[0, FLOOR_Y + 0.005, -2.2]}
       
      >
        <boxGeometry args={[0.55, 0.01, 3.0]} />
        <meshPhongMaterial color="#6b3216" flatShading />
        <Edges color={edgeColor} lineWidth={1} />
      </mesh>

      {/* Ceiling beams + center hub deleted per user request — the
          wood blocks hanging in the corridor were paired with the
          (already-removed) HallwayLanterns. */}

      {/* F3.21: beam-dust mote — single tiny emissive cube floating below
          the cross-hub. Drifts on Y + opacity for a "shaft of dusty light"
          read. One mesh, one ref, scalar mutations only. */}
      <mesh ref={dustMoteRef} position={[0, 2.55, 0]}>
        <boxGeometry args={[0.05, 0.05, 0.05]} />
        <meshPhongMaterial
          color="#ffd9a8"
          emissive="#ffb060"
          emissiveIntensity={1.4}
          transparent
          opacity={0.4}
          flatShading
        />
      </mesh>

      {/* Rug — F3.19/F3.21: both layers neutral to let lanterns own the warm glow band */}
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[1.8, 0.02, 1.0]} />
        <meshPhongMaterial color="#8B4513" flatShading />
      </mesh>
      <mesh position={[0, 0.14, 0]}>
        <boxGeometry args={[1.4, 0.01, 0.6]} />
        <meshPhongMaterial color="#a0522d" flatShading />
      </mesh>

      {/* Ceiling light strips (gold cross pattern) deleted per user
          request — they were the "white plus signs hanging on the
          ceiling" once the lanterns + beams were removed. */}

      {/* Wall art — 8 framed pieces on the doorless side-walls of all 4
          corridor arms. Procedural primitives only (frame + canvas + tiny
          motif). Mounted at eye-ish height so they read at walking pace. */}
      {ART_PIECES.map((p, i) => (
        <WallArt key={`art-${i}`} {...p} y={ART_Y} />
      ))}
    </group>
  );
}
