import { memo } from 'react';
import type { NodeMetadata } from '../../types';
import { useInfoCard } from '../../hooks';
import InfoCardHeader from './InfoCardHeader';
import InfoCardImage from './InfoCardImage';
import InfoCardContent from './InfoCardContent';

interface Props {
  metadata: NodeMetadata;
  onClose: () => void;
  onUpdate: (metadata: NodeMetadata) => void;
}

const InfoCard = memo(function InfoCard({ metadata, onClose, onUpdate }: Props) {
  const { handleFieldUpdate, handleOpenUrl } = useInfoCard(metadata, onUpdate);

  return (
    <div className="info-card">
      <InfoCardHeader onClose={onClose} />
      
      {metadata.imageUrl && (
        <InfoCardImage
          imageUrl={metadata.imageUrl}
          altText={metadata.name || ''}
          onImageUrlChange={(value) => handleFieldUpdate('imageUrl', value)}
        />
      )}

      <InfoCardContent
        metadata={metadata}
        onUpdate={handleFieldUpdate}
        onOpenUrl={handleOpenUrl}
      />
    </div>
  );
});

export default InfoCard;