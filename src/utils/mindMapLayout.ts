import type { MindMapNode, NodePosition } from '../types/MindMap';
import { getViewportDimensions } from './viewportCalculations';

function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

function checkOverlap(positions: NodePosition[], x: number, y: number, minDistance: number): boolean {
  return positions.some(pos => {
    const distance = calculateDistance(pos.x, pos.y, x, y);
    return distance < minDistance;
  });
}

function findBestPosition(
  parentX: number,
  parentY: number,
  positions: NodePosition[],
  level: number,
  minDistance: number
): { x: number, y: number } {
  let bestX = parentX;
  let bestY = parentY;
  let bestDistance = 0;
  
  // Base distance from parent increases with level
  const minRadius = 200;
  const maxRadius = 300;
  const baseRadius = minRadius + (level * 100);
  
  // Try multiple angles to find the best position
  for (let i = 0; i < 36; i++) {
    const angle = (i * Math.PI * 2) / 36;
    const radiusVariation = randomInRange(-50, 50);
    const radius = baseRadius + radiusVariation;
    
    const testX = parentX + Math.cos(angle) * radius;
    const testY = parentY + Math.sin(angle) * radius;
    
    // Calculate minimum distance to any existing node
    let minDistanceToOthers = Infinity;
    for (const pos of positions) {
      const distance = calculateDistance(testX, testY, pos.x, pos.y);
      minDistanceToOthers = Math.min(minDistanceToOthers, distance);
    }
    
    // If this position provides better spacing, update best position
    if (minDistanceToOthers > bestDistance) {
      bestX = testX;
      bestY = testY;
      bestDistance = minDistanceToOthers;
    }
  }
  
  return { x: bestX, y: bestY };
}

export function calculateNodePositions(
  root: MindMapNode,
  storedPositions?: Record<string, { x: number; y: number }>,
  smartLayout: boolean = false
): NodePosition[] {
  const { width, height } = getViewportDimensions();
  const positions: NodePosition[] = [];
  const centerX = width / 2;
  const centerY = height / 2;
  const minDistance = 200; // Minimum distance between nodes
  
  function layoutNode(node: MindMapNode, level: number, parentX?: number, parentY?: number) {
    let x: number, y: number;
    
    if (storedPositions?.[node.id]) {
      ({ x, y } = storedPositions[node.id]);
    } else if (level === 0) {
      x = centerX;
      y = centerY;
    } else {
      const { x: newX, y: newY } = findBestPosition(
        parentX || centerX,
        parentY || centerY,
        positions,
        level,
        minDistance
      );
      x = newX;
      y = newY;
    }
    
    positions.push({ x, y, node, level });
    
    if (node.children) {
      // Sort children by complexity for better layout
      const sortedChildren = [...node.children].sort((a, b) => {
        const countDescendants = (n: MindMapNode): number => {
          if (!n.children) return 0;
          return n.children.length + n.children.reduce((sum, child) => sum + countDescendants(child), 0);
        };
        return countDescendants(b) - countDescendants(a);
      });

      sortedChildren.forEach(child => {
        layoutNode(child, level + 1, x, y);
      });
    }
  }
  
  layoutNode(root, 0);
  return positions;
}