import { useMemo } from 'react';
import type { NodePosition } from '../types/MindMap';
import { calculateDistanceFromActive } from '../utils/nodeCalculations';

export function useConstellationNodes(
  nodePositions: NodePosition[],
  activeNodeId: string | null
) {
  const positionsWithDistance = useMemo(() => 
    calculateDistanceFromActive(nodePositions, activeNodeId),
    [nodePositions, activeNodeId]
  );

  return {
    positionsWithDistance
  };
}