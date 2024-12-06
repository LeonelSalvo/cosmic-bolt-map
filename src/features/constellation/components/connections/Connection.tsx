import { memo } from 'react';
import type { NodePosition } from '../../types';
import { ANIMATION } from '../../config';

interface Props {
  startNode: NodePosition;
  endNode: NodePosition;
  isClosing: boolean;
  isActive: boolean;
  isConnectedToActive: boolean;
}

const Connection = memo(function Connection({
  startNode,
  endNode,
  isClosing,
  isActive,
  isConnectedToActive
}: Props) {
  const path = `M ${startNode.x} ${startNode.y} L ${endNode.x} ${endNode.y}`;
  
  // Calculate the actual path length for the animation
  const pathLength = Math.sqrt(
    Math.pow(endNode.x - startNode.x, 2) + 
    Math.pow(endNode.y - startNode.y, 2)
  );

  // Calculate opacity based on level and active state
  const baseOpacity = Math.max(0.1, 0.6 - endNode.level * 0.15);
  const opacity = isActive || isConnectedToActive ? baseOpacity * 1.5 : baseOpacity;
  
  return (
    <path
      d={path}
      className={`constellation-line ${isClosing ? 'closing' : ''} ${isActive ? 'active' : ''}`}
      style={{
        '--line-opacity': opacity,
        '--animation-delay': `${endNode.level * ANIMATION.NODE_DELAY}ms`,
        '--path-length': pathLength
      } as React.CSSProperties}
    />
  );
});

export default Connection;