import { memo } from 'react';

interface Props {
  onClose: () => void;
}

const InfoCardHeader = memo(function InfoCardHeader({ onClose }: Props) {
  return (
    <div className="info-card-header">
      <button 
        className="close-button" 
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >×</button>
    </div>
  );
});

export default InfoCardHeader;