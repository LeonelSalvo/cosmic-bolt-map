import { useCallback } from 'react';
import type { NodeMetadata } from '../types';

interface NodeInteractionProps {
  onNodeOpen: (nodeId: string) => void;
  onNodeClose: (nodeId: string) => void;
  onNodeDelete: (nodeId: string) => void;
  onAddChild: (parentId: string) => void;
  onUpdateMetadata: (nodeId: string, metadata: NodeMetadata) => void;
}

export function useNodeInteractions({
  onNodeOpen,
  onNodeClose,
  onNodeDelete,
  onAddChild,
  onUpdateMetadata
}: NodeInteractionProps) {
  const handleNodeClick = useCallback((nodeId: string) => {
    onNodeOpen(nodeId);
  }, [onNodeOpen]);

  const handleNodeClose = useCallback((nodeId: string) => {
    onNodeClose(nodeId);
  }, [onNodeClose]);

  const handleNodeDelete = useCallback((nodeId: string) => {
    onNodeDelete(nodeId);
  }, [onNodeDelete]);

  const handleAddChild = useCallback((parentId: string) => {
    onAddChild(parentId);
  }, [onAddChild]);

  const handleUpdateMetadata = useCallback((nodeId: string, metadata: NodeMetadata) => {
    onUpdateMetadata(nodeId, metadata);
  }, [onUpdateMetadata]);

  return {
    handleNodeClick,
    handleNodeClose,
    handleNodeDelete,
    handleAddChild,
    handleUpdateMetadata
  };
}