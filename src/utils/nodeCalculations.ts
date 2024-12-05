import type { NodePosition, MindMapNode } from '../types/MindMap';

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
  const baseSize = hasChildren ? 5 : 3;
  if (isActive) return baseSize * 1.5;
  
  const distanceFactor = node.distanceFromActive || node.level;
  return baseSize * Math.max(0.8, 1 - distanceFactor * 0.1);
}

export function getNodeOpacity(node: NodePosition, isActive: boolean): number {
  if (isActive) return 1;
  
  const distance = node.distanceFromActive || node.level;
  return Math.max(0.2, 1 - distance * 0.3);
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