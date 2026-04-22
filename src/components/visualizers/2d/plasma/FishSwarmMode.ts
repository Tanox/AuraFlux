// File: src/components/visualizers/2d/plasma/FishSwarmMode.ts | Version: v2.3.8

import { PlasmaModeProps } from '@/types';

interface FishParticle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  color: string;
  baseColor: string;
  rotation: number;
  rotationSpeed: number;
  group: number;
  leader: boolean;
  trail: { x: number; y: number; z: number }[];
}

class FishSwarmManager {
  private particles: FishParticle[] = [];
  private groupCount = 1; // 改为1个群组，使所有粒子组成一个鱼群
  private maxParticles = 2000; // 增加粒子数量以充满画面
  private currentParticles = 2000; // 当前粒子数量
  private leaders: FishParticle[] = [];
  private width: number = 1000;
  private height: number = 800;
  private aggregationPhase: number = 0;
  private performanceHistory: number[] = [];
  private lastAdjustmentTime = 0;
  private bassEnergy = 0; // 低频能量
  private midEnergy = 0; // 中频能量
  private trebleEnergy = 0; // 高频能量
  private cohesionStrength = 0.03; // 凝聚力
  private separationDistance = 8; // 分离距离
  private alignmentStrength = 0.08; // 对齐力
  private trailLength = 10; // 尾迹长度
  private colorResponse = 1.0; // 颜色响应强度

  constructor(width: number = 1000, height: number = 800, settings?: any) {
    this.width = width;
    this.height = height;
    
    // 应用配置
    if (settings) {
      this.maxParticles = settings.fishSwarmMaxParticles || 2000;
      this.currentParticles = this.maxParticles;
      this.cohesionStrength = settings.fishSwarmCohesion || 0.03;
      this.separationDistance = settings.fishSwarmSeparation || 8;
      this.alignmentStrength = settings.fishSwarmAlignment || 0.08;
      this.trailLength = settings.fishSwarmTrailLength || 10;
      this.colorResponse = settings.fishSwarmColorResponse || 1.0;
    }
    
    this.initializeParticles();
  }

  private initializeParticles(): void {
    for (let i = 0; i < this.maxParticles; i++) {
      const group = 0; // 所有粒子属于同一个群组
      const isLeader = i === 0; // 只有一个领导者
      
      // 初始化位置充满画面的一半（左侧或右侧）
      const halfWidth = this.width / 2;
      const x = halfWidth / 2 + (Math.random() - 0.5) * halfWidth; // 左侧一半区域
      const y = this.height / 2 + (Math.random() - 0.5) * this.height;
      
      const baseColor = this.getGroupColor(group);
      const particle: FishParticle = {
        x: x,
        y: y,
        z: (Math.random() - 0.5) * 200,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        vz: (Math.random() - 0.5) * 1,
        size: isLeader ? 2 + Math.random() * 1 : 1 + Math.random() * 0.5,
        color: baseColor,
        baseColor: baseColor,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.05,
        group,
        leader: isLeader,
        trail: []
      };

      this.particles.push(particle);
      if (isLeader) {
        this.leaders.push(particle);
      }
    }
  }

  private getGroupColor(group: number): string {
    const colors = [
      '#FFD700',
      '#FFA500',
      '#FF8C00',
      '#FFDAB9',
      '#F0E68C',
      '#E6E6FA'
    ];
    return colors[group % colors.length];
  }

  private calculateGroupCenter(group: number): { x: number, y: number, z: number } {
    const groupParticles = this.particles.filter(p => p.group === group);
    if (groupParticles.length === 0) {
      return { x: this.width / 2, y: this.height / 2, z: 0 };
    }

    const center = groupParticles.reduce(
      (acc, p) => {
        acc.x += p.x;
        acc.y += p.y;
        acc.z += p.z;
        return acc;
      },
      { x: 0, y: 0, z: 0 }
    );

    return {
      x: center.x / groupParticles.length,
      y: center.y / groupParticles.length,
      z: center.z / groupParticles.length
    };
  }

