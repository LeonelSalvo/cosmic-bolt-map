import { memo, useMemo } from 'react';
import type { NodePosition } from '../../../types';
import { getNodeSize, getNodeOpacity, getNodePulseDuration } from '../../../utils';

interface Props {
  node: NodePosition;
  hasChildren: boolean;
  isActive: boolean;
  isClosing: boolean;
  animationDelay: number;
  onClick: (e: React.MouseEvent) => void;
}

const StarCore = memo(function StarCore({
  node,
  hasChildren,
  isActive,
  isClosing,
  animationDelay,
  onClick
}: Props) {
  const nodeSize = getNodeSize(node, hasChildren, isActive);
  const nodeOpacity = getNodeOpacity(node, isActive);
  const pulseDuration = useMemo(() => getNodePulseDuration(), []);

  return (
    <g
      transform={`translate(${node.x},${node.y})`}
      style={{
        '--star-opacity': nodeOpacity,
        '--animation-delay': `${animationDelay}ms`,
        '--pulse-duration': `${pulseDuration}ms`
      } as React.CSSProperties}
      onClick={onClick}
    >
      <circle
        className={`star ${isClosing ? 'closing' : ''} ${isActive ? 'active' : ''}`}
        r={nodeSize}
      />
      <text
        dy="20"
        textAnchor="middle"
        className={`star-label ${isClosing ? 'closing' : ''}`}
      >
        {node.node.metadata?.name || node.node.label}
      </text>
    </g>
  );
});

export default StarCore;