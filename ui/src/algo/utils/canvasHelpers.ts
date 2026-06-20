import type { AlgoReturn } from '@/pages/Main/types';
import * as THREE from 'three';
import { point2dIterator, segment2dIterator } from '@/pages/Main/iterators';

export function drawFromSegments(
  canvas: HTMLCanvasElement | null,
  data: AlgoReturn,
  scale = { x: 1, y: 1 },
  debugs = false,
) {
  const ctx = canvas?.getContext('2d');
  if (!ctx) throw Error('drawFromSegments::no canvas context');

  ctx.clearRect(0, 0, canvas!.width, canvas!.height);
  ctx.save();
  ctx.scale(scale.x, scale.y);

  const mainScale = Math.max(scale.x, scale.y);

  ctx.lineWidth = 1 / mainScale;
  ctx.strokeStyle = 'black';

  for (const segment of segment2dIterator(data)) {
    drawLine(ctx, segment[0], segment[1]);
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

  drawScale(ctx, data, mainScale);

  ctx.restore();
}

export function drawScale(
  ctx: CanvasRenderingContext2D,
  data: AlgoReturn,
  scale: number,
) {
  const SPACING = 5; //mm
  const POINT_LINE_HALF_WIDTH = SPACING / 3;
  const FONT_SIZE = (10 / scale) * 1.8;

  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;

  for (const pt of point2dIterator(data)) {
    if (pt.x < minX) minX = pt.x;
    if (pt.y < minY) minY = pt.y;
    if (pt.x > maxX) maxX = pt.x;
    if (pt.y > maxY) maxY = pt.y;
  }

  ctx.strokeStyle = 'gray';
  drawLine(ctx, { x: minX, y: maxY + SPACING }, { x: maxX, y: maxY + SPACING });
  {
    const tY = maxY + SPACING;
    drawLine(
      ctx,
      { x: minX, y: tY - POINT_LINE_HALF_WIDTH },
      { x: minX, y: tY + POINT_LINE_HALF_WIDTH },
    );
    drawLine(
      ctx,
      { x: maxX, y: tY - POINT_LINE_HALF_WIDTH },
      { x: maxX, y: tY + POINT_LINE_HALF_WIDTH },
    );
  }

  drawLine(ctx, { x: maxX + SPACING, y: minY }, { x: maxX + SPACING, y: maxY });
  {
    const tX = maxX + SPACING;
    drawLine(
      ctx,
      { x: tX - POINT_LINE_HALF_WIDTH, y: minY },
      { x: tX + POINT_LINE_HALF_WIDTH, y: minY },
    );
    drawLine(
      ctx,
      { x: tX - POINT_LINE_HALF_WIDTH, y: maxY },
      { x: tX + POINT_LINE_HALF_WIDTH, y: maxY },
    );
  }

  ctx.fillStyle = 'gray';
  ctx.font = `${FONT_SIZE}px serif`;

  const width = (maxX - minX).toFixed(2) + 'mm';
  ctx.textAlign = 'center';
  ctx.fillText(
    width,
    minX + (maxX - minX) / 2 + SPACING * 2,
    maxY + SPACING * 4,
  );

  const height = (maxY - minY).toFixed(2) + 'mm';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(height, maxX + SPACING * 2, minY + (maxY - minY) / 2);
}

function drawLine(
  ctx: CanvasRenderingContext2D,
  pointA: THREE.Vector2Like,
  pointB: THREE.Vector2Like,
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

export function clearCanvas(canvas: HTMLCanvasElement | null) {
  const ctx = canvas?.getContext('2d');
  if (!ctx) throw Error('drawFromSegments::no canvas context');

  ctx.clearRect(0, 0, canvas!.width, canvas!.height);
}