  private updateLeader(leader: FishParticle, time: number, averageEnergy: number = 0.5): void {
    const groupCenter = this.calculateGroupCenter(leader.group);
    const centerX = groupCenter.x;
    const centerY = groupCenter.y;
    const centerZ = groupCenter.z;

    // 基于频率的噪声调整
    const noiseX = Math.sin(time * 0.001 + leader.group) * 0.5 + this.trebleEnergy * 0.5;
    const noiseY = Math.cos(time * 0.0012 + leader.group) * 0.5 + this.trebleEnergy * 0.5;
    const noiseZ = Math.sin(time * 0.0008 + leader.group) * 0.3 + this.trebleEnergy * 0.2;

    // 低频影响中心吸引力
    const centerAttractionStrength = 0.005 - this.bassEnergy * 0.003;
    leader.vx += (centerX - leader.x) * centerAttractionStrength;
    leader.vy += (centerY - leader.y) * centerAttractionStrength;
    leader.vz += (centerZ - leader.z) * centerAttractionStrength * 0.5;

    // 高频增加随机运动
    leader.vx += noiseX * (0.1 + this.trebleEnergy * 0.2);
    leader.vy += noiseY * (0.1 + this.trebleEnergy * 0.2);
    leader.vz += noiseZ * (0.05 + this.trebleEnergy * 0.1);

    // 低频增加最大速度
    const maxSpeed = 3 + averageEnergy * 2 + this.bassEnergy * 3;
    const speed = Math.sqrt(leader.vx * leader.vx + leader.vy * leader.vy);
    if (speed > maxSpeed) {
      leader.vx = (leader.vx / speed) * maxSpeed;
      leader.vy = (leader.vy / speed) * maxSpeed;
    }

    leader.x += leader.vx;
    leader.y += leader.vy;
    leader.z += leader.vz;

    // 确保领导者保持在画面的一半区域内
    const halfWidth = this.width / 2;
    const boundaryMargin = 50;
    if (leader.x < boundaryMargin) {
      leader.vx += 0.1;
    } else if (leader.x > halfWidth - boundaryMargin) {
      leader.vx -= 0.1;
    }
    if (leader.y < boundaryMargin) {
      leader.vy += 0.1;
    } else if (leader.y > this.height - boundaryMargin) {
      leader.vy -= 0.1;
    }
    if (leader.z < -100) {
      leader.vz += 0.05;
    } else if (leader.z > 100) {
      leader.vz -= 0.05;
    }

    leader.rotation = Math.atan2(leader.vy, leader.vx);
  }

