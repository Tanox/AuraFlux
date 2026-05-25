// src/components/visualizers/2d/plasma/FishSwarmManager.ts v2.3.11

export interface FishParticle {
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

export interface FrequencyData {
  bass: number;
  mid: number;
  treble: number;
}

export class FishSwarmManager {
  private particles: FishParticle[] = [];
  private groupCount = 1;
  private maxParticles = 2000;
  private currentParticles = 2000;
  private leaders: FishParticle[] = [];
  private width: number = 1000;
  private height: number = 800;
  private aggregationPhase: number = 0;
  private performanceHistory: number[] = [];
  private lastAdjustmentTime = 0;
  private bassEnergy = 0;
  private midEnergy = 0;
  private trebleEnergy = 0;
  private cohesionStrength = 0.03;
  private separationDistance = 8;
  private alignmentStrength = 0.08;
  private trailLength = 10;
  private colorResponse = 1.0;

  constructor(width: number = 1000, height: number = 800, settings?: Record<string, unknown>) {
    this.width = width;
    this.height = height;

    if (settings) {
      this.maxParticles = (settings.fishSwarmMaxParticles as number) || 2000;
      this.currentParticles = this.maxParticles;
      this.cohesionStrength = (settings.fishSwarmCohesion as number) || 0.03;
      this.separationDistance = (settings.fishSwarmSeparation as number) || 8;
      this.alignmentStrength = (settings.fishSwarmAlignment as number) || 0.08;
      this.trailLength = (settings.fishSwarmTrailLength as number) || 10;
      this.colorResponse = (settings.fishSwarmColorResponse as number) || 1.0;
    }

    this.initializeParticles();
  }

