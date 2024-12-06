import { memo, useState, useCallback } from 'react';
import type { NodePosition, NodeMetadata } from '../../types';
import { StarCore } from './elements';
import { InfoCard } from '../info';
import { AddNodeButton, DeleteNodeButton, ChildrenVisibilityButton } from '../buttons';

interface Props {
  node: NodePosition;
  hasChildren: boolean;
  childrenVisible: boolean;
  isActive: boolean;
  isClosing: boolean;
  isRoot?: boolean;
  onNodeInteraction: {
    onOpen: () => void;
    onClose: () => void;
    onDelete: (nodeId: string) => void;
    onAddChild: (parentId: string) => void;
    onUpdateMetadata: (nodeId: string, metadata: NodeMetadata) => void;
  };
  animationDelay: number;
}

const StarNode = memo(function StarNode({ 
  node, 
  hasChildren, 
  childrenVisible, 
  isActive,
  isClosing,
  isRoot = false,
  onNodeInteraction,
  animationDelay 
}: Props) {
  const [showInfo, setShowInfo] = useState(false);

  const handleNodeClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onNodeInteraction.onOpen();
  }, [onNodeInteraction]);

  if (!isActive && showInfo) {
    setShowInfo(false);
  }

  return (
    <>
      <StarCore
        node={node}
        hasChildren={hasChildren}
        isActive={isActive}
        isClosing={isClosing}
        animationDelay={animationDelay}
        onClick={handleNodeClick}
      />

      {hasChildren && childrenVisible && isActive && (
        <ChildrenVisibilityButton
          x={node.x - 25}
          y={node.y - 15}
          isClosing={isClosing}
          onClick={onNodeInteraction.onClose}
        />
      )}

      {isActive && (
        <>
          <AddNodeButton
            x={node.x + 25}
            y={node.y - 15}
            onClick={() => onNodeInteraction.onAddChild(node.node.id)}
            isClosing={isClosing}
            animationDelay={animationDelay}
          />
          {!isRoot && (
            <DeleteNodeButton
              x={node.x}
              y={node.y - 25}
              onClick={() => onNodeInteraction.onDelete(node.node.id)}
              isClosing={isClosing}
              animationDelay={animationDelay}
            />
          )}
        </>
      )}

      {showInfo && isActive && node.node.metadata && (
        <foreignObject
          x={node.x - 150}
          y={node.y - 200}
          width="300"
          height="300"
          style={{ overflow: 'visible' }}
        >
          <InfoCard
            metadata={node.node.metadata}
            onClose={() => setShowInfo(false)}
            onUpdate={(metadata) => onNodeInteraction.onUpdateMetadata(node.node.id, metadata)}
          />
        </foreignObject>
      )}
    </>
  );
});

export default StarNode;