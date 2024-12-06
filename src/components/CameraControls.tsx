import { memo } from 'react';

interface Props {
  onReturnToRoot: () => void;
  onReturnToSelected: () => void;
  onResetPositions: () => void;
  onResetBranchPositions: () => void;
  hasSelectedNode: boolean;
}

const CameraControls = memo(function CameraControls({ 
  onReturnToRoot, 
  onReturnToSelected,
  onResetPositions,
  onResetBranchPositions,
  hasSelectedNode 
}: Props) {
  return (
    <div className="camera-controls">
      <button 
        className="camera-button"
        onClick={onReturnToRoot}
      >
        <span className="camera-button-icon">🏠</span>
        Return to Root
      </button>
      {hasSelectedNode && (
        <>
          <button 
            className="camera-button"
            onClick={onReturnToSelected}
          >
            <span className="camera-button-icon">⭐</span>
            Go to Selected
          </button>
          <button 
            className="camera-button"
            onClick={onResetBranchPositions}
          >
            <span className="camera-button-icon">🌳</span>
            Reset Branch
          </button>
        </>
      )}
      <button 
        className="camera-button"
        onClick={onResetPositions}
      >
        <span className="camera-button-icon">🔄</span>
        Reset All
      </button>
    </div>
  );
});

export default CameraControls;