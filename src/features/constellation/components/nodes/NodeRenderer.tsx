import { memo } from 'react';
import type { NodePosition, VisibleNode, NodeMetadata } from '../../types';
import StarNode from './StarNode';
import { ANIMATION } from '../../config';

interface Props {
  node: NodePosition;
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

const NodeRenderer = memo(function NodeRenderer({
  node,
  visibleNodes,
  activeNodeId,
  closingNodes,
  rootNodeId,
  onNodeInteraction
}: Props) {
  const isVisible = node.node.id === rootNodeId || 
    visibleNodes.some(v => v.nodeId === node.node.id);
  
  if (!isVisible) return null;

  const hasChildren = !!node.node.children?.length;
  const childrenVisible = node.node.children?.some(child => 
    visibleNodes.some(v => v.nodeId === child.id)
  ) || false;

  return (
    <StarNode
      node={node}
      hasChildren={hasChildren}
      childrenVisible={childrenVisible}
      isActive={node.node.id === activeNodeId}
      isClosing={closingNodes.has(node.node.id)}
      isRoot={node.node.id === rootNodeId}
      onNodeInteraction={{
        onOpen: () => onNodeInteraction.onOpen(node.node.id),
        onClose: () => onNodeInteraction.onClose(node.node.id),
        onDelete: onNodeInteraction.onDelete,
        onAddChild: onNodeInteraction.onAddChild,
        onUpdateMetadata: onNodeInteraction.onUpdateMetadata
      }}
      animationDelay={node.level * ANIMATION.NODE_DELAY}
    />
  );
});

export default NodeRenderer;