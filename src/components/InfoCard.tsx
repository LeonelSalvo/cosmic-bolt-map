import { memo } from 'react';
import type { NodeMetadata } from '../types/MindMap';
import EditableField from './EditableField';

interface Props {
  metadata: NodeMetadata;
  onClose: () => void;
  onUpdate: (metadata: NodeMetadata) => void;
}

const InfoCard = memo(function InfoCard({ metadata, onClose, onUpdate }: Props) {
  const handleUpdate = (field: keyof NodeMetadata, value: string) => {
    onUpdate({
      ...metadata,
      [field]: value
    });
  };

  const handleOpenUrl = () => {
    if (metadata.url) {
      window.open(metadata.url, '_blank');
    }
  };

  return (
    <div className="info-card">
      <div className="info-card-header">
        <button 
          className="close-button" 
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >×</button>
      </div>
      {metadata.imageUrl && (
        <div className="card-image">
          <img 
            src={metadata.imageUrl} 
            alt={metadata.name || ''} 
            loading="lazy"
          />
          <EditableField
            value={metadata.imageUrl}
            onChange={(value) => handleUpdate('imageUrl', value)}
            placeholder="Enter image URL..."
          />
        </div>
      )}
      <div className="card-content">
        <div className="name-row">
          <EditableField
            value={metadata.name || ''}
            onChange={(value) => handleUpdate('name', value)}
            placeholder="Enter name..."
          />
          {metadata.url && (
            <button 
              className="url-button"
              onClick={handleOpenUrl}
              title="Open URL"
            >
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path 
                  fill="currentColor" 
                  d="M10 6v2H5v11h11v-5h2v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6zm11-3v8h-2V6.413l-7.793 7.794-1.414-1.414L17.585 5H13V3h8z"
                />
              </svg>
            </button>
          )}
        </div>
        <EditableField
          value={metadata.description || ''}
          onChange={(value) => handleUpdate('description', value)}
          placeholder="Enter description..."
          multiline
        />
        <EditableField
          value={metadata.url || ''}
          onChange={(value) => handleUpdate('url', value)}
          placeholder="Enter URL..."
        />
      </div>
    </div>
  );
});

export default InfoCard;