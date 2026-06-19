import type { AlgoReturn } from '@/pages/Main/types';
import * as THREE from 'three';
import rough from 'roughjs';

export function drawFromSegmentsRough(
  canvas: HTMLCanvasElement | null,
  data: AlgoReturn,
) {
  const ctx = canvas?.getContext('2d');
  if (!ctx) throw Error('drawFromSegments::no canvas context');

  ctx.clearRect(0, 0, canvas!.width, canvas!.height);

  const rc = rough.canvas(canvas!);

  for (const triangle of data.triangles) {
    for (const edge of triangle.edges) {
      for (const segment of edge.edgeSegments2d) {
        rc.line(segment[0].x, segment[0].y, segment[1].x, segment[1].y);
      }
    }
  }
}

export function drawFromSegments(
  canvas: HTMLCanvasElement | null,
  data: AlgoReturn,
  debugs = false,
) {
  const ctx = canvas?.getContext('2d');
  if (!ctx) throw Error('drawFromSegments::no canvas context');

  ctx.clearRect(0, 0, canvas!.width, canvas!.height);

  ctx.lineWidth = 1;
  ctx.strokeStyle = 'black';

  for (const triangle of data.triangles) {
    for (const edge of triangle.edges) {
      for (const segment of edge.edgeSegments2d) {
        drawLine(ctx, segment[0], segment[1]);
      }
    }
  }

  if (debugs) {
    ctx.strokeStyle = 'blue';
    for (const segment of data.debugLines) {
      drawLine(ctx, segment[0], segment[1]);
    }

    ctx.fillStyle = 'red';
    for (const point of data.debugPoints) {
      drawPoint(ctx, point);
    }
  }
}

function drawLine(
  ctx: CanvasRenderingContext2D,
  pointA: THREE.Vector2,
  pointB: THREE.Vector2,
  withHead = false,
) {
  ctx.beginPath();
  ctx.moveTo(pointA.x, pointA.y);
  ctx.lineTo(pointB.x, pointB.y);
  ctx.closePath();
  ctx.stroke();

  if (withHead) {
    const angle = Math.atan2(pointA.y - pointB.y, pointA.x - pointB.x);
    const length = 10;
    const addAngle = Math.PI / 6;

    ctx.beginPath();
    ctx.moveTo(pointB.x, pointB.y);
    ctx.lineTo(
      pointB.x + Math.cos(angle + addAngle) * length,
      pointB.y + Math.sin(angle + addAngle) * length,
    );
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(pointB.x, pointB.y);
    ctx.lineTo(
      pointB.x + Math.cos(angle - addAngle) * length,
      pointB.y + Math.sin(angle - addAngle) * length,
    );
    ctx.closePath();
    ctx.stroke();
  }
}

function drawPoint(ctx: CanvasRenderingContext2D, point: THREE.Vector2) {
  ctx.beginPath();
  ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
  ctx.fill();
}
