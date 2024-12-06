import { memo, useState } from 'react';
import type { NodePosition, NodeMetadata } from '../types/MindMap';
import InfoCard from './InfoCard';
import AddNodeButton from './AddNodeButton';
import DeleteNodeButton from './DeleteNodeButton';
import { getNodeSize, getNodeOpacity } from '../utils/nodeCalculations';

interface Props {
  node: NodePosition;
  hasChildren: boolean;
  childrenVisible: boolean;
  isActive: boolean;
  isClosing: boolean;
  isRoot?: boolean;
  onOpen: () => void;
  onClose: () => void;
  onDelete: (nodeId: string) => void;
  onAddChild: (parentId: string) => void;
  onUpdateMetadata: (nodeId: string, metadata: NodeMetadata) => void;
  animationDelay: number;
}

const StarNode = memo(function StarNode({ 
  node, 
  hasChildren, 
  childrenVisible, 
  isActive,
  isClosing,
  isRoot = false,
  onOpen,
  onClose,
  onDelete,
  onAddChild,
  onUpdateMetadata,
  animationDelay 
}: Props) {
  const [showInfo, setShowInfo] = useState(false);

  const nodeSize = getNodeSize(node, hasChildren, isActive);
  const nodeOpacity = getNodeOpacity(node, isActive);

  // Close info card when node is deactivated
  if (!isActive && showInfo) {
    setShowInfo(false);
  }

  return (
    <>
      <g
        transform={`translate(${node.x},${node.y})`}
        style={{
          '--star-opacity': nodeOpacity,
          '--animation-delay': `${animationDelay}ms`
        } as React.CSSProperties}
      >
        <circle
          className={`star ${isClosing ? 'closing' : ''}`}
          r={nodeSize}
          onClick={onOpen}
        />
        <text
          dy="20"
          textAnchor="middle"
          className={`star-label ${isClosing ? 'closing' : ''}`}
        >
          {node.node.metadata?.name || node.node.label}
        </text>
        {node.node.metadata && isActive && (
          <g 
            transform="translate(25, -15)"
            className={`info-button-group ${isClosing ? 'closing' : ''}`}
          >
            <circle 
              r="8" 
              className="info-button"
              onClick={(e) => {
                e.stopPropagation();
                setShowInfo(true);
              }}
            />
            <text
              textAnchor="middle"
              dy="4"
              className="info-button-text"
            >
              i
            </text>
          </g>
        )}
        {hasChildren && childrenVisible && isActive && (
          <g 
            transform="translate(-25, -15)"
            className={`close-button-group ${isClosing ? 'closing' : ''}`}
          >
            <circle 
              r="8" 
              className="close-button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
            />
            <path
              d="M -4 -4 L 4 4 M -4 4 L 4 -4"
              className="eye-icon"
            />
          </g>
        )}
        {isActive && (
          <>
            <AddNodeButton
              x={0}
              y={-30}
              onClick={() => onAddChild(node.node.id)}
              isClosing={isClosing}
              animationDelay={animationDelay}
            />
            <DeleteNodeButton
              x={0}
              y={30}
              onClick={() => onDelete(node.node.id)}
              isClosing={isClosing}
              animationDelay={animationDelay}
              disabled={isRoot}
            />
          </>
        )}
      </g>
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
            onUpdate={(metadata) => onUpdateMetadata(node.node.id, metadata)}
          />
        </foreignObject>
      )}
    </>
  );
});

export default StarNode;