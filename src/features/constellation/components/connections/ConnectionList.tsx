import { memo } from 'react';
import type { NodePosition, VisibleNode } from '../../types';
import { Connection } from './';

interface Props {
  nodePositions: NodePosition[];
  visibleNodes: VisibleNode[];
  activeNodeId: string | null;
  closingNodes: Set<string>;
}

const ConnectionList = memo(function ConnectionList({
  nodePositions,
  visibleNodes,
  activeNodeId,
  closingNodes
}: Props) {
  return (
    <>
      {visibleNodes.map((visible, index) => {
        const node = nodePositions.find(n => n.node.id === visible.nodeId);
        const parent = nodePositions.find(n => n.node.id === visible.parentId);
        
        if (!node || !parent) return null;

        // Create a truly unique key using parent ID, node ID, and index
        const connectionKey = `${parent.node.id}-${node.node.id}-${index}`;

        return (
          <Connection
            key={connectionKey}
            startNode={parent}
            endNode={node}
            isClosing={closingNodes.has(node.node.id)}
            isActive={node.node.id === activeNodeId}
            isConnectedToActive={parent.node.id === activeNodeId}
          />
        );
      })}
    </>
  );
});

export default ConnectionList;