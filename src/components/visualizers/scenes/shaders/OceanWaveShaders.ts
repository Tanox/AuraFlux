// File: src\components\visualizers\scenes\shaders\OceanWaveShaders.ts | Version: v2.0.6

export const oceanWaveVertexShader = `
  attribute float aLineProgress;
  varying vec2 vUv;
  varying float vElevation;
  varying float vLineProgress;
  varying float vSideFade;
  uniform sampler2D uAudioHistory;
  uniform float uSensitivity;
  uniform float uTime;
  uniform float uBeat;
  
  void main() {
    vUv = uv; 
    vLineProgress = aLineProgress;
    
    float xDist = abs(uv.x - 0.5) * 2.0;
    float xFade = 1.0 - pow(xDist, 2.5);
    vSideFade = smoothstep(1.0, 0.75, xDist);
    
    vec3 pos = position;
    float audioVal = texture2D(uAudioHistory, vec2(uv.x, aLineProgress)).r;
    
    float elevation = audioVal * 37.8 * uSensitivity * xFade; // Increased 3x from 12.6
    float beatReaction = uBeat * sin(uv.x * 4.0 + uTime * 4.0) * 1.5 * (1.0 - aLineProgress) * xFade;
    float totalDisp = elevation + beatReaction;
    
    // Move bottom edge to y=0, only top edge rises with audio
    if (uv.y > 0.5) {
        pos.y += totalDisp;
    } else {
        pos.y = -12.5; // Keep bottom edge fixed at lower position
    }
    vElevation = totalDisp;
    
    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(pos, 1.0);
  }
`;

export const oceanWaveFragmentShader = `
  uniform vec3 uColorRidge;
  uniform vec3 uColorBody;
  varying vec2 vUv;
  varying float vElevation;
  varying float vLineProgress;
  varying float vSideFade;
  
  void main() {
    float thickness = mix(0.012, 0.003, vLineProgress);
    
    float isLine = smoothstep(1.0 - thickness, 1.0 - thickness + 0.005, vUv.y);
    
    vec3 ridgeCol = uColorRidge + vec3(0.4) * smoothstep(2.0, 15.0, vElevation);
    ridgeCol *= (0.25 + pow(1.0 - vLineProgress, 1.3) * 0.75);
    
    vec3 finalRgb = mix(uColorBody, ridgeCol, isLine);
    float finalAlpha = mix(1.0, vSideFade, isLine);
    
    if (isLine < 0.1) {
        gl_FragColor = vec4(uColorBody, 1.0);
    } else {
        gl_FragColor = vec4(finalRgb, finalAlpha);
    }
  }
`;

