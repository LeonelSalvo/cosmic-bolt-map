import { useState, useCallback } from 'react';
import { calculateNodePositions } from '../utils/mindMapLayout';
import { findAllChildrenIds } from '../utils/nodeCalculations';
import { saveToStorage } from '../utils/storage';

export function useLayoutState(rootNode: any, nodePositions: any[], isSmartLayoutEnabled: boolean) {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isConstellationMode, setIsConstellationMode] = useState(false);

  const handleResetPositions = useCallback(() => {
    const newPositions = calculateNodePositions(rootNode, null, isSmartLayoutEnabled);
    saveToStorage(rootNode, newPositions);
    return newPositions;
  }, [rootNode, isSmartLayoutEnabled]);

  const handleResetBranchPositions = useCallback((activeNodeId: string) => {
    const activeNode = nodePositions.find(n => n.node.id === activeNodeId);
    if (!activeNode) return null;

    const childrenIds = new Set(findAllChildrenIds(activeNode.node));
    const storedPositions = nodePositions.reduce((acc, pos) => {
      if (!childrenIds.has(pos.node.id)) {
        acc[pos.node.id] = { x: pos.x, y: pos.y };
      }
      return acc;
    }, {} as Record<string, { x: number; y: number }>);

    const newPositions = calculateNodePositions(rootNode, storedPositions, isSmartLayoutEnabled);
    saveToStorage(rootNode, newPositions);
    return newPositions;
  }, [rootNode, nodePositions, isSmartLayoutEnabled]);

  return {
    zoomLevel,
    setZoomLevel,
    isConstellationMode,
    setIsConstellationMode,
    handleResetPositions,
    handleResetBranchPositions
  };
}