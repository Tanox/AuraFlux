// src/components/visualizers/3d/shaders/OceanWaveShaders.ts v2.3.11


export const oceanWaveVertexShader = `
  attribute vec3 aParticlePosition;
  varying float vElevation;
  varying float vDistance;
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform sampler2D uAudioHistory;
  uniform float uSensitivity;
  uniform float uTime;
  uniform float uBeat;
  uniform float uPerformanceMode;
  uniform vec3 uLightPosition;
  uniform vec3 uMousePosition;
  
  // Calculate normal for water surface
  vec3 calculateNormal(vec3 pos, float xNorm, float zNorm) {
    float eps = 0.1;
    
    // Sample neighboring points
    float heightCenter = texture2D(uAudioHistory, vec2(xNorm, zNorm)).r;
    float heightX = texture2D(uAudioHistory, vec2(clamp(xNorm + eps, 0.0, 1.0), zNorm)).r;
    float heightZ = texture2D(uAudioHistory, vec2(xNorm, clamp(zNorm + eps, 0.0, 1.0))).r;
    
    // Calculate normal vector
    vec3 tangent = vec3(eps * 180.0, (heightX - heightCenter) * 0.5 * uSensitivity, 0.0);
    vec3 bitangent = vec3(0.0, (heightZ - heightCenter) * 0.5 * uSensitivity, eps * 100.0);
    
    return normalize(cross(tangent, bitangent));
  }
  
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
    
    // Adjust calculation complexity based on performance mode
    float complexityFactor = 1.0 - uPerformanceMode * 0.5;
    
    // Enhance vertical jumping effect to simulate ocean waves
    float elevation = audioVal * 1.0 * uSensitivity * distanceFade;
    
    // Multi-layer wave effects
    float waveMotion = 0.0;
    
    // Primary waves (low frequency, large amplitude)
    waveMotion += sin(pos.x * 0.02 + pos.z * 0.03 + uTime * 2.0) * 4.0 * distanceFade * complexityFactor;
    
    // Secondary waves (medium frequency)
    waveMotion += sin(pos.x * 0.05 + pos.z * 0.07 + uTime * 3.5) * 2.0 * distanceFade * complexityFactor;
    
    // Tertiary waves (high frequency, small amplitude)
    waveMotion += sin(pos.x * 0.1 + pos.z * 0.12 + uTime * 5.0) * 1.0 * distanceFade * complexityFactor;
    
    float beatReaction = uBeat * sin(pos.x * 0.1 + pos.z * 0.1 + uTime * 4.0) * 3.0 * distanceFade * complexityFactor;
    
    // Mouse interaction effect
    float mouseDistance = length(pos.xz - uMousePosition.xz);
    float mouseInfluence = 1.0 - smoothstep(0.0, 30.0, mouseDistance);
    float mouseEffect = mouseInfluence * 4.0 * sin(uTime * 3.0) * distanceFade * complexityFactor;
    
    float totalDisp = elevation + waveMotion + beatReaction + mouseEffect;
    
    pos.y = totalDisp;
    vElevation = totalDisp;
    
    // Enhance horizontal wave motion
    pos.x += sin(pos.z * 0.03 + uTime * 0.7) * 3.0 * distanceFade * complexityFactor;
    pos.z += cos(pos.x * 0.03 + uTime * 0.5) * 1.5 * distanceFade * complexityFactor;
    
    // Calculate normal
    vNormal = calculateNormal(pos, xNorm, zNorm);
    vPosition = pos;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    
    // Adjust particle size based on elevation and distance
    float size = 0.8 + (elevation * 0.15) + (distanceFade * 0.5);
    // Reduce particle size in low performance mode to improve performance
    size *= (1.0 - uPerformanceMode * 0.3);
    gl_PointSize = size;
  }
`;

export const oceanWaveFragmentShader = `
  uniform vec3 uColor;
  uniform vec3 uLightPosition;
  uniform float uTime;
  varying float vElevation;
  varying float vDistance;
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  void main() {
    // Create circular particle shape
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) discard;
    
    // Calculate alpha based on distance from center
    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
    
    // Add glow effect based on elevation
    float glow = smoothstep(0.0, 5.0, vElevation);
    vec3 baseColor = uColor + vec3(0.3) * glow;
    
    // Lighting calculation
    vec3 lightDirection = normalize(uLightPosition - vPosition);
    vec3 viewDirection = normalize(cameraPosition - vPosition);
    vec3 reflectDirection = reflect(-lightDirection, vNormal);
    
    // Ambient light
    vec3 ambient = vec3(0.2);
    
    // Diffuse light
    float diff = max(dot(vNormal, lightDirection), 0.0);
    vec3 diffuse = diff * vec3(0.8);
    
    // Specular light
    float spec = pow(max(dot(viewDirection, reflectDirection), 0.0), 32.0);
    vec3 specular = spec * vec3(0.5);
    
    // Combine lighting
    vec3 color = baseColor * (ambient + diffuse + specular);
    
    // Fade particles based on distance from center
    color *= vDistance;
    alpha *= vDistance;
    
    // Add water-like shimmer effect
    float shimmer = sin(vPosition.x * 0.1 + vPosition.z * 0.1 + uTime * 10.0) * 0.1;
    color += vec3(shimmer);
    
    // Wave breaking effect
    if (vElevation > 3.0) {
      // Create foam effect for breaking waves
      float foamFactor = smoothstep(3.0, 5.0, vElevation);
      color = mix(color, vec3(0.9, 0.95, 1.0), foamFactor);
      alpha = mix(alpha, 0.8 + foamFactor * 0.2, foamFactor);
      
      // Add foam texture
      float foamNoise = sin(vPosition.x * 5.0 + vPosition.z * 5.0 + uTime * 20.0) * 0.05;
      color += vec3(foamNoise);
    }
    
    gl_FragColor = vec4(color, alpha);
  }
`;

