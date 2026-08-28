export type Severity = 'Critical' | 'High' | 'Medium' | 'Low / Info'
export type ReviewState = 'Accepted' | 'Edited' | 'Rejected'

export interface KPI { label: string; value: string; description: string; trend: string; icon: string }
export interface CaseOutcome { id: string; issue: string; category: string; layer: string; diagnosis: string; review: ReviewState; agreement: boolean; status: 'Verified' | 'Needs Review'; severity: Severity }
export interface PipelineStage { label: string; description: string; status: 'COMPLETED' | 'IN REVIEW' | 'PENDING'; icon: string }
export interface TopologyNode { id: string; label: string; device: 'pc' | 'server' | 'router'; type: 'healthy' | 'investigating' | 'fault'; position: [number, number, number] }
export interface TopologyLink { source: string; target: string; type: 'healthy' | 'investigating' | 'fault' }
