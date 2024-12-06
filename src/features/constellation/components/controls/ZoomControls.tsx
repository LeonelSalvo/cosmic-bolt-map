import { memo } from 'react';

interface Props {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  scale: number;
}

export const ZoomControls = memo(function ZoomControls({
  onZoomIn,
  onZoomOut,
  onZoomReset,
  scale
}: Props) {
  return (
    <div className="zoom-controls">
      <button 
        className="zoom-button"
        onClick={onZoomIn}
        title="Zoom In"
      >
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path 
            fill="currentColor" 
            d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"
          />
        </svg>
      </button>
      <button 
        className="zoom-button"
        onClick={onZoomReset}
        title="Reset Zoom"
      >
        <span className="zoom-scale">{Math.round(scale * 100)}%</span>
      </button>
      <button 
        className="zoom-button"
        onClick={onZoomOut}
        title="Zoom Out"
      >
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path 
            fill="currentColor" 
            d="M19 13H5v-2h14v2z"
          />
        </svg>
      </button>
    </div>
  );
});

export default ZoomControls;