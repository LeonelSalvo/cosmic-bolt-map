import { memo, useState, useEffect } from 'react';
import { useSound } from '../../hooks/useSound';
import MenuButton from './MenuButton';
import SoundToggle from './SoundToggle';

interface Props {
  onReturnToRoot: () => void;
  onReturnToSelected: () => void;
  onResetPositions: () => void;
  onResetBranchPositions: () => void;
  onStartConstellation: () => void;
  onDeselect: () => void;
  onToggleSmartLayout: () => void;
  hasSelectedNode: boolean;
  isSmartLayoutEnabled: boolean;
}

const ControlsContainer = memo(function ControlsContainer({
  onReturnToRoot,
  onReturnToSelected,
  onResetPositions,
  onResetBranchPositions,
  onStartConstellation,
  onDeselect,
  onToggleSmartLayout,
  hasSelectedNode,
  isSmartLayoutEnabled
}: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const { playBackgroundMusic, stopBackgroundMusic, playEffect } = useSound();

  useEffect(() => {
    if (!isMuted) {
      playBackgroundMusic();
    } else {
      stopBackgroundMusic();
    }
  }, [isMuted, playBackgroundMusic, stopBackgroundMusic]);

  const handleMenuToggle = () => {
    if (!isMuted) {
      playEffect('MENU_OPEN');
    }
    setIsMenuOpen(!isMenuOpen);
  };

  const handleStartConstellation = () => {
    if (!isMuted) {
      playEffect('CONSTELLATION_START');
    }
    onStartConstellation();
  };

  return (
    <div className="controls-container">
      <MenuButton 
        isOpen={isMenuOpen}
        onClick={handleMenuToggle}
      />
      
      <div className={`controls-menu ${isMenuOpen ? 'open' : ''}`}>
        <SoundToggle 
          isMuted={isMuted}
          onToggle={() => setIsMuted(!isMuted)}
        />

        <button 
          className="menu-item"
          onClick={onReturnToRoot}
        >
          <span className="menu-item-icon">🏠</span>
          Return to Root
        </button>

        {hasSelectedNode && (
          <>
            <button 
              className="menu-item"
              onClick={onReturnToSelected}
            >
              <span className="menu-item-icon">⭐</span>
              Go to Selected
            </button>
            <button 
              className="menu-item"
              onClick={onResetBranchPositions}
            >
              <span className="menu-item-icon">🌳</span>
              Reset Branch
            </button>
            <button 
              className="menu-item"
              onClick={handleStartConstellation}
            >
              <span className="menu-item-icon">✨</span>
              Start Constellation
            </button>
            <button 
              className="menu-item"
              onClick={onDeselect}
            >
              <span className="menu-item-icon">❌</span>
              Deselect
            </button>
          </>
        )}
        
        <button 
          className="menu-item"
          onClick={onResetPositions}
        >
          <span className="menu-item-icon">🔄</span>
          Reset All
        </button>

        <button 
          className={`menu-item ${isSmartLayoutEnabled ? 'active' : ''}`}
          onClick={onToggleSmartLayout}
        >
          <span className="menu-item-icon">🧠</span>
          Smart Layout
        </button>
      </div>
    </div>
  );
});

export default ControlsContainer;