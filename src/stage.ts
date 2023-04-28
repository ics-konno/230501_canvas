import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

const params = {
  color: 0xffffff,
  transmission: 1,
  opacity: 1,
  metalness: 0,
  roughness: 0,
  ior: 1.5,
  thickness: 5,
  specularIntensity: 1,
  specularColor: new THREE.Color(0xffffff),
  envMapIntensity: 1,
  lightIntensity: 1,
  exposure: 1,
};

// const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onPointerMove(event: MouseEvent) {
  // calculate pointer position in normalized device coordinates
  // (-1 to +1) for both components

  pointer.x = ((event.clientX / 400) * 2 - 1) * 25;
  pointer.y = -((event.clientY / 400) * 2 - 1) * 25;
  // console.log(pointer);
}

export const setup = () => {
  const hdrEquirect = new RGBELoader()
    .setPath("/public/")
    .load("royal_esplanade_1k.hdr", function () {
      hdrEquirect.mapping = THREE.EquirectangularReflectionMapping;
      init();
    });
  const init = async () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 2000);
    camera.position.set(0, 0, 120);

    const canvas = document.querySelector<HTMLCanvasElement>("#app");
    if (!canvas) return;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(400, 400);

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = params.exposure;
    scene.background = hdrEquirect;
    canvas.appendChild(renderer.domElement);

    // オブジェクトを生成
    const geometry = new THREE.SphereGeometry(10, 64, 32);
    const material = await createMaterial();
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    window.addEventListener("pointermove", (event) => {
      onPointerMove(event);
      sphere.position.x = pointer.x;
      sphere.position.y = pointer.y;
      renderer.render(scene, camera);
    });
  };

  const createMaterial = async () => {
    const texture = new THREE.CanvasTexture(generateTexture());
    // texture.magFilter = THREE.NearestFilter;
    texture.wrapT = THREE.RepeatWrapping;
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.set(1, 3.5);

    const material = new THREE.MeshPhysicalMaterial({
      color: params.color,
      metalness: params.metalness,
      roughness: params.roughness,
      ior: params.ior,
      alphaMap: texture,
      envMap: hdrEquirect,
      envMapIntensity: params.envMapIntensity,
      transmission: params.transmission, // use material.transmission for glass materials
      specularIntensity: params.specularIntensity,
      specularColor: params.specularColor,
      opacity: params.opacity,
      side: THREE.DoubleSide,
      transparent: true,
    });

    return material;
  };

  function generateTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 2;
    canvas.height = 2;

    const context = canvas.getContext("2d");
    if (!context) return canvas;
    context.fillStyle = "white";
    context.fillRect(0, 1, 2, 1);

    return canvas;
  }
};
