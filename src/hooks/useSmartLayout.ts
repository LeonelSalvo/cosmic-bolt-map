import { useCallback } from 'react';
import type { NodePosition } from '../types/MindMap';
import { useNodeLayout } from './useNodeLayout';
import { LAYOUT } from '../config/constellation';

export function useSmartLayout() {
  const { calculateNodeDistance, findOptimalPosition, validateLayout } = useNodeLayout();

  const optimizeLayout = useCallback((positions: NodePosition[]): NodePosition[] => {
    const optimizedPositions = [...positions];
    let iterations = 0;
    const maxIterations = 100;

    while (!validateLayout(optimizedPositions) && iterations < maxIterations) {
      for (let i = 1; i < optimizedPositions.length; i++) {
        const currentNode = optimizedPositions[i];
        const parentNode = optimizedPositions.find(p => 
          p.node.children?.some(c => c.id === currentNode.node.id)
        );

        if (parentNode) {
          const newPosition = findOptimalPosition(
            { x: parentNode.x, y: parentNode.y },
            currentNode.level,
            optimizedPositions.filter(p => p !== currentNode)
          );

          optimizedPositions[i] = {
            ...currentNode,
            x: newPosition.x,
            y: newPosition.y
          };
        }
      }
      iterations++;
    }

    return optimizedPositions;
  }, [findOptimalPosition, validateLayout]);

  const adjustNodeSpacing = useCallback((positions: NodePosition[]): NodePosition[] => {
    const adjustedPositions = [...positions];
    
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const distance = calculateNodeDistance(positions[i], positions[j]);
        
        if (distance < LAYOUT.DISTANCE.MIN) {
          const angle = Math.atan2(
            positions[j].y - positions[i].y,
            positions[j].x - positions[i].x
          );
          
          const adjustment = (LAYOUT.DISTANCE.MIN - distance) / 2;
          
          adjustedPositions[i] = {
            ...adjustedPositions[i],
            x: adjustedPositions[i].x - Math.cos(angle) * adjustment,
            y: adjustedPositions[i].y - Math.sin(angle) * adjustment
          };
          
          adjustedPositions[j] = {
            ...adjustedPositions[j],
            x: adjustedPositions[j].x + Math.cos(angle) * adjustment,
            y: adjustedPositions[j].y + Math.sin(angle) * adjustment
          };
        }
      }
    }
    
    return adjustedPositions;
  }, [calculateNodeDistance]);

  return {
    optimizeLayout,
    adjustNodeSpacing
  };
}