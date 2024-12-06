import { memo, useMemo } from 'react';
import { BACKGROUND } from '../../config/background';
import { getViewportDimensions } from '../../utils';

interface Star {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
  duration: number;
}

function generateStars(): Star[] {
  const { width, height } = getViewportDimensions();
  const stars: Star[] = [];

  for (let i = 0; i < BACKGROUND.STARS.COUNT; i++) {
    stars.push({
      id: `star-${i}`,
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * (BACKGROUND.STARS.SIZE.MAX - BACKGROUND.STARS.SIZE.MIN) + BACKGROUND.STARS.SIZE.MIN,
      color: BACKGROUND.COLORS.STARS[Math.floor(Math.random() * BACKGROUND.COLORS.STARS.length)],
      opacity: Math.random() * (BACKGROUND.STARS.OPACITY.MAX - BACKGROUND.STARS.OPACITY.MIN) + BACKGROUND.STARS.OPACITY.MIN,
      duration: Math.random() * (BACKGROUND.STARS.PULSE.DURATION.MAX - BACKGROUND.STARS.PULSE.DURATION.MIN) + BACKGROUND.STARS.PULSE.DURATION.MIN
    });
  }

  return stars;
}

const BackgroundStars = memo(function BackgroundStars() {
  const stars = useMemo(() => generateStars(), []);

  return (
    <g className="background-stars">
      {stars.map(star => (
        <circle
          key={star.id}
          cx={star.x}
          cy={star.y}
          r={star.size}
          fill={star.color}
          className="background-star"
          style={{
            '--star-opacity': star.opacity,
            '--pulse-duration': `${star.duration}ms`
          } as React.CSSProperties}
        />
      ))}
    </g>
  );
});

export default BackgroundStars;