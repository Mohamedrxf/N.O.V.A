'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Html, Line, OrbitControls } from '@react-three/drei'
import { Computer, Router, Server } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { topologyLinks, topologyNodes } from '@/data/netsage-data'

const colors = { healthy: '#52d6c8', investigating: '#5aa8ff', fault: '#f0a35b' }
type NodeData = (typeof topologyNodes)[number]

type Flow = { source: NodeData; target: NodeData; type: keyof typeof colors; phase: number }

function Pulse({ node }: { node: NodeData }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    const wave = (Math.sin(clock.elapsedTime * 2.4 + node.position[0] * 1.7) + 1) / 2
    ref.current.scale.setScalar(1 + wave * 0.45)
    const material = ref.current.material as THREE.MeshBasicMaterial
    material.opacity = 0.05 + wave * 0.12
  })
  return <mesh ref={ref}><sphereGeometry args={[0.32, 16, 16]} /><meshBasicMaterial color={colors[node.type]} transparent opacity={0.1} /></mesh>
}

const deviceIcons = { pc: Computer, server: Server, router: Router }

function NetworkNode({ node, onSelect, selected }: { node: NodeData; onSelect: () => void; selected: boolean }) {
  const ref = useRef<THREE.Group>(null)
  const DeviceIcon = deviceIcons[node.device]
  useFrame(({ clock }) => {
    if (!ref.current) return
    const drift = Math.sin(clock.elapsedTime * 1.8 + node.position[0]) * 0.035
    ref.current.position.y = node.position[1] + drift
    ref.current.rotation.y = Math.sin(clock.elapsedTime * 0.45 + node.position[0]) * 0.08
  })
  return <group ref={ref} position={node.position} onClick={(event) => { event.stopPropagation(); onSelect() }}>
    <Pulse node={node} />
    <Html center distanceFactor={7} transform sprite>
      <button type="button" aria-label={`Inspect ${node.label}`} className={`group/device flex min-w-[92px] flex-col items-center gap-1.5 rounded-xl border px-2.5 py-2 font-mono transition-all duration-300 ${selected ? 'scale-110 border-cyan-200/70 bg-cyan-200/15 shadow-[0_0_28px_rgba(82,214,200,.3)]' : 'border-white/15 bg-[#0b1d2c]/90 hover:scale-105 hover:border-cyan-200/45'}`}>
        <span className="grid size-10 place-items-center rounded-lg border border-white/10 bg-[#102b3d]" style={{ color: colors[node.type] }}><DeviceIcon aria-hidden="true" className="size-6" /></span>
        <span className="whitespace-nowrap text-[9px] tracking-[0.14em] text-slate-200">{node.label}</span>
        <span className="text-[8px] uppercase tracking-widest" style={{ color: colors[node.type] }}>{node.device}</span>
      </button>
    </Html>
  </group>
}

function Packet({ flow }: { flow: Flow }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    const progress = (clock.elapsedTime * (flow.type === 'fault' ? 0.28 : 0.2) + flow.phase) % 1
    ref.current.position.lerpVectors(new THREE.Vector3(...flow.source.position), new THREE.Vector3(...flow.target.position), progress)
    ref.current.scale.setScalar(0.75 + Math.sin(progress * Math.PI) * 0.6)
  })
  return <mesh ref={ref}><sphereGeometry args={[flow.type === 'fault' ? 0.065 : 0.045, 10, 10]} /><meshBasicMaterial color={flow.type === 'fault' ? '#fff0ce' : '#d6fbf3'} /></mesh>
}

function Telemetry() {
  const ref = useRef<THREE.Points>(null)
  const positions = useMemo(() => { const points = new Float32Array(90); for (let i = 0; i < points.length; i += 3) { points[i] = (Math.random() - 0.5) * 6; points[i + 1] = (Math.random() - 0.5) * 3.2; points[i + 2] = (Math.random() - 0.5) * 1.7 } return points }, [])
  useFrame(({ clock }) => { if (ref.current) { ref.current.rotation.z = clock.elapsedTime * 0.012; ref.current.rotation.y = Math.sin(clock.elapsedTime * 0.12) * 0.08 } })
  return <points ref={ref}><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} count={positions.length / 3} /><bufferAttribute attach="attributes-color" args={[new Float32Array(positions.length).fill(0.8), 3]} count={positions.length / 3} /></bufferGeometry><pointsMaterial color="#5aa8ff" size={0.018} transparent opacity={0.42} /></points>
}

export function TopologyScene() {
  const [selected, setSelected] = useState<string | null>(null)
  const byId = useMemo(() => Object.fromEntries(topologyNodes.map((node) => [node.id, node])), [])
  const flows = useMemo(() => topologyLinks.map((link, index) => ({ source: byId[link.source], target: byId[link.target], type: link.type, phase: index * 0.17 })), [byId])
  const selectedNode = topologyNodes.find((node) => node.id === selected)
  return <div className="relative h-[360px] w-full overflow-hidden rounded-xl border border-white/10 bg-[#071421] sm:h-[420px]">
    <Canvas camera={{ position: [0, 0, 8], fov: 42 }} dpr={[1, 1.5]} onPointerMissed={() => setSelected(null)}>
      <color attach="background" args={['#071421']} /><fog attach="fog" args={['#071421', 7, 13]} /><ambientLight intensity={0.5} />
      <Telemetry />
      {flows.map((flow) => <group key={`${flow.source.id}-${flow.target.id}`}><Line points={[flow.source.position, flow.target.position]} color={colors[flow.type]} transparent opacity={flow.type === 'fault' ? 0.75 : 0.32} lineWidth={flow.type === 'fault' ? 1.8 : 1} /><Packet flow={flow} /></group>)}
      {topologyNodes.map((node) => <NetworkNode key={node.id} node={node} selected={selected === node.id} onSelect={() => setSelected(node.id)} />)}
      <OrbitControls enablePan={false} minDistance={5} maxDistance={11} autoRotate autoRotateSpeed={0.22} enableDamping dampingFactor={0.05} />
    </Canvas>
    <div className="pointer-events-none absolute inset-x-4 top-4 flex items-start justify-between"><div><p className="font-mono text-[9px] tracking-[0.2em] text-cyan-200/70">LIVE TOPOLOGY / PACKET FLOW</p><p className="mt-1 text-xs text-slate-400">Click a node to inspect its state</p></div><div className="flex gap-2 font-mono text-[9px] text-slate-400"><span><i className="mr-1 inline-block size-1.5 rounded-full bg-cyan-300" />HEALTHY</span><span><i className="mr-1 inline-block size-1.5 rounded-full bg-orange-300" />FAULT</span></div></div>
    {selectedNode && <div className="absolute bottom-4 left-4 rounded-lg border border-cyan-200/20 bg-[#0b1d2c]/90 px-3 py-2 shadow-xl backdrop-blur"><p className="font-mono text-[9px] tracking-[0.18em] text-cyan-200">NODE SELECTED</p><p className="mt-1 text-xs text-slate-200">{selectedNode.label} · <span className="capitalize text-slate-400">{selectedNode.type}</span></p></div>}
  </div>
}
