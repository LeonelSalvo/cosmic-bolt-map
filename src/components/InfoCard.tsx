import { memo, useEffect, useState } from 'react';
import type { NodeMetadata } from '../types/MindMap';

interface Props {
  metadata: NodeMetadata;
  onClose: () => void;
  position: { x: number; y: number };
}

const InfoCard = memo(function InfoCard({ metadata, onClose, position }: Props) {
  const [cardStyle, setCardStyle] = useState({
    left: '0',
    top: '0',
    opacity: 0,
    visibility: 'hidden'
  });

  useEffect(() => {
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      const card = document.querySelector('.info-card') as HTMLElement;
      if (!card) return;

      const cardWidth = card.offsetWidth;
      const cardHeight = card.offsetHeight;
      const padding = 20;

      // Convert SVG coordinates to screen coordinates
      const svgElement = document.querySelector('svg');
      if (!svgElement) return;

      const svgRect = svgElement.getBoundingClientRect();
      const screenX = (position.x / svgElement.clientWidth) * svgRect.width + svgRect.left;
      const screenY = (position.y / svgElement.clientHeight) * svgRect.height + svgRect.top;

      // Calculate position
      let left = screenX + padding;
      let top = screenY;

      // Adjust for viewport boundaries
      if (left + cardWidth > window.innerWidth - padding) {
        left = screenX - cardWidth - padding;
      }

      if (top + cardHeight > window.innerHeight - padding) {
        top = window.innerHeight - cardHeight - padding;
      }

      if (top < padding) {
        top = padding;
      }

      // Set final position with animation
      setCardStyle({
        left: `${left}px`,
        top: `${top}px`,
        opacity: 1,
        visibility: 'visible'
      });
    });

    // Cleanup
    return () => {
      setCardStyle(prev => ({ ...prev, opacity: 0, visibility: 'hidden' }));
    };
  }, [position]);

  return (
    <div 
      className="info-card" 
      style={{
        ...cardStyle,
        position: 'fixed',
        transition: 'opacity 0.2s ease-in-out'
      }}
    >
      <button className="close-button" onClick={onClose}>×</button>
      {metadata.imageUrl && (
        <div className="card-image">
          <img src={metadata.imageUrl} alt={metadata.name || ''} />
        </div>
      )}
      <div className="card-content">
        {metadata.name && <h3>{metadata.name}</h3>}
        {metadata.description && <p>{metadata.description}</p>}
      </div>
    </div>
  );
});

export default InfoCard;