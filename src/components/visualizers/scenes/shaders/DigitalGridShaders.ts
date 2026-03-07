import { Shader } from 'three';

export const injectDigitalGridShader = (s: Shader, uniforms: any) => {
    Object.assign(s.uniforms, uniforms);
    s.vertexShader = `
      attribute vec3 aLayout;
      attribute float aRandom;
      varying float vA, vR, vE, vRn;
      uniform sampler2D uAudioTexture;
      uniform float uTime, uBeat, uSensitivity;
      ${s.vertexShader}
    `.replace('#include <begin_vertex>', `
      #include <begin_vertex>
      vR = aLayout.y;
      vE = aLayout.z;
      vRn = aRandom;
      float i = texture2D(uAudioTexture, vec2(aLayout.x*0.9+0.02, 0.5)).r * uSensitivity * 0.5;
      vA = clamp(smoothstep(0.0, 0.3, i*1.1 - abs(aLayout.y-0.5)*2.0) + smoothstep(0.8, 1.0, sin(aLayout.y*10.0-uTime*8.0))*uBeat*0.5, 0.0, 1.0);
      transformed.z += vA * 2.5;
    `);
    
    s.fragmentShader = `
      uniform vec3 uColor1, uColor2, uColor3;
      uniform float uBeat, uTime;
      varying float vA, vR, vE, vRn;
      ${s.fragmentShader}
    `.replace('#include <color_fragment>', `
      #include <color_fragment>
      vec3 c = mix(mix(uColor1*0.2, uColor2, smoothstep(0.0,0.6,vA)), uColor3, smoothstep(0.4+vRn*0.3-0.15, 0.9, vA+vR*0.3)) * (0.2+vRn*vRn*2.0) * (smoothstep(-1.0,1.0,sin(uTime*6.0+vRn*15.0))*0.4+0.6) + uColor3*uBeat*0.5*vRn;
      diffuseColor.rgb = c;
      diffuseColor.a = smoothstep(0.0,0.15,vE) * smoothstep(0.01,0.15,vA);
    `).replace('#include <emissivemap_fragment>', `
      #include <emissivemap_fragment>
      totalEmissiveRadiance = diffuseColor.rgb * (0.5+vRn*vRn*2.4) * (0.5+vA*0.8);
    `);
};
