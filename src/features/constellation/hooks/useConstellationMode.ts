import { useState, useCallback } from 'react';
import type { MindMapNode, NodePosition } from '../types';
import { ANIMATION } from '../config';

export function useConstellationMode(
  activeNodeId: string | null,
  nodePositions: NodePosition[],
  setZoomLevel: (zoom: number) => void,
  setVisibleNodes: (nodes: any) => void,
  setClosingNodes: (nodes: Set<string>) => void
) {
  const [isConstellationMode, setIsConstellationMode] = useState(false);

  const handleStartConstellation = useCallback(() => {
    if (!activeNodeId) return;
    setIsConstellationMode(true);
    
    const clickedNode = nodePositions.find(n => n.node.id === activeNodeId)?.node;
    if (!clickedNode) return;

    setZoomLevel(ANIMATION.ZOOM.INITIAL_SCALE);
    
    setTimeout(() => {
      const allChildrenIds = getAllChildrenIds(clickedNode);
      setClosingNodes(new Set(allChildrenIds));

      setTimeout(() => {
        setVisibleNodes(prev => prev.filter((v: any) => 
          v.nodeId === activeNodeId || 
          !allChildrenIds.includes(v.nodeId)
        ));
        setClosingNodes(new Set());

        const layers = getNodeLayers(clickedNode);
        animateConstellationLayers(layers, setZoomLevel, setVisibleNodes);

        setTimeout(() => {
          setIsConstellationMode(false);
          setZoomLevel(1);
        }, layers.length * ANIMATION.CONSTELLATION_LAYER_DELAY);
      }, ANIMATION.CLOSE_DURATION);
    }, ANIMATION.ZOOM.INITIAL_DURATION);
  }, [activeNodeId, nodePositions, setZoomLevel, setVisibleNodes, setClosingNodes]);

  return {
    isConstellationMode,
    setIsConstellationMode,
    handleStartConstellation
  };
}

function getAllChildrenIds(node: MindMapNode): string[] {
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

function getNodeLayers(node: MindMapNode): MindMapNode[][] {
  const layers: MindMapNode[][] = [];
  let currentLayer = [node];

  while (currentLayer.length > 0) {
    layers.push(currentLayer);
    const nextLayer: MindMapNode[] = [];
    currentLayer.forEach(n => {
      if (n.children) {
        nextLayer.push(...n.children);
      }
    });
    currentLayer = nextLayer;
  }

  return layers;
}

function animateConstellationLayers(
  layers: MindMapNode[][],
  setZoomLevel: (zoom: number) => void,
  setVisibleNodes: (nodes: any) => void
) {
  layers.forEach((layer, index) => {
    setTimeout(() => {
      const progress = (index + 1) / layers.length;
      const currentZoom = ANIMATION.ZOOM.INITIAL_SCALE - 
        (progress * (ANIMATION.ZOOM.INITIAL_SCALE - 0.1));
      setZoomLevel(currentZoom);

      const newVisibleNodes = layer.flatMap(node => 
        (node.children || []).map(child => ({
          nodeId: child.id,
          parentId: node.id
        }))
      );
      
      if (newVisibleNodes.length > 0) {
        setVisibleNodes((prev: any) => [...prev, ...newVisibleNodes]);
      }
    }, index * ANIMATION.CONSTELLATION_LAYER_DELAY);
  });
}