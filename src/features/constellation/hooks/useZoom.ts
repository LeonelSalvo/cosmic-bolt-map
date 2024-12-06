import { useCallback, useRef, useState, useEffect } from 'react';
import * as d3 from 'd3';
import type { NodePosition } from '../types';
import { ANIMATION, ZOOM } from '../config';
import { getViewportDimensions } from '../utils';

interface ZoomProps {
  rootPosition?: NodePosition;
  selectedPosition?: NodePosition | null;
  forcedZoomLevel?: number;
}

export function useZoom({
  rootPosition,
  selectedPosition,
  forcedZoomLevel
}: ZoomProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const gRef = useRef<SVGGElement>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown>>();
  const [transform, setTransform] = useState('');
  const { width, height } = getViewportDimensions();

  useEffect(() => {
    if (!svgRef.current) return;

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([ZOOM.MIN, ZOOM.MAX])
      .extent([[0, 0], [width, height]])
      .on('zoom', (event) => {
        setTransform(event.transform.toString());
      });

    zoomRef.current = zoom;
    d3.select(svgRef.current).call(zoom);

    return () => {
      d3.select(svgRef.current).on('.zoom', null);
    };
  }, [width, height]);

  const centerView = useCallback((x: number = width / 2, y: number = height / 2, scale: number = 1) => {
    if (!svgRef.current || !zoomRef.current) return;

    const transform = d3.zoomIdentity
      .translate(width / 2 - x * scale, height / 2 - y * scale)
      .scale(scale);
    
    d3.select(svgRef.current)
      .transition()
      .duration(ANIMATION.VIEW_TRANSITION)
      .call(zoomRef.current.transform, transform);
  }, [width, height]);

  useEffect(() => {
    if (rootPosition) {
      centerView(rootPosition.x, rootPosition.y);
    }
  }, [rootPosition, centerView]);

  useEffect(() => {
    if (forcedZoomLevel !== undefined && selectedPosition) {
      centerView(selectedPosition.x, selectedPosition.y, forcedZoomLevel);
    }
  }, [forcedZoomLevel, selectedPosition, centerView]);

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

  return {
    svgRef,
    gRef,
    transform,
    handleReturnToRoot,
    handleReturnToSelected
  };
}