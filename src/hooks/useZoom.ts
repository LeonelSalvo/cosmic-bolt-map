import { useCallback, useRef } from 'react';
import * as d3 from 'd3';
import { ANIMATION, ZOOM } from '../config/constellation';
import { getViewportDimensions } from '../utils/viewportCalculations';

export function useZoom(onZoom: (transform: d3.ZoomTransform) => void) {
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown>>();
  const { width, height } = getViewportDimensions();

  const initializeZoom = useCallback((svg: SVGSVGElement) => {
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([ZOOM.MIN, ZOOM.MAX])
      .extent([[0, 0], [width, height]])
      .on('zoom', (event) => {
        onZoom(event.transform);
      });

    zoomRef.current = zoom;
    d3.select(svg).call(zoom);

    return () => {
      d3.select(svg).on('.zoom', null);
    };
  }, [width, height, onZoom]);

  const centerView = useCallback((x: number = width / 2, y: number = height / 2, scale: number = 1) => {
    if (!zoomRef.current) return;

    const transform = d3.zoomIdentity
      .translate(width / 2 - x * scale, height / 2 - y * scale)
      .scale(scale);
    
    d3.select('svg').transition()
      .duration(ANIMATION.VIEW_TRANSITION)
      .call(zoomRef.current.transform, transform);
  }, [width, height]);

  return {
    initializeZoom,
    centerView
  };
}