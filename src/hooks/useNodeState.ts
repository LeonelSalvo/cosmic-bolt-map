import { useState, useCallback, useEffect } from 'react';
import type { NodePosition, MindMapNode, NodeMetadata } from '../types/MindMap';
import { calculateNodePositions } from '../utils/mindMapLayout';
import { generateUniqueId } from '../utils/idGenerator';
import { saveToStorage, loadFromStorage } from '../utils/storage';
import { DEFAULTS } from '../config/constellation';

export function useNodeState(initialNodes: NodePosition[], isSmartLayoutEnabled: boolean) {
  const [rootNode, setRootNode] = useState<MindMapNode>(initialNodes[0].node);
  const [nodePositions, setNodePositions] = useState<NodePosition[]>(initialNodes);

  useEffect(() => {
    const stored = loadFromStorage();
    if (stored) {
      setRootNode(stored.nodes);
      const positions = calculateNodePositions(stored.nodes, stored.positions, isSmartLayoutEnabled);
      setNodePositions(positions);
    }
  }, [isSmartLayoutEnabled]);

  const handleNodeDelete = useCallback((nodeId: string) => {
    const deleteNode = (nodes: MindMapNode): MindMapNode => {
      if (nodes.id === nodeId) return null;
      if (nodes.children) {
        const newChildren = nodes.children
          .map(child => deleteNode(child))
          .filter(Boolean);
        return { ...nodes, children: newChildren.length > 0 ? newChildren : undefined };
      }
      return nodes;
    };

    const updatedRoot = deleteNode(rootNode);
    if (!updatedRoot) return;

    setRootNode(updatedRoot);
    const newPositions = calculateNodePositions(updatedRoot, null, isSmartLayoutEnabled);
    setNodePositions(newPositions);
    saveToStorage(updatedRoot, newPositions);
    return { updatedRoot, newPositions };
  }, [rootNode, isSmartLayoutEnabled]);

  const handleAddChild = useCallback((parentId: string) => {
    const newNode: MindMapNode = {
      id: generateUniqueId(),
      label: DEFAULTS.NEW_NODE.LABEL,
      metadata: DEFAULTS.NEW_NODE.METADATA
    };

    const addChild = (node: MindMapNode): MindMapNode => {
      if (node.id === parentId) {
        return {
          ...node,
          children: [...(node.children || []), newNode]
        };
      }
      if (node.children) {
        return {
          ...node,
          children: node.children.map(child => addChild(child))
        };
      }
      return node;
    };

    const updatedRoot = addChild(rootNode);
    setRootNode(updatedRoot);
    const newPositions = calculateNodePositions(updatedRoot, null, isSmartLayoutEnabled);
    setNodePositions(newPositions);
    saveToStorage(updatedRoot, newPositions);
    return { newNode, updatedRoot, newPositions };
  }, [rootNode, isSmartLayoutEnabled]);

  const handleUpdateMetadata = useCallback((nodeId: string, metadata: NodeMetadata) => {
    const updateNode = (node: MindMapNode): MindMapNode => {
      if (node.id === nodeId) {
        return { ...node, metadata };
      }
      if (node.children) {
        return {
          ...node,
          children: node.children.map(child => updateNode(child))
        };
      }
      return node;
    };

    const updatedRoot = updateNode(rootNode);
    setRootNode(updatedRoot);
    saveToStorage(updatedRoot, nodePositions);
  }, [rootNode, nodePositions]);

  return {
    rootNode,
    nodePositions,
    setNodePositions,
    handleNodeDelete,
    handleAddChild,
    handleUpdateMetadata
  };
}