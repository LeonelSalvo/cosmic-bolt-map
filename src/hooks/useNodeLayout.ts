import { useCallback } from 'react';
import type { NodePosition, MindMapNode } from '../types/MindMap';
import { LAYOUT } from '../config/constellation';

export function useNodeLayout() {
  const calculateNodeDistance = useCallback((
    node1: NodePosition,
    node2: NodePosition
  ): number => {
    const dx = node2.x - node1.x;
    const dy = node2.y - node1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  const findOptimalPosition = useCallback((
    parentPosition: { x: number, y: number },
    level: number,
    existingNodes: NodePosition[]
  ): { x: number, y: number } => {
    let bestPosition = { x: 0, y: 0 };
    let maxMinDistance = 0;

    const baseRadius = LAYOUT.RADIUS.BASE + (level * LAYOUT.DISTANCE.LEVEL_MULTIPLIER);
    
    // Try multiple angles to find the best position
    for (let i = 0; i < 36; i++) {
      const angle = (i * Math.PI * 2) / 36;
      const radiusVariation = Math.random() * LAYOUT.RADIUS.VARIATION * 2 - LAYOUT.RADIUS.VARIATION;
      const radius = baseRadius + radiusVariation;
      
      const testX = parentPosition.x + Math.cos(angle) * radius;
      const testY = parentPosition.y + Math.sin(angle) * radius;
      
      // Find minimum distance to any existing node
      let minDistance = Infinity;
      for (const node of existingNodes) {
        const distance = calculateNodeDistance(
          { x: testX, y: testY } as NodePosition,
          node
        );
        minDistance = Math.min(minDistance, distance);
      }
      
      // Update best position if this one provides better spacing
      if (minDistance > maxMinDistance) {
        maxMinDistance = minDistance;
        bestPosition = { x: testX, y: testY };
      }
    }
    
    return bestPosition;
  }, [calculateNodeDistance]);

  const validateLayout = useCallback((
    positions: NodePosition[],
    minDistance: number = LAYOUT.DISTANCE.MIN
  ): boolean => {
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const distance = calculateNodeDistance(positions[i], positions[j]);
        if (distance < minDistance) {
          return false;
        }
      }
    }
    return true;
  }, [calculateNodeDistance]);

  return {
    calculateNodeDistance,
    findOptimalPosition,
    validateLayout
  };
}