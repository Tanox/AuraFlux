// src/components/visualizers/2d/plasma/utils.ts v2.3.10



export function mixColors(color1: string, color2: string, ratio: number): string {
  const parseColor = (color: string) => {
    const hex = color.replace('#', '');
    return {
      r: parseInt(hex.substring(0, 2), 16),
      g: parseInt(hex.substring(2, 4), 16),
      b: parseInt(hex.substring(4, 6), 16)
    };
  };

  const c1 = parseColor(color1);
  const c2 = parseColor(color2);

  const r = Math.round(c1.r * (1 - ratio) + c2.r * ratio);
  const g = Math.round(c1.g * (1 - ratio) + c2.g * ratio);
  const b = Math.round(c1.b * (1 - ratio) + c2.b * ratio);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * 3D 閫忚鎶曞奖
 */
export function project3D(
  x: number,
  y: number,
  z: number,
  centerX: number,
  centerY: number,
  focalLength: number
): { screenX: number; screenY: number; scale: number } {
  const scale = focalLength / (focalLength + z);
  const screenX = centerX + (x - centerX) * scale;
  const screenY = centerY + (y - centerY) * scale;
  return { screenX, screenY, scale };
}

/**
 * 璁＄畻闊抽鏁版嵁鐨勫钩鍧囧€? */
export function calculateAverage(dataArray: Uint8Array, sensitivity: number): number {
  let sum = 0;
  for (let i = 0; i < dataArray.length; i++) {
    sum += dataArray[i];
  }
  return (sum / dataArray.length / 255) * sensitivity;
}
