import { memo } from 'react';
import type { NodePosition, VisibleNode, NodeMetadata } from '../types';
import { useConstellationNodes } from '../hooks';
import { ConnectionList } from './connections';
import { NodeList } from './nodes';

interface Props {
  nodePositions: NodePosition[];
  visibleNodes: VisibleNode[];
  activeNodeId: string | null;
  closingNodes: Set<string>;
  rootNodeId: string;
  onNodeInteraction: {
    onOpen: (nodeId: string) => void;
    onClose: (nodeId: string) => void;
    onDelete: (nodeId: string) => void;
    onAddChild: (parentId: string) => void;
    onUpdateMetadata: (nodeId: string, metadata: NodeMetadata) => void;
  };
}

const ConstellationView = memo(function ConstellationView({
  nodePositions,
  visibleNodes,
  activeNodeId,
  closingNodes,
  rootNodeId,
  onNodeInteraction
}: Props) {
  const { positionsWithDistance } = useConstellationNodes(nodePositions, activeNodeId);

  return (
    <>
      <ConnectionList
        nodePositions={nodePositions}
        visibleNodes={visibleNodes}
        activeNodeId={activeNodeId}
        closingNodes={closingNodes}
      />
      <NodeList
        nodes={positionsWithDistance}
        visibleNodes={visibleNodes}
        activeNodeId={activeNodeId}
        closingNodes={closingNodes}
        rootNodeId={rootNodeId}
        onNodeInteraction={onNodeInteraction}
      />
    </>
  );
});

export default ConstellationView;