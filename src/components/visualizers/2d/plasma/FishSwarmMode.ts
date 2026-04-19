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
  private width: number = 1000;
  private height: number = 800;

  constructor(width: number = 1000, height: number = 800) {
    this.width = width;
    this.height = height;
    this.initializeParticles();
  }

  private initializeParticles(): void {
    for (let i = 0; i < this.maxParticles; i++) {
      const group = i % this.groupCount;
      const isLeader = i < this.groupCount;
      
      const particle: FishParticle = {
        x: Math.random() * this.width,
        y: Math.random() * this.height,
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
      '#FF6B6B',
      '#4ECDC4',
      '#45B7D1',
      '#96CEB4',
      '#FFEAA7',
      '#DDA0DD'
    ];
    return colors[group % colors.length];
  }

  private updateLeader(leader: FishParticle, time: number): void {
    const noiseX = Math.sin(time * 0.001 + leader.group) * 0.5;
    const noiseY = Math.cos(time * 0.0012 + leader.group) * 0.5;
    const noiseZ = Math.sin(time * 0.0008 + leader.group) * 0.3;

    leader.vx += noiseX * 0.1;
    leader.vy += noiseY * 0.1;
    leader.vz += noiseZ * 0.05;

    const maxSpeed = 3;
    const speed = Math.sqrt(leader.vx * leader.vx + leader.vy * leader.vy);
    if (speed > maxSpeed) {
      leader.vx = (leader.vx / speed) * maxSpeed;
      leader.vy = (leader.vy / speed) * maxSpeed;
    }

    leader.x += leader.vx;
    leader.y += leader.vy;
    leader.z += leader.vz;

    if (leader.x < 0 || leader.x > this.width) leader.vx *= -0.8;
    if (leader.y < 0 || leader.y > this.height) leader.vy *= -0.8;
    if (leader.z < -100 || leader.z > 100) leader.vz *= -0.8;

    leader.rotation += leader.rotationSpeed;
  }

  private updateFollower(follower: FishParticle, leader: FishParticle, time: number): void {
    const dx = leader.x - follower.x;
    const dy = leader.y - follower.y;
    const dz = leader.z - follower.z;
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

    const cohesionStrength = 0.01;
    if (distance > 0) {
      follower.vx += (dx / distance) * cohesionStrength;
      follower.vy += (dy / distance) * cohesionStrength;
      follower.vz += (dz / distance) * cohesionStrength * 0.5;
    }

    const separationDistance = 20;
    if (distance < separationDistance && distance > 0) {
      const separationStrength = 0.02;
      follower.vx -= (dx / distance) * separationStrength;
      follower.vy -= (dy / distance) * separationStrength;
      follower.vz -= (dz / distance) * separationStrength * 0.5;
    }

    const alignmentStrength = 0.05;
    follower.vx += (leader.vx - follower.vx) * alignmentStrength;
    follower.vy += (leader.vy - follower.vy) * alignmentStrength;
    follower.vz += (leader.vz - follower.vz) * alignmentStrength * 0.5;

    const noiseStrength = 0.05;
    follower.vx += (Math.random() - 0.5) * noiseStrength;
    follower.vy += (Math.random() - 0.5) * noiseStrength;
    follower.vz += (Math.random() - 0.5) * noiseStrength * 0.5;

    const maxSpeed = 2.5;
    const speed = Math.sqrt(follower.vx * follower.vx + follower.vy * follower.vy);
    if (speed > maxSpeed) {
      follower.vx = (follower.vx / speed) * maxSpeed;
      follower.vy = (follower.vy / speed) * maxSpeed;
    }

    follower.x += follower.vx;
    follower.y += follower.vy;
    follower.z += follower.vz;

    follower.rotation = Math.atan2(follower.vy, follower.vx);
    follower.rotationSpeed = (Math.random() - 0.5) * 0.03;
    follower.rotation += follower.rotationSpeed;
  }

  update(time: number, width: number, height: number): void {
    this.width = width;
    this.height = height;

    this.leaders.forEach(leader => {
      this.updateLeader(leader, time);
    });

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

let fishSwarmManager: FishSwarmManager | null = null;

export const renderFishSwarmMode = ({
  ctx,
  dataArray,
  width,
  height,
  colors,
  sensitivity
}: PlasmaModeProps) => {
  const time = Date.now();
  
  if (!fishSwarmManager) {
    fishSwarmManager = new FishSwarmManager(width, height);
  }
  
  fishSwarmManager.update(time, width, height);
  const particles = fishSwarmManager.getParticles();
  
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  
  particles.forEach(particle => {
    const scale = 1 + (particle.z / 200);
    const alpha = 0.8 + (particle.z / 400);
    
    ctx.save();
    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.rotation);
    ctx.scale(scale, scale);
    ctx.globalAlpha = alpha;
    
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.moveTo(particle.size * 2, 0);
    ctx.quadraticCurveTo(particle.size * 1.5, -particle.size, 0, -particle.size * 0.5);
    ctx.quadraticCurveTo(-particle.size, -particle.size * 0.3, -particle.size, 0);
    ctx.quadraticCurveTo(-particle.size, particle.size * 0.3, 0, particle.size * 0.5);
    ctx.quadraticCurveTo(particle.size * 1.5, particle.size, particle.size * 2, 0);
    ctx.fill();
    
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(particle.size, 0, particle.size * 0.2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  });
  
  ctx.restore();
};