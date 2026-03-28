// File: src/components/visualizers/modes/FluidCurvesMode.ts | Version: v2.0.4

interface FluidCurvesModeProps {
  ctx: CanvasRenderingContext2D;
  dataArray: Uint8Array;
  width: number;
  height: number;
  colors: string[];
  sensitivity: number;
}

/**
 * 渲染FLUID_CURVES模式的可视化效果
 */
export const renderFluidCurvesMode = ({
  ctx,
  dataArray,
  width,
  height,
  colors,
  sensitivity
}: FluidCurvesModeProps) => {
  const time = Date.now() * 0.001;
  ctx.lineWidth = 3;
  
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.strokeStyle = colors[i % colors.length];
    
    for (let x = 0; x < width; x += 10) {
      const dataIndex = Math.floor((x / width) * dataArray.length);
      const val = dataArray[dataIndex] / 255;
      
      const y = height / 2 + Math.sin(x * 0.01 + time + i) * (height * 0.2) * (1 + val * sensitivity);
      
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
};
