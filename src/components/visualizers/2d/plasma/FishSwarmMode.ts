// File: src/components/visualizers/2d/plasma/FishSwarmMode.ts | Version: v2.3.6

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
  private maxParticles = 1500;
  private leaders: FishParticle[] = [];
  private width: number = 1000;
  private height: number = 800;
  private aggregationPhase: number = 0;

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
        x: this.width / 2 + (Math.random() - 0.5) * 200,
        y: this.height / 2 + (Math.random() - 0.5) * 200,
        z: (Math.random() - 0.5) * 200,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        vz: (Math.random() - 0.5) * 1,
        size: isLeader ? 2 + Math.random() * 1 : 1 + Math.random() * 0.5,
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

    const noiseX = Math.sin(time * 0.001 + leader.group) * 0.5;
    const noiseY = Math.cos(time * 0.0012 + leader.group) * 0.5;
    const noiseZ = Math.sin(time * 0.0008 + leader.group) * 0.3;

    const centerAttractionStrength = 0.005;
    leader.vx += (centerX - leader.x) * centerAttractionStrength;
    leader.vy += (centerY - leader.y) * centerAttractionStrength;
    leader.vz += (centerZ - leader.z) * centerAttractionStrength * 0.5;

    leader.vx += noiseX * 0.1;
    leader.vy += noiseY * 0.1;
    leader.vz += noiseZ * 0.05;

    const maxSpeed = 3 + averageEnergy * 2;
    const speed = Math.sqrt(leader.vx * leader.vx + leader.vy * leader.vy);
    if (speed > maxSpeed) {
      leader.vx = (leader.vx / speed) * maxSpeed;
      leader.vy = (leader.vy / speed) * maxSpeed;
    }

    leader.x += leader.vx;
    leader.y += leader.vy;
    leader.z += leader.vz;

    const boundaryMargin = 100;
    if (leader.x < boundaryMargin) {
      leader.vx += 0.1;
    } else if (leader.x > this.width - boundaryMargin) {
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

    const aggregationFactor = Math.sin(this.aggregationPhase) * 0.5 + 0.5;
    const cohesionStrength = (0.02 + averageEnergy * 0.01) * (1 + aggregationFactor);
    if (distance > 0) {
      follower.vx += (dx / distance) * cohesionStrength;
      follower.vy += (dy / distance) * cohesionStrength;
      follower.vz += (dz / distance) * cohesionStrength * 0.5;
    }

    if (nearNeighbors > 0) {
      const neighborCenterX = neighborX / nearNeighbors;
      const neighborCenterY = neighborY / nearNeighbors;
      const neighborCenterZ = neighborZ / nearNeighbors;
      
      const neighborCohesionStrength = 0.01 * (1 + aggregationFactor);
      follower.vx += (neighborCenterX - follower.x) * neighborCohesionStrength;
      follower.vy += (neighborCenterY - follower.y) * neighborCohesionStrength;
      follower.vz += (neighborCenterZ - follower.z) * neighborCohesionStrength * 0.5;
    }

    const separationDistance = 10 - averageEnergy * 3;
    if (distance < separationDistance && distance > 0) {
      const separationStrength = 0.03 * (2 - aggregationFactor);
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
          const neighborSeparationStrength = 0.02 * (2 - aggregationFactor);
          follower.vx -= (ndx / ndistance) * neighborSeparationStrength;
          follower.vy -= (ndy / ndistance) * neighborSeparationStrength;
          follower.vz -= (ndz / ndistance) * neighborSeparationStrength * 0.5;
        }
      }
    });

    const alignmentStrength = 0.08;
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

    const noiseStrength = 0.03;
    follower.vx += (Math.random() - 0.5) * noiseStrength;
    follower.vy += (Math.random() - 0.5) * noiseStrength;
    follower.vz += (Math.random() - 0.5) * noiseStrength * 0.5;

    const maxSpeed = 2.5 + averageEnergy * 1.5;
    const speed = Math.sqrt(follower.vx * follower.vx + follower.vy * follower.vy);
    if (speed > maxSpeed) {
      follower.vx = (follower.vx / speed) * maxSpeed;
      follower.vy = (follower.vy / speed) * maxSpeed;
    }

    follower.x += follower.vx;
    follower.y += follower.vy;
    follower.z += follower.vz;

    follower.rotation = Math.atan2(follower.vy, follower.vx);
  }

  update(time: number, width: number, height: number, averageEnergy: number = 0.5): void {
    this.width = width;
    this.height = height;

    this.aggregationPhase += 0.005;
    if (this.aggregationPhase > Math.PI * 2) {
      this.aggregationPhase = 0;
    }

    this.leaders.forEach(leader => {
      this.updateLeader(leader, time, averageEnergy);
    });

    this.particles.forEach(particle => {
      if (!particle.leader) {
        const leader = this.leaders[particle.group];
        this.updateFollower(particle, leader, time, averageEnergy);
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
  
  const averageEnergy = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length / 255 * sensitivity;
  fishSwarmManager.update(time, width, height, averageEnergy);
  const particles = fishSwarmManager.getParticles();
  
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  
  particles.forEach(particle => {
    const scale = 1 + (particle.z / 200);
    const alpha = 0.8 + (particle.z / 400);
    const finalSize = particle.size * scale;
    
    ctx.save();
    ctx.translate(particle.x, particle.y);
    ctx.globalAlpha = alpha;
    
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(0, 0, finalSize, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  });
  
  ctx.restore();
};