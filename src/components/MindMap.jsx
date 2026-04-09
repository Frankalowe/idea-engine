import { useCallback, useMemo } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  BackgroundVariant,
  Handle,
  Position,
  MarkerType,
  useReactFlow,
  ReactFlowProvider,
} from '@xyflow/react'

const CATEGORY_COLORS = ['#7c3aed', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444']

// ─── Custom Node Types ────────────────────────────────────────────────────
function RootNode({ data }) {
  return (
    <div className="mind-node mind-node--root">
      <Handle type="source" position={Position.Right} />
      {data.label}
    </div>
  )
}

function CategoryNode({ data }) {
  const color = CATEGORY_COLORS[data.categoryIndex % CATEGORY_COLORS.length] || '#7c3aed'
  return (
    <div
      className="mind-node mind-node--category"
      style={{
        borderColor: color,
        background: `${color}18`,
        color: `${color}ee`,
        boxShadow: `0 0 14px ${color}40`,
      }}
    >
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      {data.label}
    </div>
  )
}

function SubtopicNode({ data }) {
  const color = CATEGORY_COLORS[data.categoryIndex % CATEGORY_COLORS.length] || '#7c3aed'
  return (
    <div
      className="mind-node mind-node--subtopic"
      style={{
        borderColor: `${color}80`,
        background: `${color}0d`,
        color: `${color}cc`,
      }}
    >
      <Handle type="target" position={Position.Left} />
      {data.label}
    </div>
  )
}

const nodeTypes = { root: RootNode, category: CategoryNode, subtopic: SubtopicNode }

// ─── Layout Algorithm ──────────────────────────────────────────────────────
function buildLayout(rawNodes, rawEdges) {
  const childrenMap = {}
  rawNodes.forEach((n) => { childrenMap[n.id] = [] })
  rawEdges.forEach((e) => {
    if (!childrenMap[e.source]) childrenMap[e.source] = []
    childrenMap[e.source].push(e.target)
  })

  const hasParent = new Set(rawEdges.map((e) => e.target))
  const rootRaw = rawNodes.find((n) => !hasParent.has(n.id))
  if (!rootRaw) return {}

  function getHeight(id) {
    const kids = childrenMap[id] || []
    if (kids.length === 0) return 1
    return kids.reduce((s, c) => s + getHeight(c), 0)
  }

  const positions = {}
  const NODE_H = 80
  const LEVEL_W = 220

  function assign(id, x, startY, endY) {
    const midY = (startY + endY) / 2
    positions[id] = { x, y: midY - 20 }
    const kids = childrenMap[id] || []
    if (!kids.length) return
    const totalKidH = kids.reduce((s, c) => s + getHeight(c), 0)
    const span = endY - startY
    let curY = startY
    kids.forEach((childId) => {
      const childH = getHeight(childId)
      const childSpan = (childH / totalKidH) * span
      assign(childId, x + LEVEL_W, curY, curY + childSpan)
      curY += childSpan
    })
  }

  const totalH = getHeight(rootRaw.id) * NODE_H
  assign(rootRaw.id, 0, -totalH / 2, totalH / 2)
  return positions
}

// ─── Main MindMap ──────────────────────────────────────────────────────────
function MindMapInner({ mindMap }) {
  const { rawNodes = [], rawEdges = [] } = useMemo(() => {
    if (!mindMap) return { rawNodes: [], rawEdges: [] }
    return { rawNodes: mindMap.nodes || [], rawEdges: mindMap.edges || [] }
  }, [mindMap])

  const positions = useMemo(() => buildLayout(rawNodes, rawEdges), [rawNodes, rawEdges])

  const nodes = useMemo(
    () =>
      rawNodes.map((n) => ({
        id: n.id,
        type: n.type || 'subtopic',
        position: positions[n.id] || { x: 0, y: 0 },
        data: {
          label: n.label,
          categoryIndex: n.categoryIndex ?? 0,
        },
        draggable: true,
      })),
    [rawNodes, positions]
  )

  const edges = useMemo(
    () =>
      rawEdges.map((e) => {
        const sourceNode = rawNodes.find((n) => n.id === e.source)
        const catIdx = sourceNode?.categoryIndex ?? 0
        const color = CATEGORY_COLORS[catIdx % CATEGORY_COLORS.length] || '#7c3aed'
        return {
          id: e.id,
          source: e.source,
          target: e.target,
          type: 'smoothstep',
          animated: false,
          style: { stroke: `${color}70`, strokeWidth: 1.5 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: `${color}70`,
            width: 10,
            height: 10,
          },
        }
      }),
    [rawEdges, rawNodes]
  )

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      fitView
      fitViewOptions={{ padding: 0.3, maxZoom: 1 }}
      minZoom={0.3}
      maxZoom={2}
      proOptions={{ hideAttribution: true }}
    >
      <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#ffffff08" />
      <Controls showInteractive={false} />
    </ReactFlow>
  )
}

export default function MindMap({ mindMap }) {
  return (
    <ReactFlowProvider>
      <MindMapInner mindMap={mindMap} />
    </ReactFlowProvider>
  )
}
