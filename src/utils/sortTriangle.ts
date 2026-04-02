import { TriangleData } from './../types';
import { copyTriangleData } from './copyTriangleData';


export function sortTriangle(source: TriangleData): TriangleData {
  const [a, b, c] = source.edges.map(e => e.edgeSegments2d[0][0]);

  const cross = (b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y);

  if (cross > 0) {
    // Deep clone manually (preserves Vector2/Vector3)
    const clone = copyTriangleData(source);

    // Flip all edges
    for (let i = 0; i < 3; i++) {
      [clone.edges[i].start, clone.edges[i].end] = [clone.edges[i].end, clone.edges[i].start];
      [clone.edges[i].edgeSegments2d[0][0], clone.edges[i].edgeSegments2d[0][1]] =
        [clone.edges[i].edgeSegments2d[0][1], clone.edges[i].edgeSegments2d[0][0]];
    }

    // Swap edge order
    [clone.edges[1], clone.edges[2]] = [clone.edges[2], clone.edges[1]];

    return clone;
  }

  return source;
}