  private updateFollower(follower: FishParticle, leader: FishParticle, time: number, averageEnergy: number = 0.5): void {
    const dx = leader.x - follower.x;
    const dy = leader.y - follower.y;
    const dz = leader.z - follower.z;
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

    const groupParticles = this.particles.filter(p => p.group === follower.group && !p.leader);
    let nearNeighbors = 0;
    let neighborX = 0;
    let neighborY = 0;
    let neighborZ = 0;

    groupParticles.forEach(neighbor => {
      if (neighbor !== follower) {
        const ndx = neighbor.x - follower.x;
        const ndy = neighbor.y - follower.y;
        const ndz = neighbor.z - follower.z;
        const ndistance = Math.sqrt(ndx * ndx + ndy * ndy + ndz * ndz);
        
        if (ndistance < 50) {
          nearNeighbors++;
          neighborX += neighbor.x;
          neighborY += neighbor.y;
          neighborZ += neighbor.z;
        }
      }
    });

    // 根据声音强度调整聚集/扩散行为
    // 低能量时聚拢，高能量时扩散
    const aggregationFactor = 1 - averageEnergy; // 声音越大，聚集因子越小
    
    // 凝聚力：声音越小，凝聚力越强，中频影响凝聚力
    const cohesionStrength = (this.cohesionStrength + (1 - averageEnergy) * 0.02 + this.midEnergy * 0.01) * (1 + aggregationFactor);
    if (distance > 0) {
      follower.vx += (dx / distance) * cohesionStrength;
      follower.vy += (dy / distance) * cohesionStrength;
      follower.vz += (dz / distance) * cohesionStrength * 0.5;
    }

    if (nearNeighbors > 0) {
      const neighborCenterX = neighborX / nearNeighbors;
      const neighborCenterY = neighborY / nearNeighbors;
      const neighborCenterZ = neighborZ / nearNeighbors;
      
      const neighborCohesionStrength = 0.015 * (1 + aggregationFactor);
      follower.vx += (neighborCenterX - follower.x) * neighborCohesionStrength;
      follower.vy += (neighborCenterY - follower.y) * neighborCohesionStrength;
      follower.vz += (neighborCenterZ - follower.z) * neighborCohesionStrength * 0.5;
    }

    // 分离距离：声音越大，分离距离越大，低频影响分离距离
    const separationDistance = this.separationDistance + averageEnergy * 12 + this.bassEnergy * 5;
    if (distance < separationDistance && distance > 0) {
      const separationStrength = 0.03 * (1 + averageEnergy);
      follower.vx -= (dx / distance) * separationStrength;
      follower.vy -= (dy / distance) * separationStrength;
      follower.vz -= (dz / distance) * separationStrength * 0.5;
    }

    groupParticles.forEach(neighbor => {
      if (neighbor !== follower) {
        const ndx = neighbor.x - follower.x;
        const ndy = neighbor.y - follower.y;
        const ndz = neighbor.z - follower.z;
        const ndistance = Math.sqrt(ndx * ndx + ndy * ndy + ndz * ndz);
        
        if (ndistance < separationDistance && ndistance > 0) {
          const neighborSeparationStrength = 0.02 * (1 + averageEnergy);
          follower.vx -= (ndx / ndistance) * neighborSeparationStrength;
          follower.vy -= (ndy / ndistance) * neighborSeparationStrength;
          follower.vz -= (ndz / ndistance) * neighborSeparationStrength * 0.5;
        }
      }
    });

    // 中频影响对齐力
    const alignmentStrength = this.alignmentStrength + this.midEnergy * 0.04;
    follower.vx += (leader.vx - follower.vx) * alignmentStrength;
    follower.vy += (leader.vy - follower.vy) * alignmentStrength;
    follower.vz += (leader.vz - follower.vz) * alignmentStrength * 0.5;

    if (nearNeighbors > 0) {
      const neighborAvgVx = groupParticles.reduce((sum, p) => sum + p.vx, 0) / groupParticles.length;
      const neighborAvgVy = groupParticles.reduce((sum, p) => sum + p.vy, 0) / groupParticles.length;
      const neighborAvgVz = groupParticles.reduce((sum, p) => sum + p.vz, 0) / groupParticles.length;
      
      const neighborAlignmentStrength = 0.04;
      follower.vx += (neighborAvgVx - follower.vx) * neighborAlignmentStrength;
      follower.vy += (neighborAvgVy - follower.vy) * neighborAlignmentStrength;
      follower.vz += (neighborAvgVz - follower.vz) * neighborAlignmentStrength * 0.5;
    }

    // 高频增加随机运动
    const noiseStrength = 0.03 + averageEnergy * 0.02 + this.trebleEnergy * 0.03; // 声音越大，随机运动越强
    follower.vx += (Math.random() - 0.5) * noiseStrength;
    follower.vy += (Math.random() - 0.5) * noiseStrength;
    follower.vz += (Math.random() - 0.5) * noiseStrength * 0.5;

    // 低频增加最大速度
    const maxSpeed = 2.5 + averageEnergy * 2 + this.bassEnergy * 2; // 声音越大，速度越快
    const speed = Math.sqrt(follower.vx * follower.vx + follower.vy * follower.vy);
    if (speed > maxSpeed) {
      follower.vx = (follower.vx / speed) * maxSpeed;
      follower.vy = (follower.vy / speed) * maxSpeed;
    }

    follower.x += follower.vx;
    follower.y += follower.vy;
    follower.z += follower.vz;

    // 确保粒子保持在画面的一半区域内
    const halfWidth = this.width / 2;
    if (follower.x < 0) {
      follower.x = 0;
      follower.vx *= -0.5;
    } else if (follower.x > halfWidth) {
      follower.x = halfWidth;
      follower.vx *= -0.5;
    }
    if (follower.y < 0) {
      follower.y = 0;
      follower.vy *= -0.5;
    } else if (follower.y > this.height) {
      follower.y = this.height;
      follower.vy *= -0.5;
    }

    follower.rotation = Math.atan2(follower.vy, follower.vx);
  }

