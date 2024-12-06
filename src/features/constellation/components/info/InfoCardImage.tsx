import { memo } from 'react';
import EditableField from '../common/EditableField';

interface Props {
  imageUrl: string;
  altText: string;
  onImageUrlChange: (url: string) => void;
}

const InfoCardImage = memo(function InfoCardImage({ 
  imageUrl, 
  altText,
  onImageUrlChange 
}: Props) {
  return (
    <div className="card-image">
      <img 
        src={imageUrl} 
        alt={altText} 
        loading="lazy"
      />
      <EditableField
        value={imageUrl}
        onChange={onImageUrlChange}
        placeholder="Enter image URL..."
      />
    </div>
  );
});

export default InfoCardImage;