import { memo } from 'react';
import type { NodePosition, VisibleNode, NodeMetadata } from '../../types';
import { NodeRenderer } from './';

interface Props {
  nodes: NodePosition[];
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

const NodeList = memo(function NodeList({
  nodes,
  visibleNodes,
  activeNodeId,
  closingNodes,
  rootNodeId,
  onNodeInteraction
}: Props) {
  return (
    <>
      {nodes.map((node) => (
        <NodeRenderer
          key={node.node.id}
          node={node}
          visibleNodes={visibleNodes}
          activeNodeId={activeNodeId}
          closingNodes={closingNodes}
          rootNodeId={rootNodeId}
          onNodeInteraction={onNodeInteraction}
        />
      ))}
    </>
  );
});

export default NodeList;