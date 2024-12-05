import type { MindMapNode, NodePosition } from '../types/MindMap';

function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function checkOverlap(positions: NodePosition[], x: number, y: number, minDistance: number): boolean {
  return positions.some(pos => {
    const dx = pos.x - x;
    const dy = pos.y - y;
    return Math.sqrt(dx * dx + dy * dy) < minDistance;
  });
}

export function calculateNodePositions(
  root: MindMapNode,
  width: number = 1000,
  height: number = 800
): NodePosition[] {
  const positions: NodePosition[] = [];
  const centerX = width / 2;
  const centerY = height / 2;
  const minDistance = 100; // Minimum distance between nodes
  
  function layoutNode(node: MindMapNode, level: number, parentX?: number, parentY?: number) {
    let x: number, y: number;
    const padding = 50; // Padding from edges
    
    if (level === 0) {
      // Root node at center
      x = centerX;
      y = centerY;
    } else {
      // Try to find a non-overlapping position
      let attempts = 0;
      const maxAttempts = 50;
      
      do {
        const angle = randomInRange(0, 2 * Math.PI);
        const radius = 100 + level * 100 + randomInRange(-20, 20);
        
        x = (parentX || centerX) + Math.cos(angle) * radius;
        y = (parentY || centerY) + Math.sin(angle) * radius;
        
        // Keep within bounds
        x = Math.max(padding, Math.min(width - padding, x));
        y = Math.max(padding, Math.min(height - padding, y));
        
        attempts++;
      } while (
        checkOverlap(positions, x, y, minDistance) && 
        attempts < maxAttempts
      );
    }
    
    positions.push({ x, y, node, level });
    
    if (node.children) {
      node.children.forEach(child => {
        layoutNode(child, level + 1, x, y);
      });
    }
  }
  
  layoutNode(root, 0);
  return positions;
}