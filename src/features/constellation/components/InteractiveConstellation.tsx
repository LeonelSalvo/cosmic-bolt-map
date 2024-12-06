import { useState, useCallback } from 'react';
import type { NodePosition, VisibleNode } from '../types';
import { 
  useNodeState, 
  useVisibilityState, 
  useLayoutState, 
  useConstellationMode,
  useSound
} from '../hooks';
import { Canvas } from './canvas';
import { ConstellationView } from './constellation';
import { ControlsContainer } from './controls';

interface Props {
  initialNodes: NodePosition[];
}

function InteractiveConstellation({ initialNodes }: Props) {
  const [isSmartLayoutEnabled, setIsSmartLayoutEnabled] = useState(false);
  const { playEffect } = useSound();

  const {
    rootNode,
    nodePositions,
    setNodePositions,
    handleNodeDelete,
    handleAddChild,
    handleUpdateMetadata
  } = useNodeState(initialNodes, isSmartLayoutEnabled);

  const {
    visibleNodes,
    activeNodeId,
    closingNodes,
    setVisibleNodes,
    setActiveNodeId,
    setClosingNodes,
    handleNodeOpen,
    handleNodeClose
  } = useVisibilityState();

  const {
    zoomLevel,
    setZoomLevel,
    isConstellationMode,
    handleResetPositions,
    handleResetBranchPositions
  } = useLayoutState(rootNode, nodePositions, isSmartLayoutEnabled);

  const {
    handleStartConstellation
  } = useConstellationMode(
    activeNodeId,
    nodePositions,
    setZoomLevel,
    setVisibleNodes,
    setClosingNodes
  );

  const handleNodeOpenWithChildren = useCallback((nodeId: string) => {
    setActiveNodeId(nodeId);
    playEffect('NODE_SELECT');
    const node = nodePositions.find(n => n.node.id === nodeId)?.node;
    if (node?.children) {
      const children: VisibleNode[] = node.children.map(child => ({
        nodeId: child.id,
        parentId: node.id
      }));
      handleNodeOpen(nodeId, children);
    }
  }, [nodePositions, handleNodeOpen, setActiveNodeId, playEffect]);

  const handleNodeCloseWithNode = useCallback((nodeId: string) => {
    const node = nodePositions.find(n => n.node.id === nodeId)?.node;
    if (node) {
      handleNodeClose(nodeId, node);
    }
  }, [nodePositions, handleNodeClose]);

  const handleResetBranchPositionsWithId = useCallback(() => {
    if (activeNodeId) {
      const newPositions = handleResetBranchPositions(activeNodeId);
      if (newPositions) {
        setNodePositions(newPositions);
      }
    }
  }, [activeNodeId, handleResetBranchPositions, setNodePositions]);

  const handleResetAllPositions = useCallback(() => {
    const newPositions = handleResetPositions();
    setNodePositions(newPositions);
  }, [handleResetPositions, setNodePositions]);

  const handleDeselect = useCallback(() => {
    setActiveNodeId(null);
  }, [setActiveNodeId]);

  const selectedPosition = activeNodeId ? 
    nodePositions.find(n => n.node.id === activeNodeId) : 
    null;

  return (
    <>
      <Canvas
        rootPosition={nodePositions[0]}
        selectedPosition={selectedPosition}
        onResetPositions={handleResetAllPositions}
        onResetBranchPositions={handleResetBranchPositionsWithId}
        onBackgroundClick={handleDeselect}
        forcedZoomLevel={isConstellationMode ? zoomLevel : undefined}
      >
        <ConstellationView
          nodePositions={nodePositions}
          visibleNodes={visibleNodes}
          activeNodeId={activeNodeId}
          closingNodes={closingNodes}
          rootNodeId={rootNode.id}
          onNodeInteraction={{
            onOpen: handleNodeOpenWithChildren,
            onClose: handleNodeCloseWithNode,
            onDelete: handleNodeDelete,
            onAddChild: handleAddChild,
            onUpdateMetadata: handleUpdateMetadata
          }}
        />
      </Canvas>
      <ControlsContainer
        onReturnToRoot={() => {}}
        onReturnToSelected={() => {}}
        onResetPositions={handleResetAllPositions}
        onResetBranchPositions={handleResetBranchPositionsWithId}
        onStartConstellation={handleStartConstellation}
        onDeselect={handleDeselect}
        onToggleSmartLayout={() => setIsSmartLayoutEnabled(!isSmartLayoutEnabled)}
        hasSelectedNode={!!activeNodeId}
        isSmartLayoutEnabled={isSmartLayoutEnabled}
      />
    </>
  );
}

export default InteractiveConstellation;