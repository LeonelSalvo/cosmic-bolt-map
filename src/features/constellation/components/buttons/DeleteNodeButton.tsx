import { memo } from 'react';

interface Props {
  x: number;
  y: number;
  onClick: () => void;
  isClosing: boolean;
  animationDelay: number;
  disabled?: boolean;
}

const DeleteNodeButton = memo(function DeleteNodeButton({ 
  x, 
  y, 
  onClick, 
  isClosing,
  animationDelay,
  disabled = false
}: Props) {
  return (
    <g 
      transform={`translate(${x}, ${y})`}
      className={`delete-button-group ${isClosing ? 'closing' : ''} ${disabled ? 'disabled' : ''}`}
      style={{ '--animation-delay': `${animationDelay}ms` } as React.CSSProperties}
    >
      <circle 
        r="8" 
        className="delete-button"
        onClick={(e) => {
          e.stopPropagation();
          if (!disabled) {
            onClick();
          }
        }}
      />
      <path
        d="M -3 -3 L 3 -3 M -2 -3 L -2 3 L 2 3 L 2 -3 M -3 -3 L -3 -2 L 3 -2"
        className="trash-icon"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </g>
  );
});

export default DeleteNodeButton;