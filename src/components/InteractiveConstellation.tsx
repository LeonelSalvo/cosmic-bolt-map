import { useState, useCallback, useEffect, useMemo } from 'react';
import type { NodePosition, VisibleNode, MindMapNode, NodeMetadata } from '../types/MindMap';
import ZoomableCanvas from './ZoomableCanvas';
import StarNode from './StarNode';
import ConstellationLine from './ConstellationLine';
import LayoutControls from './LayoutControls';
import ConstellationControls from './ConstellationControls';
import { calculateDistanceFromActive, findAllChildrenIds } from '../utils/nodeCalculations';
import { calculateNodePositions } from '../utils/mindMapLayout';
import { generateUniqueId } from '../utils/idGenerator';
import { saveToStorage, loadFromStorage } from '../utils/storage';

interface Props {
  initialNodes: NodePosition[];
}

export default function InteractiveConstellation({ initialNodes }: Props) {
  const [rootNode, setRootNode] = useState<MindMapNode>(() => {
    const stored = loadFromStorage();
    return stored?.nodes || initialNodes[0].node;
  });

  const [nodes, setNodes] = useState<NodePosition[]>(() => {
    const stored = loadFromStorage();
    if (stored) {
      return calculateNodePositions(stored.nodes, stored.positions);
    }
    return initialNodes;
  });

  const [visibleNodes, setVisibleNodes] = useState<VisibleNode[]>([
    { nodeId: rootNode.id }
  ]);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [closingNodes, setClosingNodes] = useState<Set<string>>(new Set());
  const [isSmartLayoutEnabled, setIsSmartLayoutEnabled] = useState(false);
  const [isConstellationMode, setIsConstellationMode] = useState(false);

  const handleNodeClick = useCallback((nodeId: string) => {
    setActiveNodeId(nodeId);
    
    const clickedNode = findNodeById(rootNode, nodeId);
    if (!clickedNode || !clickedNode.children?.length) return;

    const childrenAlreadyVisible = clickedNode.children.every(child =>
      visibleNodes.some(v => v.nodeId === child.id)
    );

    if (!childrenAlreadyVisible) {
      const newNodes = clickedNode.children.map(child => ({
        nodeId: child.id,
        parentId: nodeId
      }));
      setVisibleNodes(prev => [...prev, ...newNodes]);
    }
  }, [rootNode, visibleNodes]);

  const handleNodeClose = useCallback((nodeId: string) => {
    const clickedNode = findNodeById(rootNode, nodeId);
    if (!clickedNode) return;

    const allChildrenIds = findAllChildrenIds(clickedNode);
    setClosingNodes(new Set(allChildrenIds));

    setTimeout(() => {
      setVisibleNodes(prev => prev.filter(v => 
        v.nodeId === nodeId || 
        !allChildrenIds.includes(v.nodeId)
      ));
      setClosingNodes(new Set());
    }, 600);
  }, [rootNode]);

  const handleAddChild = useCallback((parentId: string) => {
    const newNodeId = generateUniqueId();
    const newNode: MindMapNode = {
      id: newNodeId,
      label: 'New Star',
      metadata: {
        name: '',
        description: '',
        imageUrl: '',
        url: ''
      }
    };

    const updatedRootNode = addChildToNode(rootNode, parentId, newNode);
    const newNodes = calculateNodePositions(updatedRootNode, undefined, isSmartLayoutEnabled);
    setRootNode(updatedRootNode);
    setNodes(newNodes);
    saveToStorage(updatedRootNode, newNodes);
    setVisibleNodes(prev => [...prev, { nodeId: newNodeId, parentId }]);
  }, [rootNode, isSmartLayoutEnabled]);

  const handleDeleteNode = useCallback((nodeId: string) => {
    const updatedRootNode = deleteNode(rootNode, nodeId);
    if (!updatedRootNode) return;

    const allChildrenIds = findAllChildrenIds({ id: nodeId, label: '', children: [] });
    setClosingNodes(new Set([nodeId, ...allChildrenIds]));

    setTimeout(() => {
      const newNodes = calculateNodePositions(updatedRootNode, undefined, isSmartLayoutEnabled);
      setRootNode(updatedRootNode);
      setNodes(newNodes);
      saveToStorage(updatedRootNode, newNodes);
      setVisibleNodes(prev => prev.filter(v => 
        !allChildrenIds.includes(v.nodeId) && v.nodeId !== nodeId
      ));
      setClosingNodes(new Set());
      if (nodeId === activeNodeId) {
        setActiveNodeId(null);
      }
    }, 600);
  }, [rootNode, activeNodeId, isSmartLayoutEnabled]);

  const handleUpdateMetadata = useCallback((nodeId: string, metadata: NodeMetadata) => {
    const updatedRootNode = updateNodeMetadata(rootNode, nodeId, metadata);
    setRootNode(updatedRootNode);
    saveToStorage(updatedRootNode, nodes);
  }, [rootNode, nodes]);

  const handleResetPositions = useCallback(() => {
    const newNodes = calculateNodePositions(rootNode, undefined, isSmartLayoutEnabled);
    setNodes(newNodes);
    saveToStorage(rootNode, newNodes);
  }, [rootNode, isSmartLayoutEnabled]);

  const handleResetBranchPositions = useCallback(() => {
    if (!activeNodeId) return;
    
    const currentPositions = nodes.reduce((acc, pos) => ({
      ...acc,
      [pos.node.id]: { x: pos.x, y: pos.y }
    }), {});

    const newNodes = calculateNodePositions(rootNode, currentPositions, isSmartLayoutEnabled);
    setNodes(newNodes);
    saveToStorage(rootNode, newNodes);
  }, [rootNode, activeNodeId, nodes, isSmartLayoutEnabled]);

  const handleToggleSmartLayout = useCallback(() => {
    setIsSmartLayoutEnabled(prev => !prev);
  }, []);

  const handleBackgroundClick = useCallback(() => {
    setActiveNodeId(null);
  }, []);

  const handleStartConstellation = useCallback(() => {
    if (!activeNodeId) return;
    setIsConstellationMode(true);
    
    const clickedNode = findNodeById(rootNode, activeNodeId);
    if (!clickedNode) return;

    // Close all children first
    const allChildrenIds = findAllChildrenIds(clickedNode);
    setClosingNodes(new Set(allChildrenIds));

    setTimeout(() => {
      setVisibleNodes(prev => prev.filter(v => 
        v.nodeId === activeNodeId || 
        !allChildrenIds.includes(v.nodeId)
      ));
      setClosingNodes(new Set());

      // Then start opening them layer by layer
      let currentLayer = [clickedNode];
      let delay = 1000;

      while (currentLayer.length > 0) {
        const nextLayer: MindMapNode[] = [];
        
        setTimeout((nodes) => {
          const newVisibleNodes = nodes.flatMap(node => 
            (node.children || []).map(child => ({
              nodeId: child.id,
              parentId: node.id
            }))
          );
          
          setVisibleNodes(prev => [...prev, ...newVisibleNodes]);
          
        }, delay, currentLayer);

        currentLayer.forEach(node => {
          if (node.children) {
            nextLayer.push(...node.children);
          }
        });

        currentLayer = nextLayer;
        delay += 1000;
      }

      setTimeout(() => {
        setIsConstellationMode(false);
      }, delay);
    }, 600);
  }, [activeNodeId, rootNode]);

  const filteredNodes = useMemo(() => 
    nodes.filter(node => 
      visibleNodes.some(visible => visible.nodeId === node.node.id)
    ), [nodes, visibleNodes]
  );

  const nodesWithDistance = useMemo(() => 
    calculateDistanceFromActive(filteredNodes, activeNodeId), 
    [filteredNodes, activeNodeId]
  );
  
  const paths = useMemo(() => 
    nodesWithDistance.map((node, index) => {
      const parentNode = nodesWithDistance.find(n => 
        n.node.children?.some(child => child.id === node.node.id)
      );
      
      if (parentNode) {
        const isClosing = closingNodes.has(node.node.id) || closingNodes.has(parentNode.node.id);
        const isActive = node.node.id === activeNodeId || parentNode.node.id === activeNodeId;
        const isConnectedToActive = 
          (node.node.id === activeNodeId && parentNode.node.children?.some(child => child.id === activeNodeId)) ||
          (parentNode.node.id === activeNodeId && parentNode.node.children?.some(child => child.id === node.node.id));

        return {
          path: `M ${parentNode.x} ${parentNode.y} L ${node.x} ${node.y}`,
          level: Math.max(node.level, parentNode.level),
          from: parentNode.node.id,
          to: node.node.id,
          delay: isClosing ? 0 : index * 100,
          isClosing,
          isActive,
          isConnectedToActive
        };
      }
      return null;
    }).filter((path): path is NonNullable<typeof path> => path !== null),
    [nodesWithDistance, activeNodeId, closingNodes]
  );

  const activeNode = useMemo(() => 
    activeNodeId ? nodesWithDistance.find(n => n.node.id === activeNodeId) : null,
    [nodesWithDistance, activeNodeId]
  );

  const rootNodePosition = useMemo(() => {
    const root = nodesWithDistance.find(n => n.node.id === rootNode.id);
    return root ? { x: root.x, y: root.y } : undefined;
  }, [nodesWithDistance, rootNode.id]);

  return (
    <>
      <LayoutControls
        isSmartLayoutEnabled={isSmartLayoutEnabled}
        onToggleSmartLayout={handleToggleSmartLayout}
      />
      <ConstellationControls
        onStartConstellation={handleStartConstellation}
        hasSelectedNode={!!activeNodeId && !isConstellationMode}
      />
      <ZoomableCanvas
        rootPosition={rootNodePosition}
        selectedPosition={activeNode ? { x: activeNode.x, y: activeNode.y } : null}
        onResetPositions={handleResetPositions}
        onResetBranchPositions={handleResetBranchPositions}
        onBackgroundClick={handleBackgroundClick}
      >
        {paths.map((path) => (
          <ConstellationLine
            key={`path-${path.from}-${path.to}`}
            {...path}
          />
        ))}
        {nodesWithDistance.map((node, index) => (
          <StarNode
            key={node.node.id}
            node={node}
            hasChildren={!!node.node.children?.length}
            childrenVisible={node.node.children?.every(child =>
              filteredNodes.some(n => n.node.id === child.id)
            )}
            isActive={node.node.id === activeNodeId}
            isClosing={closingNodes.has(node.node.id)}
            isRoot={node.node.id === rootNode.id}
            onOpen={() => handleNodeClick(node.node.id)}
            onClose={() => handleNodeClose(node.node.id)}
            onDelete={handleDeleteNode}
            onAddChild={handleAddChild}
            onUpdateMetadata={handleUpdateMetadata}
            animationDelay={(paths.length + index) * 100}
          />
        ))}
      </ZoomableCanvas>
    </>
  );
}

