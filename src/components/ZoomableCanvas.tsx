import { useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';

interface Props {
  children: React.ReactNode;
  width: number;
  height: number;
}

export default function ZoomableCanvas({ children, width, height }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const gRef = useRef<SVGGElement>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown>>();

  const centerView = useCallback(() => {
    if (!svgRef.current || !zoomRef.current) return;
    
    const svg = d3.select(svgRef.current);
    const initialTransform = d3.zoomIdentity
      .translate(width / 2, height / 2)
      .scale(1);
    
    svg.transition()
      .duration(750)
      .call(zoomRef.current.transform, initialTransform);
  }, [width, height]);

  useEffect(() => {
    if (!svgRef.current || !gRef.current) return;

    const svg = d3.select(svgRef.current);
    const g = d3.select(gRef.current);

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    zoomRef.current = zoom;
    svg.call(zoom);

    // Center the view initially
    const initialTransform = d3.zoomIdentity
      .translate(width / 2, height / 2)
      .scale(1);
    svg.call(zoom.transform, initialTransform);

    return () => {
      svg.on('.zoom', null);
    };
  }, [width, height]);

  return (
    <div className="canvas-container">
      <button className="center-button" onClick={centerView}>
        Center View
      </button>
      <svg
        ref={svgRef}
        width="100%"
        height="100vh"
        className="constellation"
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