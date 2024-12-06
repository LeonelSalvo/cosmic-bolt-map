import { memo } from 'react';

interface Props {
  isMuted: boolean;
  onToggle: () => void;
}

const SoundToggle = memo(function SoundToggle({ isMuted, onToggle }: Props) {
  return (
    <button 
      className={`menu-item ${isMuted ? '' : 'active'}`}
      onClick={onToggle}
    >
      <span className="menu-item-icon">
        {isMuted ? '🔇' : '🔊'}
      </span>
      {isMuted ? 'Enable Sound' : 'Disable Sound'}
    </button>
  );
});

export default SoundToggle;