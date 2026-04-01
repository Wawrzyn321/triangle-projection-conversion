import { ProcessedTriangleData } from '../types';


export function copyTriangleData(source: ProcessedTriangleData): ProcessedTriangleData {
  return {
    edges: source.edges.map(edge => ({
      start: edge.start.clone(),
      end: edge.end.clone(),
      edgeSegments2d: edge.edgeSegments2d.map(segment => segment.map(v => v.clone())
      )
    }))
  };
}
