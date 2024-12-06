import { memo } from 'react';

interface Props {
  x: number;
  y: number;
  isClosing: boolean;
  onClick: () => void;
}

const ChildrenVisibilityButton = memo(function ChildrenVisibilityButton({
  x,
  y,
  isClosing,
  onClick
}: Props) {
  return (
    <g 
      transform={`translate(${x}, ${y})`}
      className={`close-button-group ${isClosing ? 'closing' : ''}`}
    >
      <circle 
        r="8" 
        className="close-button"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      />
      <path
        d="M -4 -4 L 4 4 M -4 4 L 4 -4"
        className="eye-icon"
      />
    </g>
  );
});

export default ChildrenVisibilityButton;