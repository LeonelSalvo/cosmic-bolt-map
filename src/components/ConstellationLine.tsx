import { memo, useEffect, useRef } from 'react';

interface Props {
  path: string;
  level: number;
  from: string;
  to: string;
  delay: number;
  isClosing?: boolean;
  isActive?: boolean;
  isConnectedToActive?: boolean;
}

const ConstellationLine = memo(function ConstellationLine({ 
  path, 
  level, 
  from, 
  to, 
  delay,
  isClosing,
  isActive,
  isConnectedToActive
}: Props) {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      pathRef.current.style.setProperty('--path-length', `${length}`);
    }
  }, [path]);

  let opacity = Math.max(0.1, 0.6 - level * 0.15);
  if (isActive || isConnectedToActive) {
    opacity = 0.8;
  }

  return (
    <path
      ref={pathRef}
      d={path}
      className={`constellation-line ${isClosing ? 'closing' : ''} ${isActive ? 'active' : ''}`}
      style={{
        '--line-opacity': opacity,
        '--animation-delay': `${delay}ms`,
      } as React.CSSProperties}
    />
  );
});

export default ConstellationLine;