import type { CaseOutcome, KPI, PipelineStage, TopologyLink, TopologyNode } from '@/types/netsage'

export const kpis: KPI[] = [
  { label: 'TOTAL CASES', value: '30', description: 'Demo cases analyzed', trend: '+8 this month', icon: 'activity' },
  { label: 'VERIFIED DIAGNOSES', value: '24', description: 'Human-reviewed outcomes', trend: '80% of cases', icon: 'shield' },
  { label: 'AI / HUMAN AGREEMENT', value: '83%', description: 'Review alignment rate', trend: '+6.2% vs. baseline', icon: 'sparkles' },
  { label: 'HUMAN CORRECTIONS', value: '6', description: 'Responsible AI feedback', trend: '20% required edits', icon: 'users' },
]

export const faultCategories = [
  { category: 'Routing', count: 6 }, { category: 'IP Addressing', count: 5 }, { category: 'VLAN / Trunking', count: 4 },
  { category: 'DHCP', count: 4 }, { category: 'DNS', count: 4 }, { category: 'ACL', count: 4 }, { category: 'NAT', count: 3 }, { category: 'Wireless', count: 1 },
]
export const severityDistribution = [
  { name: 'Critical', value: 3 }, { name: 'High', value: 20 }, { name: 'Medium', value: 6 }, { name: 'Low / Info', value: 1 },
]
export const reviewOutcomes = [
  { name: 'Accepted', value: 18 }, { name: 'Edited', value: 4 }, { name: 'Rejected', value: 2 },
]

export const pipeline: PipelineStage[] = [
  { label: 'CASE RECEIVED', description: 'Symptoms + topology + show outputs', status: 'COMPLETED', icon: 'inbox' },
  { label: 'RULE ENGINE', description: 'Deterministic configuration checks', status: 'COMPLETED', icon: 'scan' },
  { label: 'AI ASSESSMENT', description: 'Candidate root cause', status: 'COMPLETED', icon: 'sparkles' },
  { label: 'EVIDENCE VERIFICATION', description: 'Compare diagnosis against evidence', status: 'COMPLETED', icon: 'file-check' },
  { label: 'HUMAN REVIEW', description: 'Accept / Edit / Reject', status: 'IN REVIEW', icon: 'user-check' },
  { label: 'VERIFIED DIAGNOSIS', description: 'Approved outcome for the case', status: 'PENDING', icon: 'badge-check' },
]

export const cases: CaseOutcome[] = [
  { id: 'TC01', issue: 'Wrong Default Gateway', category: 'IP Addressing', layer: 'Layer 3', diagnosis: 'Gateway mismatch', review: 'Accepted', agreement: true, status: 'Verified', severity: 'High' },
  { id: 'TC04', issue: 'Missing VLAN', category: 'VLAN / Trunking', layer: 'Layer 2', diagnosis: 'VLAN configuration issue', review: 'Edited', agreement: false, status: 'Verified', severity: 'High' },
  { id: 'TC07', issue: 'Interface Administratively Down', category: 'Interface', layer: 'Layer 1', diagnosis: 'Interface shutdown', review: 'Accepted', agreement: true, status: 'Verified', severity: 'High' },
  { id: 'TC20', issue: 'OSPF Area Mismatch', category: 'Routing', layer: 'Layer 3', diagnosis: 'OSPF configuration mismatch', review: 'Edited', agreement: false, status: 'Verified', severity: 'High' },
  { id: 'TC23', issue: 'ACL Denies Traffic', category: 'ACL', layer: 'Layer 4', diagnosis: 'ACL rule blocking traffic', review: 'Accepted', agreement: true, status: 'Verified', severity: 'Critical' },
  { id: 'TC30', issue: 'Guest SSID Wrong VLAN', category: 'Wireless', layer: 'Layer 2', diagnosis: 'Wireless VLAN mapping issue', review: 'Rejected', agreement: false, status: 'Needs Review', severity: 'Medium' },
]

export const topologyNodes: TopologyNode[] = [
  { id: 'pc', label: 'PC-01', device: 'pc', type: 'healthy', position: [-3.8, 1.9, 0] }, { id: 'sw', label: 'RTR-01', device: 'router', type: 'healthy', position: [-1.8, 0.5, 0] },
  { id: 'r1', label: 'RTR-02', device: 'router', type: 'investigating', position: [0, -0.7, 0] }, { id: 'r2', label: 'RTR-03', device: 'router', type: 'healthy', position: [1.9, 1.2, 0] },
  { id: 'server', label: 'SERVER', device: 'server', type: 'healthy', position: [3.8, -0.1, 0] }, { id: 'ap', label: 'RTR-04', device: 'router', type: 'fault', position: [-0.4, 2.4, 0] },
  { id: 'client2', label: 'PC-02', device: 'pc', type: 'healthy', position: [2.2, -2.1, 0] },
]
export const topologyLinks: TopologyLink[] = [
  { source: 'pc', target: 'sw', type: 'healthy' }, { source: 'sw', target: 'r1', type: 'investigating' }, { source: 'r1', target: 'r2', type: 'healthy' },
  { source: 'r2', target: 'server', type: 'healthy' }, { source: 'sw', target: 'ap', type: 'fault' }, { source: 'r2', target: 'client2', type: 'healthy' },
]

export const diagnosis = {
  case: 'PC cannot reach server in VLAN 30', rootCause: 'Incorrect default gateway', layer: 'Layer 3 — Network', confidence: 'High',
  evidence: ['PC IP address: 192.168.30.10', 'Default gateway: 192.168.20.1', 'Expected gateway: 192.168.30.1'], nextCommand: 'show ip interface brief',
  fix: 'Configure the correct default gateway for the VLAN 30 subnet.',
}