  update(time: number, width: number, height: number, averageEnergy: number = 0.5, frequencyData?: { bass: number, mid: number, treble: number }): void {
    const startTime = performance.now();
    
    this.width = width;
    this.height = height;

    // 更新频率能量数据
    if (frequencyData) {
      this.bassEnergy = frequencyData.bass;
      this.midEnergy = frequencyData.mid;
      this.trebleEnergy = frequencyData.treble;
    }

    this.aggregationPhase += 0.005;
    if (this.aggregationPhase > Math.PI * 2) {
      this.aggregationPhase = 0;
    }

    // 只更新当前数量的粒子
    const particlesToUpdate = this.particles.slice(0, this.currentParticles);
    
    this.leaders.forEach(leader => {
      this.updateLeader(leader, time, averageEnergy);
      // 更新领导者尾迹
      this.updateParticleTrail(leader, averageEnergy);
      // 更新领导者颜色
      this.updateParticleColor(leader, averageEnergy);
    });

    particlesToUpdate.forEach(particle => {
      if (!particle.leader) {
        const leader = this.leaders[particle.group];
        this.updateFollower(particle, leader, time, averageEnergy);
        // 更新跟随者尾迹
        this.updateParticleTrail(particle, averageEnergy);
        // 更新跟随者颜色
        this.updateParticleColor(particle, averageEnergy);
      }
    });

    // 性能检测和粒子数量调整
    const executionTime = performance.now() - startTime;
    this.performanceHistory.push(executionTime);
    
    // 只保留最近的10个性能数据
    if (this.performanceHistory.length > 10) {
      this.performanceHistory.shift();
    }
    
    // 每2秒调整一次粒子数量
    if (time - this.lastAdjustmentTime > 2000) {
      const avgExecutionTime = this.performanceHistory.reduce((sum, val) => sum + val, 0) / this.performanceHistory.length;
      
      // 根据执行时间调整粒子数量
      if (avgExecutionTime > 16) { // 超过60fps的阈值
        // 性能不好，减少粒子数量
        this.currentParticles = Math.max(500, this.currentParticles - 200);
      } else if (avgExecutionTime < 8) { // 性能很好，增加粒子数量
        // 性能好，增加粒子数量
        this.currentParticles = Math.min(this.maxParticles, this.currentParticles + 200);
      }
      
      this.lastAdjustmentTime = time;
    }
  }

  getParticles(): FishParticle[] {
    return this.particles.slice(0, this.currentParticles);
  }

  private updateParticleTrail(particle: FishParticle, averageEnergy: number): void {
    // 根据速度和音频能量计算尾迹长度
    const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
    const trailLength = Math.floor(this.trailLength + speed * 2 + averageEnergy * 3);
    
    // 添加当前位置到尾迹
    particle.trail.push({ x: particle.x, y: particle.y, z: particle.z });
    
    // 限制尾迹长度
    if (particle.trail.length > trailLength) {
      particle.trail.shift();
    }
  }

