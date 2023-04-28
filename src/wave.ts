import * as THREE from "three";
import picture from "../public/picture.jpeg";

export const setupWave = () => {
  const container = document.getElementById("app2");

  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const scene = new THREE.Scene();

  const geometry = new THREE.PlaneGeometry(2, 2);
  const textureLoader = new THREE.TextureLoader();
  const uniforms = {
    time: { value: 1.0 },
    u_texture: {
      value: textureLoader.load(picture)
    },
    resolution: { value: new THREE.Vector2(400.0, 400.0) }
  };

  const material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: `
      varying vec2 vUv;
      
      void main(){
        vUv = uv;      
        gl_Position = vec4( position, 1.0 );      
      }`,
    fragmentShader: `
      uniform float time;
      
      varying vec2 vUv;
      uniform sampler2D u_texture;
      uniform vec2 resolution;
      
      // Based on Adrian Boeing's blog: Ripple effect in WebGL, published on February 07, 2011
      // http://adrianboeing.blogspot.com/2011/02/ripple-effect-in-webgl.html
      void main(void)
      {
          vec2 cPos = -1.0 + 2.0 * gl_FragCoord.xy / resolution.xy;
          float cLength = length(cPos);
      
          vec2 uv = gl_FragCoord.xy/resolution.xy+(cPos/cLength)*cos(cLength*12.0-time*4.0)*0.03;
          vec3 col = texture2D(u_texture,uv).xyz;
          gl_FragColor = vec4(col, 1.0);
      }`
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(400, 400);
  container?.appendChild(renderer.domElement);

  let ripple_strength = 3.0;
  function animate() {
    requestAnimationFrame(animate);
    ripple_strength -= 0.02;
    if (ripple_strength < 0) {
      ripple_strength = 3.0;
    }
    uniforms["time"].value = performance.now() / 1000;
    renderer.render(scene, camera);
  }

  animate();
};
