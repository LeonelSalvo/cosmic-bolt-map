import { memo } from 'react';

interface Props {
  isOpen: boolean;
  onClick: () => void;
}

const MenuButton = memo(function MenuButton({ isOpen, onClick }: Props) {
  return (
    <button 
      className={`menu-button ${isOpen ? 'active' : ''}`}
      onClick={onClick}
      title={isOpen ? 'Close Menu' : 'Open Menu'}
    >
      <span className="menu-button-icon">☄️</span>
    </button>
  );
});

export default MenuButton;