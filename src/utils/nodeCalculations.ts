import type { NodePosition, MindMapNode } from '../types/MindMap';
import { NODE } from '../config/constellation';

export function calculateDistanceFromActive(nodes: NodePosition[], activeNodeId: string | null): NodePosition[] {
  if (!activeNodeId) {
    return nodes.map(node => ({
      ...node,
      distanceFromActive: node.level
    }));
  }

  const activeNode = nodes.find(n => n.node.id === activeNodeId);
  if (!activeNode) return nodes;

  return nodes.map(node => {
    // Check if this node is a direct child of the active node
    const isDirectChild = activeNode.node.children?.some(child => child.id === node.node.id);
    
    if (isDirectChild) {
      return {
        ...node,
        distanceFromActive: 0.2 // Direct children are very bright
      };
    }

    // Check if this node is the parent of the active node
    const isParent = node.node.children?.some(child => child.id === activeNodeId);
    if (isParent) {
      return {
        ...node,
        distanceFromActive: 0.3 // Parent is quite bright
      };
    }

    // For other nodes, calculate distance based on their position
    const dx = node.x - activeNode.x;
    const dy = node.y - activeNode.y;
    const distance = Math.sqrt(dx * dx + dy * dy) / 200; // Normalize distance
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
  
  const distance = node.distanceFromActive || node.level;
  return Math.max(NODE.OPACITY.MIN, NODE.OPACITY.MAX - distance * NODE.OPACITY.LEVEL_DECAY);
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