import { TriangleData } from '../types';


export function copyTriangleData(source: TriangleData): TriangleData {
  return {
    edges: source.edges.map(edge => ({
      start: edge.start.clone(),
      end: edge.end.clone(),
      edgeSegments2d: edge.edgeSegments2d.map(segment => segment.map(v => v.clone())
      )
    }))
  };
}
