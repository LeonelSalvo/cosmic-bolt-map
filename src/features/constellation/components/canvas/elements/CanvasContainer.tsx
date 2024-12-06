import { memo } from 'react';

interface Props {
  children: React.ReactNode;
}

const CanvasContainer = memo(function CanvasContainer({ children }: Props) {
  return (
    <div className="canvas-container">
      {children}
    </div>
  );
});

export default CanvasContainer