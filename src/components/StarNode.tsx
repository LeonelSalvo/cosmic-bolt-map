import { memo, useState } from 'react';
import type { NodePosition } from '../types/MindMap';
import InfoCard from './InfoCard';
import { getNodeSize, getNodeOpacity } from '../utils/nodeCalculations';

interface Props {
  node: NodePosition;
  hasChildren: boolean;
  childrenVisible: boolean;
  isActive: boolean;
  isClosing: boolean;
  onOpen: () => void;
  onClose: () => void;
  animationDelay: number;
}

const StarNode = memo(function StarNode({ 
  node, 
  hasChildren, 
  childrenVisible, 
  isActive,
  isClosing,
  onOpen,
  onClose,
  animationDelay 
}: Props) {
  const [showInfo, setShowInfo] = useState(false);

  const nodeSize = getNodeSize(node, hasChildren, isActive);
  const nodeOpacity = getNodeOpacity(node, isActive);

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
          {node.node.label}
        </text>
        {node.node.metadata && (
          <g 
            transform="translate(15, -15)"
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
        {hasChildren && childrenVisible && (
          <g 
            transform="translate(-15, -15)"
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
            <text
              textAnchor="middle"
              dy="4"
              className="close-button-text"
            >
              ×
            </text>
          </g>
        )}
      </g>
      {showInfo && node.node.metadata && (
        <InfoCard
          metadata={node.node.metadata}
          onClose={() => setShowInfo(false)}
          position={{ x: node.x, y: node.y }}
        />
      )}
    </>
  );
});

export default StarNode;