import { memo } from 'react';

interface Props {
  path: string;
  level: number;
  from: string;
  to: string;
}

const ConstellationLine = memo(function ConstellationLine({ path, level, from, to }: Props) {
  return (
    <path
      d={path}
      className="constellation-line"
      style={{
        '--line-opacity': Math.max(0.1, 0.6 - level * 0.15)
      } as React.CSSProperties}
    />
  );
});

export default ConstellationLine;