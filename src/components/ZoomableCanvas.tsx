import { useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import { getViewportDimensions } from '../utils/viewportCalculations';
import CameraControls from './CameraControls';

interface Props {
  children: React.ReactNode;
  rootPosition?: { x: number; y: number };
  selectedPosition?: { x: number; y: number } | null;
  onResetPositions: () => void;
  onResetBranchPositions: () => void;
  onBackgroundClick: () => void;
}

export default function ZoomableCanvas({ 
  children, 
  rootPosition, 
  selectedPosition,
  onResetPositions,
  onResetBranchPositions,
  onBackgroundClick
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const gRef = useRef<SVGGElement>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown>>();
  const { width, height } = getViewportDimensions();

  const centerView = useCallback((x: number = width / 2, y: number = height / 2) => {
    if (!svgRef.current || !zoomRef.current) return;

    const svg = d3.select(svgRef.current);
    const transform = d3.zoomIdentity
      .translate(width / 2 - x, height / 2 - y)
      .scale(1);
    
    svg.transition()
      .duration(750)
      .call(zoomRef.current.transform, transform);
  }, [width, height]);

  useEffect(() => {
    if (!svgRef.current || !gRef.current) return;

    const svg = d3.select(svgRef.current);
    const g = d3.select(gRef.current);

    svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', width)
      .attr('height', height);

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .extent([[0, 0], [width, height]])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    zoomRef.current = zoom;
    svg.call(zoom);

    if (rootPosition) {
      centerView(rootPosition.x, rootPosition.y);
    } else {
      centerView();
    }

    return () => {
      svg.on('.zoom', null);
    };
  }, [width, height, rootPosition, centerView]);

  useEffect(() => {
    if (rootPosition) {
      centerView(rootPosition.x, rootPosition.y);
    }
  }, [rootPosition, centerView]);

  const handleReturnToRoot = useCallback(() => {
    if (rootPosition) {
      centerView(rootPosition.x, rootPosition.y);
    }
  }, [rootPosition, centerView]);

  const handleReturnToSelected = useCallback(() => {
    if (selectedPosition) {
      centerView(selectedPosition.x, selectedPosition.y);
    }
  }, [selectedPosition, centerView]);

  const handleBackgroundClick = useCallback((e: React.MouseEvent) => {
    if (e.target === svgRef.current || e.target === gRef.current) {
      onBackgroundClick();
    }
  }, [onBackgroundClick]);

  return (
    <div className="canvas-container">
      <CameraControls 
        onReturnToRoot={handleReturnToRoot}
        onReturnToSelected={handleReturnToSelected}
        onResetPositions={onResetPositions}
        onResetBranchPositions={onResetBranchPositions}
        hasSelectedNode={!!selectedPosition}
      />
      <svg
        ref={svgRef}
        className="constellation"
        style={{ width: '100%', height: '100vh' }}
        onClick={handleBackgroundClick}
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <g ref={gRef}>
          {children}
        </g>
      </svg>
    </div>
  );
}