// File: src/components/visualizers/2d/plasma/FishSwarmMode.ts | Version: v2.3.3

import { PlasmaModeProps } from './types';

interface FishParticle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  group: number;
  leader: boolean;
}

class FishSwarmManager {
  private particles: FishParticle[] = [];
  private groupCount = 3;
  private maxParticles = 200;
  private leaders: FishParticle[] = [];

  constructor() {
    this.initializeParticles();
  }

  private initializeParticles(): void {
    for (let i = 0; i < this.maxParticles; i++) {
      const group = i % this.groupCount;
      const isLeader = i < this.groupCount;
      
      const particle: FishParticle = {
        x: Math.random() * 1000,
        y: Math.random() * 800,
        z: (Math.random() - 0.5) * 200,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        vz: (Math.random() - 0.5) * 1,
        size: isLeader ? 8 + Math.random() * 4 : 4 + Math.random() * 3,
        color: this.getGroupColor(group),
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.05,
        group,
        leader: isLeader
      };

      this.particles.push(particle);
      if (isLeader) {
        this.leaders.push(particle);
      }
    }
  }

  private getGroupColor(group: number): string {
    const colors = [
      '#FF6B6B', // 红色
      '#4ECDC4', // 青色
      '#45B7D1', // 蓝色
      '#96CEB4', // 绿色
      '#FFEAA7', // 黄色
      '#DDA0DD'  // 紫色
    ];
    return colors[group % colors.length];
  }

  private updateLeader(leader: FishParticle, time: number): void {
    // 领导者随机移动
    const noiseX = Math.sin(time * 0.001 + leader.group) * 0.5;
    const noiseY = Math.cos(time * 0.0012 + leader.group) * 0.5;
    const noiseZ = Math.sin(time * 0.0008 + leader.group) * 0.3;

    leader.vx += noiseX * 0.1;
    leader.vy += noiseY * 0.1;
    leader.vz += noiseZ * 0.05;

    // 限制速度
    const maxSpeed = 3;
    const speed = Math.sqrt(leader.vx * leader.vx + leader.vy * leader.vy);
    if (speed > maxSpeed) {
      leader.vx = (leader.vx / speed) * maxSpeed;
      leader.vy = (leader.vy / speed) * maxSpeed;
    }

    // 更新位置
    leader.x += leader.vx;
    leader.y += leader.vy;
    leader.z += leader.vz;

    // 边界反弹
    if (leader.x < 0 || leader.x > 1000) leader.vx *= -0.8;
    if (leader.y < 0 || leader.y > 800) leader.vy *= -0.8;
    if (leader.z < -100 || leader.z > 100) leader.vz *= -0.8;

    // 旋转
    leader.rotation += leader.rotationSpeed;
  }

  private updateFollower(follower: FishParticle, leader: FishParticle, time: number): void {
    // 跟随领导者
    const dx = leader.x - follower.x;
    const dy = leader.y - follower.y;
    const dz = leader.z - follower.z;
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

    // 凝聚力
    const cohesionStrength = 0.01;
    if (distance > 0) {
      follower.vx += (dx / distance) * cohesionStrength;
      follower.vy += (dy / distance) * cohesionStrength;
      follower.vz += (dz / distance) * cohesionStrength * 0.5;
    }

    // 分离力
    const separationDistance = 20;
    if (distance < separationDistance && distance > 0) {
      const separationStrength = 0.02;
      follower.vx -= (dx / distance) * separationStrength;
      follower.vy -= (dy / distance) * separationStrength;
      follower.vz -= (dz / distance) * separationStrength * 0.5;
    }

    // 速度匹配
    const alignmentStrength = 0.05;
    follower.vx += (leader.vx - follower.vx) * alignmentStrength;
    follower.vy += (leader.vy - follower.vy) * alignmentStrength;
    follower.vz += (leader.vz - follower.vz) * alignmentStrength * 0.5;

    // 随机扰动
    const noiseStrength = 0.05;
    follower.vx += (Math.random() - 0.5) * noiseStrength;
    follower.vy += (Math.random() - 0.5) * noiseStrength;
    follower.vz += (Math.random() - 0.5) * noiseStrength * 0.5;

    // 限制速度
    const maxSpeed = 2.5;
    const speed = Math.sqrt(follower.vx * follower.vx + follower.vy * follower.vy);
    if (speed > maxSpeed) {
      follower.vx = (follower.vx / speed) * maxSpeed;
      follower.vy = (follower.vy / speed) * maxSpeed;
    }

    // 更新位置
    follower.x += follower.vx;
    follower.y += follower.vy;
    follower.z += follower.vz;

    // 旋转 - 朝向移动方向
    follower.rotation = Math.atan2(follower.vy, follower.vx);
    follower.rotationSpeed = (Math.random() - 0.5) * 0.03;
    follower.rotation += follower.rotationSpeed;
  }

  update(time: number, width: number, height: number): void {
    // 更新领导者
    this.leaders.forEach(leader => {
      this.updateLeader(leader, time);
    });

    // 更新跟随者
    this.particles.forEach(particle => {
      if (!particle.leader) {
        const leader = this.leaders[particle.group];
        this.updateFollower(particle, leader, time);
      }
    });
  }

  getParticles(): FishParticle[] {
    return this.particles;
  }
}

// 创建实例
const fishSwarmManager = new FishSwarmManager();

/**
 * 渲染鱼群粒子模式
 */
export const renderFishSwarmMode = ({
  ctx,
  dataArray,
  width,
  height,
  colors,
  sensitivity
}: PlasmaModeProps) => {
  const time = Date.now();
  
  // 更新鱼群
  fishSwarmManager.update(time, width, height);
  const particles = fishSwarmManager.getParticles();
  
  // 保存Canvas状态
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  
  // 绘制粒子
  particles.forEach(particle => {
    const scale = 1 + (particle.z / 200);
    const alpha = 0.8 + (particle.z / 400);
    
    ctx.save();
    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.rotation);
    ctx.scale(scale, scale);
    ctx.globalAlpha = alpha;
    
    // 绘制鱼形
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.moveTo(particle.size * 2, 0);
    ctx.quadraticCurveTo(particle.size * 1.5, -particle.size, 0, -particle.size * 0.5);
    ctx.quadraticCurveTo(-particle.size, -particle.size * 0.3, -particle.size, 0);
    ctx.quadraticCurveTo(-particle.size, particle.size * 0.3, 0, particle.size * 0.5);
    ctx.quadraticCurveTo(particle.size * 1.5, particle.size, particle.size * 2, 0);
    ctx.fill();
    
    // 绘制眼睛
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(particle.size, 0, particle.size * 0.2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  });
  
  // 恢复Canvas状态
  ctx.restore();
};
