import type { TriangleData } from '@/pages/Main/types';
import { dihedralAngle } from './dihedralAngle';

const MIN_ANGLE_DEGREES = 10;

export function removeDullEdges(
  processedTriangles: TriangleData[],
  minAngleDegrees = MIN_ANGLE_DEGREES,
): TriangleData[] {
  const minAngleRads = Math.PI - (minAngleDegrees / 180) * Math.PI;

  const newTriangles: TriangleData[] = [];
  for (const originalTriangle of processedTriangles) {
    for (const otherTriangle of newTriangles) {
      handle(originalTriangle, otherTriangle, minAngleRads);
    }

    newTriangles.push(originalTriangle);
  }

  return newTriangles;
}

function handle(
  ORIGINAL_TRIANGLE: TriangleData,
  OTHER_TRIANGLE: TriangleData,
  minAngleRads: number,
) {
  for (
    let ORIGINAL_TRIANGLE_edgeIndex = 0;
    ORIGINAL_TRIANGLE_edgeIndex < 3;
    ORIGINAL_TRIANGLE_edgeIndex++
  ) {
    for (
      let OTHER_TRIANGLE_edgeIndex = 0;
      OTHER_TRIANGLE_edgeIndex < 3;
      OTHER_TRIANGLE_edgeIndex++
    ) {
      if (
        (ORIGINAL_TRIANGLE.edges[ORIGINAL_TRIANGLE_edgeIndex].start.equals(
          OTHER_TRIANGLE.edges[OTHER_TRIANGLE_edgeIndex].start,
        ) &&
          ORIGINAL_TRIANGLE.edges[ORIGINAL_TRIANGLE_edgeIndex].end.equals(
            OTHER_TRIANGLE.edges[OTHER_TRIANGLE_edgeIndex].end,
          )) ||
        (ORIGINAL_TRIANGLE.edges[ORIGINAL_TRIANGLE_edgeIndex].end.equals(
          OTHER_TRIANGLE.edges[OTHER_TRIANGLE_edgeIndex].start,
        ) &&
          ORIGINAL_TRIANGLE.edges[ORIGINAL_TRIANGLE_edgeIndex].start.equals(
            OTHER_TRIANGLE.edges[OTHER_TRIANGLE_edgeIndex].end,
          ))
      ) {
        const common1 =
          ORIGINAL_TRIANGLE.edges[ORIGINAL_TRIANGLE_edgeIndex].start;
        const common2 =
          ORIGINAL_TRIANGLE.edges[ORIGINAL_TRIANGLE_edgeIndex].end;

        const original =
          ORIGINAL_TRIANGLE.edges[(ORIGINAL_TRIANGLE_edgeIndex + 1) % 3].end;
        const other =
          OTHER_TRIANGLE.edges[(OTHER_TRIANGLE_edgeIndex + 1) % 3].end;

        if (
          original.equals(common1) ||
          original.equals(common2) ||
          other.equals(common1) ||
          other.equals(common2) ||
          original.equals(other)
        ) {
          throw Error('brzydko');
        }

        if (minAngleRads < dihedralAngle(common1, common2, original, other)) {
          ORIGINAL_TRIANGLE.edges[ORIGINAL_TRIANGLE_edgeIndex].edgeSegments2d =
            [];
          OTHER_TRIANGLE.edges[OTHER_TRIANGLE_edgeIndex].edgeSegments2d = [];
        }
        break;
      }
    }
  }
}
