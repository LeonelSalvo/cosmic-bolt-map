import { memo } from 'react';

interface Props {
  x: number;
  y: number;
  onClick: () => void;
  isClosing: boolean;
  animationDelay: number;
}

const AddNodeButton = memo(function AddNodeButton({ 
  x, 
  y, 
  onClick, 
  isClosing,
  animationDelay 
}: Props) {
  return (
    <g 
      transform={`translate(${x}, ${y})`}
      className={`add-button-group ${isClosing ? 'closing' : ''}`}
      style={{ '--animation-delay': `${animationDelay}ms` } as React.CSSProperties}
    >
      <circle 
        r="8" 
        className="add-button"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      />
      <text
        textAnchor="middle"
        dy="4"
        className="add-button-text"
      >
        +
      </text>
    </g>
  );
});

export default AddNodeButton;