// src/components/visualizers/3d/hooks/useDigitalGrid.ts v2.3.10
import { useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { InstancedBufferAttribute } from 'three';
import { VisualizerSettings } from '@/types';

export const useDigitalGrid = (settings: VisualizerSettings) => {
  const { size } = useThree();
  
  const grid = useMemo(() => {
      const isHigh = settings.quality !== 'low', radius = 45, colStep = (isHigh ? 2.4 : 3.6) + 0.25, vFov = (55 * Math.PI) / 180, dist = 66;
      const h = size.height || 1, w = size.width || 1;
      const targetH = 2 * Math.tan(vFov / 2) * dist * 1.15, targetW = targetH * (w/h) * 1.2;
      let rows = Math.ceil(targetH / ((isHigh ? 0.6 : 0.9) + 0.12)), cols = Math.min(Math.ceil(targetW / colStep), Math.floor((Math.PI * 1.5 * radius) / colStep));
      if (rows % 2 === 0) rows++; if (cols % 2 === 0) cols++;
      return { RADIUS: radius, GAP_Y: 0.12, BRICK_W: isHigh ? 2.4 : 3.6, BRICK_H: isHigh ? 0.6 : 0.9, COLS: cols, ROWS: rows, COUNT: cols * rows, STEP: colStep / radius };
  }, [size.width, size.height, settings.quality]);

  const { lAttr, rAttr } = useMemo(() => {
      const l = new Float32Array(grid.COUNT * 3), r = new Float32Array(grid.COUNT);
      for(let i=0; i<grid.COUNT; i++) {
          const col = Math.floor(i / grid.ROWS), colNorm = (col / (grid.COLS - 1)) * 2 - 1;
          l[i*3] = Math.pow(Math.abs(colNorm), 1.5); l[i*3+1] = (i % grid.ROWS) / (grid.ROWS - 1); l[i*3+2] = 1.0 - Math.pow(Math.abs(colNorm), 5.0); r[i] = Math.random();
      }
      return { lAttr: new InstancedBufferAttribute(l, 3), rAttr: new InstancedBufferAttribute(r, 1) };
  }, [grid]);

  return { grid, lAttr, rAttr };
};
