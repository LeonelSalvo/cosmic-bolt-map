import { memo } from 'react';

interface Props {
  onStartConstellation: () => void;
  hasSelectedNode: boolean;
}

const ConstellationControls = memo(function ConstellationControls({ 
  onStartConstellation,
  hasSelectedNode 
}: Props) {
  return (
    <div className="constellation-controls">
      {hasSelectedNode && (
        <button 
          className="constellation-button"
          onClick={onStartConstellation}
        >
          <span className="constellation-button-icon">✨</span>
          Constellation Mode
        </button>
      )}
    </div>
  );
});

export default ConstellationControls;