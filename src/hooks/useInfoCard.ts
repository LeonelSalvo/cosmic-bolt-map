import { useCallback } from 'react';
import type { NodeMetadata } from '../types/MindMap';

export function useInfoCard(metadata: NodeMetadata, onUpdate: (metadata: NodeMetadata) => void) {
  const handleFieldUpdate = useCallback((field: keyof NodeMetadata, value: string) => {
    onUpdate({
      ...metadata,
      [field]: value
    });
  }, [metadata, onUpdate]);

  const handleOpenUrl = useCallback(() => {
    if (metadata.url) {
      window.open(metadata.url, '_blank');
    }
  }, [metadata.url]);

  return {
    handleFieldUpdate,
    handleOpenUrl
  };
}