// File: src/utils/performance/DevicePerformance.ts | Version: v2.3.5

/**
 * 设备性能等级
 */
export enum PerformanceLevel {
  LOW = 'low',
  MEDIUM = 'med',
  HIGH = 'high'
}

/**
 * 性能检测结果
 */
export interface PerformanceTestResult {
  level: PerformanceLevel;
  gpuScore: number;
  cpuScore: number;
  memoryScore: number;
  webglSupport: boolean;
  webgl2Support: boolean;
}

/**
 * 设备性能检测器
 */
export class DevicePerformance {
  private static instance: DevicePerformance;
  private testResult: PerformanceTestResult | null = null;

  private constructor() {}

  /**
   * 获取单例实例
   */
  public static getInstance(): DevicePerformance {
    if (!DevicePerformance.instance) {
      DevicePerformance.instance = new DevicePerformance();
    }
    return DevicePerformance.instance;
  }

  /**
   * 运行性能测试
   */
  public async runPerformanceTest(): Promise<PerformanceTestResult> {
    if (this.testResult) {
      return this.testResult;
    }

    const [gpuScore, webglSupport, webgl2Support] = await this.testGPU();
    const cpuScore = this.testCPU();
    const memoryScore = this.testMemory();

    const level = this.calculatePerformanceLevel(gpuScore, cpuScore, memoryScore, webgl2Support);

    this.testResult = {
      level,
      gpuScore,
      cpuScore,
      memoryScore,
      webglSupport,
      webgl2Support
    };

    return this.testResult;
  }

  /**
   * 测试GPU性能
   */
  private async testGPU(): Promise<[number, boolean, boolean]> {
    let canvas: HTMLCanvasElement | null = null;
    let gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;
    let webglSupport = false;
    let webgl2Support = false;

    try {
      canvas = document.createElement('canvas');
      
      // 尝试WebGL2
      gl = canvas.getContext('webgl2');
      if (gl) {
        webgl2Support = true;
      } else {
        // 尝试WebGL1
        gl = canvas.getContext('webgl');
        if (gl) {
          webglSupport = true;
        }
      }

      if (!gl) {
        return [0, false, false];
      }

      // 简单的GPU性能测试
      const startTime = performance.now();
      const program = this.createSimpleProgram(gl);
      if (!program) {
        return [0, webglSupport, webgl2Support];
      }

      // 创建大量顶点
      const vertexCount = 100000;
      const vertices = new Float32Array(vertexCount * 3);
      for (let i = 0; i < vertexCount * 3; i++) {
        vertices[i] = (Math.random() - 0.5) * 2;
      }

      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

      const positionLocation = gl.getAttribLocation(program, 'a_position');
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

      gl.useProgram(program);

      // 渲染多次
      const renderCount = 100;
      for (let i = 0; i < renderCount; i++) {
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, vertexCount / 3);
      }

      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // 计算GPU分数 (渲染时间越短分数越高)
      const gpuScore = Math.max(0, Math.min(100, 1000 / (renderTime / renderCount)));

      return [gpuScore, webglSupport, webgl2Support];
    } catch (error) {
      console.warn('GPU test failed:', error);
      return [0, false, false];
    } finally {
      if (canvas) {
        canvas.remove();
      }
    }
  }

  /**
   * 创建简单的WebGL程序
   */
  private createSimpleProgram(gl: WebGLRenderingContext | WebGL2RenderingContext): WebGLProgram | null {
    const vertexShaderSource = `
      attribute vec3 a_position;
      void main() {
        gl_Position = vec4(a_position, 1.0);
      }
    `;

    const fragmentShaderSource = `
      void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
      }
    `;

    const vertexShader = this.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = this.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertexShader || !fragmentShader) {
      return null;
    }

    const program = gl.createProgram();
    if (!program) {
      return null;
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }

    return program;
  }

  /**
   * 创建Shader
   */
  private createShader(gl: WebGLRenderingContext | WebGL2RenderingContext, type: number, source: string): WebGLShader | null {
    const shader = gl.createShader(type);
    if (!shader) {
      return null;
    }

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  /**
   * 测试CPU性能
   */
  private testCPU(): number {
    const startTime = performance.now();
    
    // 执行一些计算密集型操作
    let result = 0;
    for (let i = 0; i < 10000000; i++) {
      result += Math.sqrt(i) * Math.sin(i) * Math.cos(i);
    }
    
    const endTime = performance.now();
    const executionTime = endTime - startTime;
    
    // 计算CPU分数 (执行时间越短分数越高)
    const cpuScore = Math.max(0, Math.min(100, 1000 / executionTime));
    
    return cpuScore;
  }

  /**
   * 测试内存
   */
  private testMemory(): number {
    try {
      // 测试可用内存
      const memoryInfo = (performance as any).memory;
      if (memoryInfo) {
        const usedMemory = memoryInfo.usedJSHeapSize;
        const totalMemory = memoryInfo.totalJSHeapSize;
        const memoryScore = Math.max(0, Math.min(100, (totalMemory - usedMemory) / 1048576)); // MB
        return memoryScore;
      }
    } catch (error) {
      console.warn('Memory test failed:', error);
    }
    
    // 基于设备类型的估计
    return navigator.deviceMemory || 4;
  }

  /**
   * 计算性能等级
   */
  private calculatePerformanceLevel(gpuScore: number, cpuScore: number, memoryScore: number, webgl2Support: boolean): PerformanceLevel {
    // 加权计算总分
    const totalScore = (gpuScore * 0.5) + (cpuScore * 0.3) + (memoryScore * 0.2);
    
    if (!webgl2Support) {
      return PerformanceLevel.LOW;
    }
    
    if (totalScore >= 70) {
      return PerformanceLevel.HIGH;
    } else if (totalScore >= 40) {
      return PerformanceLevel.MEDIUM;
    } else {
      return PerformanceLevel.LOW;
    }
  }

  /**
   * 获取当前性能等级
   */
  public async getPerformanceLevel(): Promise<PerformanceLevel> {
    const result = await this.runPerformanceTest();
    return result.level;
  }

  /**
   * 重置测试结果
   */
  public reset(): void {
    this.testResult = null;
  }
}
