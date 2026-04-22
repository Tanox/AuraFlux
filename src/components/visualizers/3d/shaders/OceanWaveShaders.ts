// File: src\components\visualizers\3d\shaders\OceanWaveShaders.ts | Version: v2.3.6

export const oceanWaveVertexShader = `
  attribute vec3 aParticlePosition;
  varying float vElevation;
  varying float vDistance;
  uniform sampler2D uAudioHistory;
  uniform float uSensitivity;
  uniform float uTime;
  uniform float uBeat;
  
  void main() {
    vec3 pos = aParticlePosition;
    
    // Calculate normalized position for audio sampling
    float xNorm = (pos.x + 90.0) / 180.0;
    float zNorm = (pos.z + 50.0) / 100.0;
    
    // Sample audio data based on particle position
    float audioVal = texture2D(uAudioHistory, vec2(xNorm, zNorm)).r;
    
    // Calculate elevation based on audio and distance from center
    float distanceFromCenter = length(vec2(pos.x, pos.z));
    float distanceFade = 1.0 - smoothstep(0.0, 100.0, distanceFromCenter);
    vDistance = distanceFade;
    
    // 增强上下跳动效果，模拟海浪起伏
    float elevation = audioVal * 0.5 * uSensitivity * distanceFade;
    float waveMotion = sin(pos.x * 0.02 + pos.z * 0.03 + uTime * 2.0) * 2.0 * distanceFade;
    float beatReaction = uBeat * sin(pos.x * 0.1 + pos.z * 0.1 + uTime * 4.0) * 1.5 * distanceFade;
    float totalDisp = elevation + waveMotion + beatReaction;
    
    pos.y = totalDisp;
    vElevation = totalDisp;
    
    // 增强水平波浪运动
    pos.x += sin(pos.z * 0.03 + uTime * 0.7) * 3.0 * distanceFade;
    pos.z += cos(pos.x * 0.03 + uTime * 0.5) * 1.5 * distanceFade;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    
    // Adjust particle size based on elevation and distance
    float size = 0.4 + (elevation * 0.08) + (distanceFade * 0.3);
    gl_PointSize = size;
  }
`;

export const oceanWaveFragmentShader = `
  uniform vec3 uColor;
  varying float vElevation;
  varying float vDistance;
  
  void main() {
    // Create circular particle shape
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) discard;
    
    // Calculate alpha based on distance from center
    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
    
    // Add glow effect based on elevation
    float glow = smoothstep(0.0, 5.0, vElevation);
    vec3 color = uColor + vec3(0.3) * glow;
    
    // Fade particles based on distance from center
    color *= vDistance;
    alpha *= vDistance;
    
    gl_FragColor = vec4(color, alpha);
  }
`;

