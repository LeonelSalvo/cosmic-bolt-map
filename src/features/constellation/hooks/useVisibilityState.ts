import { useState, useCallback } from 'react';
import type { VisibleNode, MindMapNode } from '../types';
import { findAllChildrenIds } from '../utils/nodeCalculations';
import { ANIMATION } from '../config';

export function useVisibilityState() {
  const [visibleNodes, setVisibleNodes] = useState<VisibleNode[]>([]);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [closingNodes, setClosingNodes] = useState<Set<string>>(new Set());

  const handleNodeOpen = useCallback((nodeId: string, children: VisibleNode[]) => {
    setActiveNodeId(nodeId);
    setVisibleNodes(prev => [...prev, ...children]);
  }, []);

  const handleNodeClose = useCallback((nodeId: string, node: MindMapNode) => {
    if (!node) return;

    const childrenIds = findAllChildrenIds(node);
    setClosingNodes(new Set(childrenIds));

    setTimeout(() => {
      setVisibleNodes(prev => prev.filter(v => !childrenIds.includes(v.nodeId)));
      setClosingNodes(new Set());
    }, ANIMATION.CLOSE_DURATION);
  }, []);

  return {
    visibleNodes,
    activeNodeId,
    closingNodes,
    setVisibleNodes,
    setActiveNodeId,
    setClosingNodes,
    handleNodeOpen,
    handleNodeClose
  };
}