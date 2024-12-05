import { useState, useCallback, useEffect } from 'react';
import type { NodePosition, VisibleNode } from '../types/MindMap';
import ZoomableCanvas from './ZoomableCanvas';
import StarNode from './StarNode';
import ConstellationLine from './ConstellationLine';
import { calculateDistanceFromActive, findAllChildrenIds } from '../utils/nodeCalculations';
import { calculateNodePositions } from '../utils/mindMapLayout';

interface Props {
  initialNodes: NodePosition[];
}

export default function InteractiveConstellation({ initialNodes }: Props) {
  const [nodes, setNodes] = useState<NodePosition[]>(initialNodes);
  const [visibleNodes, setVisibleNodes] = useState<VisibleNode[]>([
    { nodeId: initialNodes[0].node.id }
  ]);
  const [activeNodeId, setActiveNodeId] = useState<string>(initialNodes[0].node.id);
  const [closingNodes, setClosingNodes] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleResize = () => {
      const recalculatedNodes = calculateNodePositions(initialNodes[0].node);
      setNodes(recalculatedNodes);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initialNodes]);

  const handleNodeOpen = useCallback((nodeId: string) => {
    const clickedNode = nodes.find(n => n.node.id === nodeId);
    if (!clickedNode?.node.children?.length) return;

    setActiveNodeId(nodeId);

    const childrenAlreadyVisible = clickedNode.node.children?.every(child =>
      visibleNodes.some(v => v.nodeId === child.id)
    );

    if (!childrenAlreadyVisible) {
      const newNodes = clickedNode.node.children?.map(child => ({
        nodeId: child.id,
        parentId: nodeId
      })) || [];
      setVisibleNodes(prev => [...prev, ...newNodes]);
    }
  }, [nodes, visibleNodes]);

  const handleNodeClose = useCallback((nodeId: string) => {
    const clickedNode = nodes.find(n => n.node.id === nodeId);
    if (!clickedNode) return;

    const allChildrenIds = findAllChildrenIds(clickedNode.node);
    setClosingNodes(new Set(allChildrenIds));

    setTimeout(() => {
      setVisibleNodes(prev => prev.filter(v => 
        v.nodeId === nodeId || 
        !allChildrenIds.includes(v.nodeId)
      ));
      setClosingNodes(new Set());
    }, 600);
  }, [nodes]);

  const filteredNodes = nodes.filter(node => 
    visibleNodes.some(visible => visible.nodeId === node.node.id)
  );

  const nodesWithDistance = calculateDistanceFromActive(filteredNodes, activeNodeId);
  
  const paths = nodesWithDistance.map((node, index) => {
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
  }).filter((path): path is NonNullable<typeof path> => path !== null);

  return (
    <ZoomableCanvas>
      {paths.map((path) => (
        <ConstellationLine
          key={`path-${path.from}-${path.to}`}
          {...path}
        />
      ))}
      {nodesWithDistance.map((node, index) => {
        const hasChildren = node.node.children?.length > 0;
        const childrenVisible = hasChildren && node.node.children?.every(child =>
          filteredNodes.some(n => n.node.id === child.id)
        );

        return (
          <StarNode
            key={node.node.id}
            node={node}
            hasChildren={hasChildren}
            childrenVisible={childrenVisible}
            isActive={node.node.id === activeNodeId}
            isClosing={closingNodes.has(node.node.id)}
            onOpen={() => handleNodeOpen(node.node.id)}
            onClose={() => handleNodeClose(node.node.id)}
            animationDelay={(paths.length + index) * 100}
          />
        );
      })}
    </ZoomableCanvas>
  );
}