import type { NodePosition, MindMapNode } from '../types/MindMap';

const STORAGE_KEY = 'cosmic-mind-map';

interface StoredData {
  nodes: MindMapNode;
  positions: Record<string, { x: number; y: number }>;
}

export function saveToStorage(rootNode: MindMapNode, positions: NodePosition[]) {
  const positionMap = positions.reduce((acc, pos) => ({
    ...acc,
    [pos.node.id]: { x: pos.x, y: pos.y }
  }), {});

  const data: StoredData = {
    nodes: rootNode,
    positions: positionMap
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadFromStorage(): StoredData | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  
  try {
    return JSON.parse(stored);
  } catch (e) {
    console.error('Failed to parse stored data:', e);
    return null;
  }
}

export function clearStorage() {
  localStorage.removeItem(STORAGE_KEY);
}