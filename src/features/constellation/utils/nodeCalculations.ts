import type { NodePosition, MindMapNode } from '../types';
import { NODE } from '../config';

export function calculateDistanceFromActive(nodes: NodePosition[], activeNodeId: string | null): NodePosition[] {
  if (!activeNodeId) {
    return nodes.map(node => ({
      ...node,
      distanceFromActive: 0 // No distance when no node is selected
    }));
  }

  const activeNode = nodes.find(n => n.node.id === activeNodeId);
  if (!activeNode) return nodes;

  return nodes.map(node => {
    // Direct children of active node
    const isDirectChild = activeNode.node.children?.some(child => child.id === node.node.id);
    if (isDirectChild) {
      return {
        ...node,
        distanceFromActive: 0.2
      };
    }

    // Parent of active node
    const isParent = node.node.children?.some(child => child.id === activeNodeId);
    if (isParent) {
      return {
        ...node,
        distanceFromActive: 0.3
      };
    }

    // Calculate distance based on position for other nodes
    const dx = node.x - activeNode.x;
    const dy = node.y - activeNode.y;
    const distance = Math.sqrt(dx * dx + dy * dy) / 200;
    return {
      ...node,
      distanceFromActive: distance
    };
  });
}

export function getNodeSize(node: NodePosition, hasChildren: boolean, isActive: boolean): number {
  const baseSize = hasChildren ? NODE.SIZE.BASE.WITH_CHILDREN : NODE.SIZE.BASE.WITHOUT_CHILDREN;
  if (isActive) return baseSize * NODE.SIZE.ACTIVE_MULTIPLIER;
  
  const distanceFactor = node.distanceFromActive || node.level;
  return baseSize * Math.max(NODE.SIZE.MIN_SCALE, 1 - distanceFactor * NODE.OPACITY.DISTANCE_FACTOR);
}

export function getNodeOpacity(node: NodePosition, isActive: boolean): number {
  if (isActive) return NODE.OPACITY.MAX;
  
  if (node.distanceFromActive === 0) {
    // When no node is selected or it's part of the unselected state
    return NODE.OPACITY.UNSELECTED.MAX;
  }
  
  const distance = node.distanceFromActive || node.level;
  return Math.max(NODE.OPACITY.MIN, NODE.OPACITY.MAX - distance * NODE.OPACITY.LEVEL_DECAY);
}

export function getNodePulseDuration(): number {
  return Math.random() * 
    (NODE.OPACITY.PULSE.DURATION.MAX - NODE.OPACITY.PULSE.DURATION.MIN) + 
    NODE.OPACITY.PULSE.DURATION.MIN;
}

export function findAllChildrenIds(node: MindMapNode): string[] {
  const ids: string[] = [];
  
  function traverse(currentNode: MindMapNode) {
    if (currentNode.children) {
      currentNode.children.forEach(child => {
        ids.push(child.id);
        traverse(child);
      });
    }
  }
  
  traverse(node);
  return ids;
}