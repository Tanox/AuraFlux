// src/utils/visualization.ts v2.3.11
import { Vector2, Vector3 } from 'three';

export const lerp = (start: number, end: number, t: number): number => {
  return start + (end - start) * t;
};

/**
 * 归一化值
 */
export const normalize = (value: number, min: number, max: number): number => {
  return (value - min) / (max - min);
};

/**
 * 映射值到新范围
 */
export const map = (value: number, inMin: number, inMax: number, outMin: number, outMax: number): number => {
  return normalize(value, inMin, inMax) * (outMax - outMin) + outMin;
};

/**
 * 限制值在范围内
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * 计算两点之间的距离
 */
export const distance = (x1: number, y1: number, x2: number, y2: number): number => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

/**
 * 计算向量长度
 */
export const vectorLength = (x: number, y: number, z: number = 0): number => {
  return Math.sqrt(x * x + y * y + z * z);
};

/**
 * 坐标转换：屏幕坐标转Canvas坐标
 */
export const screenToCanvas = (screenX: number, screenY: number, canvas: HTMLCanvasElement): Vector2 => {
  const rect = canvas.getBoundingClientRect();
  return new Vector2(
    screenX - rect.left,
    screenY - rect.top
  );
};

/**
 * 坐标转换：Canvas坐标转归一化设备坐标
 */
export const canvasToNDC = (canvasX: number, canvasY: number, canvas: HTMLCanvasElement): Vector2 => {
  return new Vector2(
    (canvasX / canvas.width) * 2 - 1,
    -(canvasY / canvas.height) * 2 + 1
  );
};

/**
 * 生成随机颜色
 */
export const generateRandomColor = (): string => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
};

/**
 * 生成颜色渐变
 */
export const generateGradient = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, colors: string[]): CanvasGradient => {
  const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
  colors.forEach((color, index) => {
    const position = index / (colors.length - 1);
    gradient.addColorStop(position, color);
  });
  return gradient;
};

/**
 * 计算音频能量
 */
export const calculateAudioEnergy = (dataArray: Uint8Array): number => {
  let sum = 0;
  for (let i = 0; i < dataArray.length; i++) {
    sum += dataArray[i] * dataArray[i];
  }
  return Math.sqrt(sum / dataArray.length) / 255;
};

/**
 * 计算音频频谱的不同频段
 */
export const calculateFrequencyBands = (dataArray: Uint8Array): { bass: number; mids: number; treble: number } => {
  const bassEnd = Math.floor(dataArray.length * 0.1);
  const midsEnd = Math.floor(dataArray.length * 0.5);
  
  let bass = 0;
  let mids = 0;
  let treble = 0;
  
  for (let i = 0; i < bassEnd; i++) {
    bass += dataArray[i];
  }
  
  for (let i = bassEnd; i < midsEnd; i++) {
    mids += dataArray[i];
  }
  
  for (let i = midsEnd; i < dataArray.length; i++) {
    treble += dataArray[i];
  }
  
  return {
    bass: bass / (bassEnd * 255),
    mids: mids / ((midsEnd - bassEnd) * 255),
    treble: treble / ((dataArray.length - midsEnd) * 255)
  };
};

/**
 * 平滑值
 */
export const smoothValue = (current: number, target: number, smoothing: number): number => {
  return current + (target - current) * smoothing;
};

/**
 * 生成噪声
 */
export const noise = (x: number, y: number = 0, z: number = 0): number => {
  // 简单的噪声函数，实际项目中可以使用更复杂的噪声算法
  const intX = Math.floor(x);
  const intY = Math.floor(y);
  const intZ = Math.floor(z);
  const fracX = x - intX;
  const fracY = y - intY;
  const fracZ = z - intZ;
  
  // 线性插值
  const u = fracX * fracX * (3.0 - 2.0 * fracX);
  const v = fracY * fracY * (3.0 - 2.0 * fracY);
  const w = fracZ * fracZ * (3.0 - 2.0 * fracZ);
  
  // 伪随机数生成
  const hash = (i: number, j: number, k: number): number => {
    const h = i + j * 57 + k * 973;
    return (h * (h + 1) * 41 + 7) % 256 / 255;
  };
  
  // 三线性插值
  const a = hash(intX, intY, intZ);
  const b = hash(intX + 1, intY, intZ);
  const c = hash(intX, intY + 1, intZ);
  const d = hash(intX + 1, intY + 1, intZ);
  const e = hash(intX, intY, intZ + 1);
  const f = hash(intX + 1, intY, intZ + 1);
  const g = hash(intX, intY + 1, intZ + 1);
  const h = hash(intX + 1, intY + 1, intZ + 1);
  
  return lerp(
    lerp(lerp(a, b, u), lerp(c, d, u), v),
    lerp(lerp(e, f, u), lerp(g, h, u), v),
    w
  );
};

/**
 * 检查点是否在矩形内
 */
export const isPointInRect = (x: number, y: number, rectX: number, rectY: number, rectWidth: number, rectHeight: number): boolean => {
  return x >= rectX && x <= rectX + rectWidth && y >= rectY && y <= rectY + rectHeight;
};

/**
 * 计算矩形边界
 */
export const calculateBoundingBox = (points: Vector2[]): { minX: number; minY: number; maxX: number; maxY: number; width: number; height: number } => {
  if (points.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 };
  }
  
  let minX = points[0].x;
  let minY = points[0].y;
  let maxX = points[0].x;
  let maxY = points[0].y;
  
  for (let i = 1; i < points.length; i++) {
    minX = Math.min(minX, points[i].x);
    minY = Math.min(minY, points[i].y);
    maxX = Math.max(maxX, points[i].x);
    maxY = Math.max(maxY, points[i].y);
  }
  
  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY
  };
};