function findNodeById(root: MindMapNode, id: string): MindMapNode | null {
  if (root.id === id) return root;
  if (!root.children) return null;
  
  for (const child of root.children) {
    const found = findNodeById(child, id);
    if (found) return found;
  }
  
  return null;
}

function addChildToNode(root: MindMapNode, parentId: string, newChild: MindMapNode): MindMapNode {
  if (root.id === parentId) {
    return {
      ...root,
      children: [...(root.children || []), newChild]
    };
  }

  if (!root.children) return root;

  return {
    ...root,
    children: root.children.map(child => addChildToNode(child, parentId, newChild))
  };
}

function deleteNode(root: MindMapNode, nodeId: string): MindMapNode | null {
  if (root.id === nodeId) return null;
  if (!root.children) return root;

  const newChildren = root.children
    .map(child => deleteNode(child, nodeId))
    .filter((child): child is MindMapNode => child !== null);

  return {
    ...root,
    children: newChildren.length > 0 ? newChildren : undefined
  };
}

function updateNodeMetadata(root: MindMapNode, nodeId: string, metadata: NodeMetadata): MindMapNode {
  if (root.id === nodeId) {
    return {
      ...root,
      metadata,
      label: metadata.name || root.label
    };
  }

  if (!root.children) return root;

  return {
    ...root,
    children: root.children.map(child => updateNodeMetadata(child, nodeId, metadata))
  };
}