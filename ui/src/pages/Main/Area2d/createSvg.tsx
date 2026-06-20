import type { AlgoReturnWithName } from '../Area3d/types';
import { point2dIterator, segment2dIterator } from '../iterators';

export function createSvg(result: AlgoReturnWithName) {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;

  for (const pt of point2dIterator(result)) {
    if (pt.x < minX) minX = pt.x;
    if (pt.y < minY) minY = pt.y;
    if (pt.x > maxX) maxX = pt.x;
    if (pt.y > maxY) maxY = pt.y;
  }

  const width = maxX - minX;
  const height = maxY - minY;

  const segmentFragments = [...segment2dIterator(result)].map(
    ([p1, p2]) =>
      `<line x1="${p1.x - minX}" y1="${p1.y - minY}" x2="${p2.x - minX}" y2="${p2.y - minY}" stroke="black" stroke-width="1" />`,
  );

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none">
                    ${segmentFragments.join('\n')}
                </svg>`;
  return svg;
}
