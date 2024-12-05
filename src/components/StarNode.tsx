import { memo, useState, useCallback } from 'react';
import type { NodePosition } from '../types/MindMap';
import InfoCard from './InfoCard';

interface Props {
  node: NodePosition;
  hasChildren: boolean;
  childrenVisible: boolean;
  onClick: () => void;
}

const StarNode = memo(function StarNode({ node, hasChildren, childrenVisible, onClick }: Props) {
  const [showInfo, setShowInfo] = useState(false);

  const handleInfoClick = useCallback((e: React.MouseEvent) => {
    setShowInfo(true);
    console.log("opened info click for node. " + node.node.metadata.name)
  }, []);

  return (
    <>
      <g
        transform={`translate(${node.x},${node.y})`}
        style={{
          '--star-opacity': Math.max(0.2, 1 - node.level * 0.2)
        } as React.CSSProperties}
      >
        <circle
          className="star"
          r={hasChildren ? 5 : 3}
          onClick={onClick}
        />
        <text
          dy="20"
          textAnchor="middle"
          className="star-label"
        >
          {node.node.label}
        </text>
        {node.node.metadata && (
          <g 
            transform="translate(15, -15)"
          >
            <circle 
              r="8" 
              className="info-button"
              onClick={handleInfoClick}
            />
            <text
              textAnchor="middle"
              dy="4"
              className="info-button-text"
              onClick={handleInfoClick}
            >
              i
            </text>
          </g>
        )}
      </g>
      {true && node.node.metadata && (
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