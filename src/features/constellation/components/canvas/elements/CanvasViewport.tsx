import { forwardRef, useEffect, useState } from 'react';
import { getViewportDimensions } from '../../../utils';
import { BACKGROUND } from '../../../config/background';
import { DEFAULTS } from '../../../config';
import { BackgroundStars } from '../../background';

interface Props {
  children: React.ReactNode;
  onBackgroundClick: () => void;
}

const CanvasViewport = forwardRef<SVGSVGElement, Props>(function CanvasViewport(
  { children, onBackgroundClick }, 
  ref
) {
  const [dimensions, setDimensions] = useState({
    width: DEFAULTS.VIEWPORT.WIDTH,
    height: DEFAULTS.VIEWPORT.HEIGHT
  });

  useEffect(() => {
    setDimensions(getViewportDimensions());

    function handleResize() {
      setDimensions(getViewportDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <svg
      ref={ref}
      className="constellation"
      style={{ 
        width: '100%', 
        height: '100vh',
        background: BACKGROUND.COLORS.BASE
      }}
      viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
      preserveAspectRatio="xMidYMid meet"
      onClick={onBackgroundClick}
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation={2} result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <BackgroundStars />
      {children}
    </svg>
  );
});

export default CanvasViewport;