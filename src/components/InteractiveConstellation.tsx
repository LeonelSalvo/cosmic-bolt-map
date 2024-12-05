import { useState, useCallback } from 'react';
import type { NodePosition, VisibleNode } from '../types/MindMap';
import ZoomableCanvas from './ZoomableCanvas';
import StarNode from './StarNode';
import ConstellationLine from './ConstellationLine';

interface Props {
  initialNodes: NodePosition[];
}

export default function InteractiveConstellation({ initialNodes }: Props) {
  const [visibleNodes, setVisibleNodes] = useState<VisibleNode[]>([
    { nodeId: initialNodes[0].node.id }
  ]);

  const handleNodeClick = useCallback((nodeId: string) => {
    const clickedNode = initialNodes.find(n => n.node.id === nodeId);
    if (!clickedNode?.node.children?.length) return;

    setVisibleNodes(prev => {
      const childrenAlreadyVisible = clickedNode.node.children?.every(child =>
        prev.some(v => v.nodeId === child.id)
      );

      if (childrenAlreadyVisible) {
        return prev.filter(v => 
          v.nodeId === nodeId || 
          !clickedNode.node.children?.some(child => child.id === v.nodeId)
        );
      } else {
        const newNodes = clickedNode.node.children?.map(child => ({
          nodeId: child.id,
          parentId: nodeId
        })) || [];
        return [...prev, ...newNodes];
      }
    });
  }, [initialNodes]);

  const filteredNodes = initialNodes.filter(node => 
    visibleNodes.some(visible => visible.nodeId === node.node.id)
  );

  const paths = generatePaths(filteredNodes);

  return (
    <ZoomableCanvas width={1000} height={800}>
      {paths.map((path) => (
        <ConstellationLine
          key={`path-${path.from}-${path.to}`}
          {...path}
        />
      ))}
      {filteredNodes.map((node) => {
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
            onClick={() => handleNodeClick(node.node.id)}
          />
        );
      })}
    </ZoomableCanvas>
  );
}

function generatePaths(nodes: NodePosition[]): Array<{ path: string; level: number; from: string; to: string }> {
  const paths: Array<{ path: string; level: number; from: string; to: string }> = [];
  
  nodes.forEach(node => {
    const parentNode = nodes.find(n => 
      n.node.children?.some(child => child.id === node.node.id)
    );
    
    if (parentNode) {
      paths.push({
        path: `M ${parentNode.x} ${parentNode.y} L ${node.x} ${node.y}`,
        level: Math.max(node.level, parentNode.level),
        from: parentNode.node.id,
        to: node.node.id
      });
    }
  });
  
  return paths;
}