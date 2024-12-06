import { memo } from 'react';
import type { NodePosition } from '../../types';
import { useZoom } from '../../hooks';
import { CanvasContainer, CanvasViewport } from './elements';

interface Props {
  children: React.ReactNode;
  rootPosition?: NodePosition;
  selectedPosition?: NodePosition | null;
  onResetPositions: () => void;
  onResetBranchPositions: () => void;
  onBackgroundClick: () => void;
  forcedZoomLevel?: number;
}

const Canvas = memo(function Canvas({ 
  children, 
  rootPosition, 
  selectedPosition,
  onResetPositions,
  onResetBranchPositions,
  onBackgroundClick,
  forcedZoomLevel
}: Props) {
  const {
    svgRef,
    gRef,
    transform,
    handleReturnToRoot,
    handleReturnToSelected
  } = useZoom({
    rootPosition,
    selectedPosition,
    forcedZoomLevel
  });

  return (
    <CanvasContainer>
      <CanvasViewport
        ref={svgRef}
        onBackgroundClick={onBackgroundClick}
      >
        <g 
          ref={gRef} 
          transform={transform}
        >
          {children}
        </g>
      </CanvasViewport>
    </CanvasContainer>
  );
});

export default Canvas;