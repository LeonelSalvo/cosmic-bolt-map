import { memo, useRef, useEffect } from 'react';
import type { NodeMetadata } from '../types/MindMap';

interface Props {
  metadata: NodeMetadata;
  onClose: () => void;
  position: { x: number; y: number };
}

const InfoCard = memo(function InfoCard({ metadata, onClose, position }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [onClose]);

  return (
    <g transform={`translate(${position.x + 30}, ${position.y - 100})`}>
      <foreignObject width="300" height="300">
        <div ref={cardRef} className="info-card">
          <button 
            className="close-button" 
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >×</button>
          {metadata.imageUrl && (
            <div className="card-image">
              <img 
                src={metadata.imageUrl} 
                alt={metadata.name || ''} 
                loading="lazy"
              />
            </div>
          )}
          <div className="card-content">
            {metadata.name && <h3>{metadata.name}</h3>}
            {metadata.description && <p>{metadata.description}</p>}
          </div>
        </div>
      </foreignObject>
    </g>
  );
});

export default InfoCard;