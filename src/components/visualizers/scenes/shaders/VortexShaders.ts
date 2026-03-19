export const vortexVertexShader = `
  uniform float uTime;
  uniform float uBass;
  uniform float uMids;
  uniform float uTreble;
  uniform float uBeat;
  attribute float aRandom;
  varying float vDist;
  varying float vRandom;
  varying float vCameraDist;

  void main() {
    vec3 pos = position;
    vRandom = aRandom;
    
    float angle = atan(pos.z, pos.x);
    float dist = length(pos.xz);
    vDist = dist;
    
    // Vortex motion
    float swirl = uTime * (2.0 + uBass * 3.0) / (dist * 0.1 + 1.0);
    float newAngle = angle + swirl + aRandom * 2.0;
    
    float x = cos(newAngle) * dist;
    float z = sin(newAngle) * dist;
    float y = pos.y + sin(dist * 0.1 - uTime * 2.0) * (5.0 + uMids * 10.0);
    
    // Beat expansion
    float expansion = 1.0 + uBeat * 0.2 * (1.0 - dist / 100.0);
    vec3 newPos = vec3(x * expansion, y, z * expansion);
    
    vec4 mvPos = modelViewMatrix * vec4(newPos, 1.0);
    gl_Position = projectionMatrix * mvPos;
    vCameraDist = -mvPos.z;
    
    gl_PointSize = (2.0 + aRandom * 4.0 + uTreble * 5.0) * (300.0 / vCameraDist);
  }
`;

export const vortexFragmentShader = `
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform float uTime;
  uniform float uBass;
  varying float vDist;
  varying float vRandom;
  varying float vCameraDist;

  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    if(d > 0.5) discard;
    
    float alpha = pow(1.0 - smoothstep(0.0, 0.5, d), 2.0);
    vec3 col = mix(uColor1, uColor2, sin(vDist * 0.05 - uTime + vRandom) * 0.5 + 0.5);
    
    // Glow near center
    col += vec3(1.0, 0.8, 0.5) * (1.0 - smoothstep(0.0, 20.0, vDist)) * uBass;
    
    // LOD: Fade out distant particles
    float lodAlpha = 1.0 - smoothstep(80.0, 150.0, vCameraDist);

    gl_FragColor = vec4(col, alpha * (0.7 + uBass * 0.3) * lodAlpha);
  }
`;
