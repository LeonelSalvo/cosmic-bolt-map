import { memo } from 'react';
import EditableField from '../common/EditableField';
import type { NodeMetadata } from '../../types';

interface Props {
  metadata: NodeMetadata;
  onUpdate: (field: keyof NodeMetadata, value: string) => void;
  onOpenUrl: () => void;
}

const InfoCardContent = memo(function InfoCardContent({ 
  metadata, 
  onUpdate,
  onOpenUrl 
}: Props) {
  return (
    <div className="card-content">
      <div className="name-row">
        <EditableField
          value={metadata.name || ''}
          onChange={(value) => onUpdate('name', value)}
          placeholder="Enter name..."
        />
        {metadata.url && (
          <button 
            className="url-button"
            onClick={onOpenUrl}
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
        onChange={(value) => onUpdate('description', value)}
        placeholder="Enter description..."
        multiline
      />
      <EditableField
        value={metadata.url || ''}
        onChange={(value) => onUpdate('url', value)}
        placeholder="Enter URL..."
      />
    </div>
  );
});

export default InfoCardContent;