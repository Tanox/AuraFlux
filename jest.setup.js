require('@testing-library/jest-dom');

// 模拟全局对象
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// 模拟 Three.js 相关对象
global.THREE = {
  Color: class Color {
    set() { return this; }
  },
  Vector3: class Vector3 {
    set() { return this; }
  },
  Object3D: class Object3D {
    constructor() {
      this.position = { set: () => {} };
      this.rotation = { set: () => {} };
      this.scale = { set: () => {} };
    }
    add() {}
    remove() {}
  },
  Mesh: class Mesh {
    constructor() {
      return {
        position: { set: () => {} },
        rotation: { set: () => {} },
        scale: { set: () => {} },
        material: {}
      };
    }
  },
  BoxGeometry: class BoxGeometry {},
  MeshBasicMaterial: class MeshBasicMaterial {},
  Scene: class Scene {},
  PerspectiveCamera: class PerspectiveCamera {
    lookAt() {}
  },
  WebGLRenderer: class WebGLRenderer {
    setSize() {}
    setPixelRatio() {}
    setClearColor() {}
    render() {}
    dispose() {}
  }
};

// 模拟音频上下文
global.AudioContext = class AudioContext {
  createAnalyser() {
    return {
      fftSize: 0,
      getByteFrequencyData: () => {},
      getByteTimeDomainData: () => {}
    };
  }
  createMediaElementSource() {
    return { connect: () => {} };
  }
  resume() {}
};