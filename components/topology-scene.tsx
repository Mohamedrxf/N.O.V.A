'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Line, Html } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { topologyLinks, topologyNodes } from '@/data/netsage-data'

const colors = { healthy: '#52d6c8', investigating: '#5aa8ff', fault: '#f0a35b' }
function Node({ node }: { node: typeof topologyNodes[number] }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => { if (ref.current) ref.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 2 + node.position[0]) * 0.07) })
  return <group position={node.position}><mesh ref={ref}><sphereGeometry args={[0.13, 16, 16]} /><meshBasicMaterial color={colors[node.type]} /></mesh><mesh scale={1.9}><sphereGeometry args={[0.13, 16, 16]} /><meshBasicMaterial color={colors[node.type]} transparent opacity={0.08} /></mesh><Html center distanceFactor={8}><span className="pointer-events-none whitespace-nowrap font-mono text-[9px] tracking-[0.18em] text-slate-300">{node.label}</span></Html></group>
}
function Packets() { const ref = useRef<THREE.Mesh>(null); useFrame(({ clock }) => { if (ref.current) ref.current.position.x = Math.sin(clock.elapsedTime * 0.65) * 1.35 }); return <mesh ref={ref} position={[0, -0.1, 0.08]}><sphereGeometry args={[0.045, 8, 8]} /><meshBasicMaterial color="#d6fbf3" /></mesh> }
export function TopologyScene() {
  const byId = useMemo(() => Object.fromEntries(topologyNodes.map((node) => [node.id, node])), [])
  return <div className="h-[360px] w-full overflow-hidden rounded-xl border border-white/10 bg-[#071421] sm:h-[420px]"><Canvas camera={{ position: [0, 0, 8], fov: 42 }} dpr={[1, 1.5]}><color attach="background" args={['#071421']} /><ambientLight intensity={0.5} />{topologyLinks.map((link) => { const a = byId[link.source].position; const b = byId[link.target].position; return <Line key={`${link.source}-${link.target}`} points={[a, b]} color={colors[link.type]} transparent opacity={link.type === 'fault' ? 0.8 : 0.45} lineWidth={link.type === 'fault' ? 1.6 : 1} /> })}{topologyNodes.map((node) => <Node key={node.id} node={node} />)}<Packets /><OrbitControls enablePan={false} minDistance={5} maxDistance={11} autoRotate autoRotateSpeed={0.25} /></Canvas></div>
}