  private updateParticleColor(particle: FishParticle, averageEnergy: number): void {
    // 根据音频能量和频率数据调整颜色
    // 低频（bass）影响颜色的红色分量
    // 中频（mid）影响颜色的绿色分量
    // 高频（treble）影响颜色的蓝色分量
    
    // 将基础颜色转换为RGB
    const baseRgb = this.hexToRgb(particle.baseColor);
    if (!baseRgb) return;
    
    // 根据频率能量调整RGB分量
    const response = this.colorResponse;
    const r = Math.min(255, Math.floor(baseRgb.r + this.bassEnergy * 100 * response));
    const g = Math.min(255, Math.floor(baseRgb.g + this.midEnergy * 100 * response));
    const b = Math.min(255, Math.floor(baseRgb.b + this.trebleEnergy * 100 * response));
    
    // 转换回十六进制颜色
    particle.color = this.rgbToHex(r, g, b);
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  private rgbToHex(r: number, g: number, b: number): string {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
}

let fishSwarmManager: FishSwarmManager | null = null;
let lastSettings: any = null;

export const renderFishSwarmMode = ({
  ctx,
  dataArray,
  width,
  height,
  colors,
  settings
}: PlasmaModeProps) => {
  const sensitivity = settings?.sensitivity || 1;
  const glow = settings?.glow ?? true;
  const trails = settings?.trails ?? true;
  const time = Date.now();
  
  // 检查配置是否变化
  const settingsChanged = JSON.stringify(settings) !== JSON.stringify(lastSettings);
  if (!fishSwarmManager || settingsChanged) {
    fishSwarmManager = new FishSwarmManager(width, height, settings);
    lastSettings = settings;
  }
  
  // 计算平均能量
  const averageEnergy = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length / 255 * sensitivity;
  
  // 提取频率能量
  const frequencyData = {
    bass: 0,
    mid: 0,
    treble: 0
  };
  
  // 假设dataArray是频率数据，前1/4是低频，中间1/2是中频，后1/4是高频
  const bassEnd = Math.floor(dataArray.length * 0.25);
  const midEnd = Math.floor(dataArray.length * 0.75);
  
  for (let i = 0; i < dataArray.length; i++) {
    if (i < bassEnd) {
      frequencyData.bass += dataArray[i];
    } else if (i < midEnd) {
      frequencyData.mid += dataArray[i];
    } else {
      frequencyData.treble += dataArray[i];
    }
  }
  
  // 归一化频率能量
  frequencyData.bass = (frequencyData.bass / (bassEnd * 255)) * sensitivity;
  frequencyData.mid = (frequencyData.mid / ((midEnd - bassEnd) * 255)) * sensitivity;
  frequencyData.treble = (frequencyData.treble / ((dataArray.length - midEnd) * 255)) * sensitivity;
  
  fishSwarmManager.update(time, width, height, averageEnergy, frequencyData);
  const particles = fishSwarmManager.getParticles();
  
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  
  particles.forEach(particle => {
    const scale = 1 + (particle.z / 200);
    const alpha = 0.8 + (particle.z / 400);
    const finalSize = particle.size * scale;
    
    // 渲染尾迹（如果启用）
    if (trails && particle.trail.length > 1) {
      ctx.save();
      ctx.globalAlpha = alpha * 0.5;
      ctx.strokeStyle = particle.color;
      ctx.lineWidth = finalSize * 0.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      ctx.beginPath();
      ctx.moveTo(particle.trail[0].x, particle.trail[0].y);
      
      for (let i = 1; i < particle.trail.length; i++) {
        const progress = i / (particle.trail.length - 1);
        const trailAlpha = 0.1 + (1 - progress) * 0.4;
        ctx.globalAlpha = alpha * trailAlpha;
        
        ctx.lineTo(particle.trail[i].x, particle.trail[i].y);
      }
      
      ctx.stroke();
      ctx.restore();
    }
    
    // 渲染鱼形粒子
    ctx.save();
    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.rotation); // 旋转粒子朝向运动方向
    ctx.globalAlpha = alpha;
    
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    // 绘制鱼形
    ctx.moveTo(finalSize * 0.5, 0);
    ctx.quadraticCurveTo(finalSize, -finalSize * 0.3, finalSize * 1.2, 0);
    ctx.quadraticCurveTo(finalSize, finalSize * 0.3, finalSize * 0.5, 0);
    ctx.quadraticCurveTo(-finalSize * 0.2, -finalSize * 0.1, -finalSize * 0.3, 0);
    ctx.quadraticCurveTo(-finalSize * 0.2, finalSize * 0.1, finalSize * 0.5, 0);
    ctx.fill();
    
    // 绘制发光效果（如果启用）
    if (glow) {
      ctx.globalAlpha = 0.6 * alpha * averageEnergy;
      const glowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, finalSize * 2);
      glowGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
      glowGradient.addColorStop(0.3, particle.color);
      glowGradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(0, 0, finalSize * 2, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  });
  
  ctx.restore();
};