  private initializeParticles(): void {
    for (let i = 0; i < this.maxParticles; i++) {
      const group = 0;
      const isLeader = i === 0;

      const halfWidth = this.width / 2;
      const x = halfWidth / 2 + (Math.random() - 0.5) * halfWidth;
      const y = this.height / 2 + (Math.random() - 0.5) * this.height;

      const baseColor = this.getGroupColor(group);
      const particle: FishParticle = {
        x,
        y,
        z: (Math.random() - 0.5) * 200,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        vz: (Math.random() - 0.5) * 1,
        size: isLeader ? 2 + Math.random() * 1 : 1 + Math.random() * 0.5,
        color: baseColor,
        baseColor,
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
    const colors = ['#FFD700', '#FFA500', '#FF8C00', '#FFDAB9', '#F0E68C', '#E6E6FA'];
    return colors[group % colors.length];
  }

  private calculateGroupCenter(group: number): { x: number; y: number; z: number } {
    const groupParticles = this.particles.filter(p => p.group === group);
    if (groupParticles.length === 0) {
      return { x: this.width / 2, y: this.height / 2, z: 0 };
    }

    const center = groupParticles.reduce(
      (acc, p) => { acc.x += p.x; acc.y += p.y; acc.z += p.z; return acc; },
      { x: 0, y: 0, z: 0 }
    );

    return {
      x: center.x / groupParticles.length,
      y: center.y / groupParticles.length,
      z: center.z / groupParticles.length
    };
  }

  private clampToBoundary(x: number, y: number, z: number): void {
    const halfWidth = this.width / 2;
    const margin = 50;
    if (x < margin) this.leaders[0].vx += 0.1;
    else if (x > halfWidth - margin) this.leaders[0].vx -= 0.1;
    if (y < margin) this.leaders[0].vy += 0.1;
    else if (y > this.height - margin) this.leaders[0].vy -= 0.1;
    if (z < -100) this.leaders[0].vz += 0.05;
    else if (z > 100) this.leaders[0].vz -= 0.05;
  }

  private updateLeader(leader: FishParticle, time: number, averageEnergy: number = 0.5): void {
    const groupCenter = this.calculateGroupCenter(leader.group);
    const centerX = groupCenter.x;
    const centerY = groupCenter.y;
    const centerZ = groupCenter.z;

    const noiseX = Math.sin(time * 0.001 + leader.group) * 0.5 + this.trebleEnergy * 0.5;
    const noiseY = Math.cos(time * 0.0012 + leader.group) * 0.5 + this.trebleEnergy * 0.5;
    const noiseZ = Math.sin(time * 0.0008 + leader.group) * 0.3 + this.trebleEnergy * 0.2;

    const centerAttractionStrength = 0.005 - this.bassEnergy * 0.003;
    leader.vx += (centerX - leader.x) * centerAttractionStrength;
    leader.vy += (centerY - leader.y) * centerAttractionStrength;
    leader.vz += (centerZ - leader.z) * centerAttractionStrength * 0.5;

    leader.vx += noiseX * (0.1 + this.trebleEnergy * 0.2);
    leader.vy += noiseY * (0.1 + this.trebleEnergy * 0.2);
    leader.vz += noiseZ * (0.05 + this.trebleEnergy * 0.1);

    const maxSpeed = 3 + averageEnergy * 2 + this.bassEnergy * 3;
    const speed = Math.sqrt(leader.vx * leader.vx + leader.vy * leader.vy);
    if (speed > maxSpeed) {
      leader.vx = (leader.vx / speed) * maxSpeed;
      leader.vy = (leader.vy / speed) * maxSpeed;
    }

    if (Math.random() < 0.01 * this.trebleEnergy) {
      leader.vx = (Math.random() - 0.5) * maxSpeed;
      leader.vy = (Math.random() - 0.5) * maxSpeed;
    }

    leader.x += leader.vx;
    leader.y += leader.vy;
    leader.z += leader.vz;

    this.clampToBoundary(leader.x, leader.y, leader.z);
    leader.rotation = Math.atan2(leader.vy, leader.vx);
  }

  private updateFollower(follower: FishParticle, leader: FishParticle, time: number, averageEnergy: number = 0.5): void {
    const dx = leader.x - follower.x;
    const dy = leader.y - follower.y;
    const dz = leader.z - follower.z;
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

    const groupParticles = this.particles.filter(p => p.group === follower.group && !p.leader);
    let nearNeighbors = 0;
    let neighborX = 0, neighborY = 0, neighborZ = 0;

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

    const aggregationFactor = 1 - averageEnergy;

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

    const alignmentStrength = this.alignmentStrength + this.midEnergy * 0.04;
    follower.vx += (leader.vx - follower.vx) * alignmentStrength;
    follower.vy += (leader.vy - follower.vy) * alignmentStrength;
    follower.vz += (leader.vz - follower.vz) * alignmentStrength * 0.5;

    if (nearNeighbors > 0) {
      const neighborAvgVx = groupParticles.reduce((sum, p) => sum + p.vx, 0) / groupParticles.length;
      const neighborAvgVy = groupParticles.reduce((sum, p) => sum + p.vy, 0) / groupParticles.length;
      const neighborAvgVz = groupParticles.reduce((sum, p) => sum + p.vz, 0) / groupParticles.length;

      const neighborAlignStrength = 0.04;
      follower.vx += (neighborAvgVx - follower.vx) * neighborAlignStrength;
      follower.vy += (neighborAvgVy - follower.vy) * neighborAlignStrength;
      follower.vz += (neighborAvgVz - follower.vz) * neighborAlignStrength * 0.5;
    }

    const noiseStrength = 0.03 + averageEnergy * 0.02 + this.trebleEnergy * 0.03;
    follower.vx += (Math.random() - 0.5) * noiseStrength;
    follower.vy += (Math.random() - 0.5) * noiseStrength;
    follower.vz += (Math.random() - 0.5) * noiseStrength * 0.5;

    const maxSpeed = 2.5 + averageEnergy * 2 + this.bassEnergy * 2;
    const speed = Math.sqrt(follower.vx * follower.vx + follower.vy * follower.vy);
    if (speed > maxSpeed) {
      follower.vx = (follower.vx / speed) * maxSpeed;
      follower.vy = (follower.vy / speed) * maxSpeed;
    }

    follower.x += follower.vx;
    follower.y += follower.vy;
    follower.z += follower.vz;

    const halfWidth = this.width / 2;
    if (follower.x < 0) { follower.x = 0; follower.vx *= -0.5; }
    else if (follower.x > halfWidth) { follower.x = halfWidth; follower.vx *= -0.5; }
    if (follower.y < 0) { follower.y = 0; follower.vy *= -0.5; }
    else if (follower.y > this.height) { follower.y = this.height; follower.vy *= -0.5; }

    follower.rotation = Math.atan2(follower.vy, follower.vx);
  }

  update(time: number, width: number, height: number, averageEnergy: number = 0.5, frequencyData?: FrequencyData): void {
    const startTime = performance.now();

    this.width = width;
    this.height = height;

    if (frequencyData) {
      this.bassEnergy = frequencyData.bass;
      this.midEnergy = frequencyData.mid;
      this.trebleEnergy = frequencyData.treble;
    }

    this.aggregationPhase += 0.005;
    if (this.aggregationPhase > Math.PI * 2) {
      this.aggregationPhase = 0;
    }

    const particlesToUpdate = this.particles.slice(0, this.currentParticles);

    this.leaders.forEach(leader => {
      this.updateLeader(leader, time, averageEnergy);
      this.updateParticleTrail(leader, averageEnergy);
      this.updateParticleColor(leader, averageEnergy);
    });

    particlesToUpdate.forEach(particle => {
      if (!particle.leader) {
        const l = this.leaders[particle.group];
        this.updateFollower(particle, l, time, averageEnergy);
        this.updateParticleTrail(particle, averageEnergy);
        this.updateParticleColor(particle, averageEnergy);
      }
    });

    const executionTime = performance.now() - startTime;
    this.performanceHistory.push(executionTime);

    if (this.performanceHistory.length > 10) {
      this.performanceHistory.shift();
    }

    if (time - this.lastAdjustmentTime > 2000) {
      const avgExecTime = this.performanceHistory.reduce((sum, val) => sum + val, 0) / this.performanceHistory.length;

      if (avgExecTime > 16) {
        this.currentParticles = Math.max(500, this.currentParticles - 200);
      } else if (avgExecTime < 8) {
        this.currentParticles = Math.min(this.maxParticles, this.currentParticles + 200);
      }

      this.lastAdjustmentTime = time;
    }
  }

  getParticles(): FishParticle[] {
    return this.particles.slice(0, this.currentParticles);
  }

  private updateParticleTrail(particle: FishParticle, averageEnergy: number): void {
    const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
    const trailLen = Math.floor(this.trailLength + speed * 2 + averageEnergy * 3);

    particle.trail.push({ x: particle.x, y: particle.y, z: particle.z });

    if (particle.trail.length > trailLen) {
      particle.trail.shift();
    }
  }

  private updateParticleColor(particle: FishParticle, averageEnergy: number): void {
    const baseRgb = this.hexToRgb(particle.baseColor);
    if (!baseRgb) return;

    const response = this.colorResponse;
    const r = Math.min(255, Math.floor(baseRgb.r + this.bassEnergy * 100 * response));
    const g = Math.min(255, Math.floor(baseRgb.g + this.midEnergy * 100 * response));
    const b = Math.min(255, Math.floor(baseRgb.b + this.trebleEnergy * 100 * response));

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
