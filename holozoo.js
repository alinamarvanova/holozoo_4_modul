import * as THREE from "three";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.165.0/examples/jsm/loaders/GLTFLoader.js";

const ANIMALS = [
  { path: "giraffe.glb", color: "#CBCFFB" },
  { path: "untitled.glb", color: "#EAECFF" },
  { path: "lion_neutral_standing_pose.glb", color: "#9FA7FF" },
  { path: "eagle_neutral_flying_pose.glb", color: "#7E89FF" },
  { path: "model_61a_-_bottlenose_dolphin.glb", color: "#c8d8f0" },
];

// ——— Сцена ———
const canvas = document.getElementById("bunny-canvas");
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100,
);
camera.position.z = 8;

const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 0);

// ——— Свет ———
scene.add(new THREE.AmbientLight(0xffffff, 1.8));
const light1 = new THREE.DirectionalLight(0xfff0f8, 2.5);
light1.position.set(3, 5, 3);
scene.add(light1);
const light2 = new THREE.DirectionalLight(0xf0f4ff, 1.5);
light2.position.set(-3, 2, -2);
scene.add(light2);

// ——— Материал ———
function createHoloMaterial(color) {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    roughness: 0.3,
    metalness: 0.15,
  });
}

// ——— Инициализация животных ———
const animals = ANIMALS.map((cfg, i) => {
  const angle = (i / ANIMALS.length) * Math.PI * 2;
  const radius = 2.0 + Math.random() * 1.0;
  return {
    cfg,
    mesh: null,
    material: createHoloMaterial(cfg.color),
    pos: new THREE.Vector3(
      Math.cos(angle) * radius,
      (Math.random() - 0.5) * 2.5,
      (Math.random() - 0.5) * 1.0,
    ),
    vel: new THREE.Vector3(
      (Math.random() - 0.5) * 0.004,
      (Math.random() - 0.5) * 0.004,
      0,
    ),
    floatOffset: Math.random() * Math.PI * 2,
    floatSpeed: 0.4 + Math.random() * 0.3,
    floatAmp: 0.06 + Math.random() * 0.04,
    baseScale: 1,
  };
});

// ——— Загрузка моделей ———
const loader = new GLTFLoader();

animals.forEach((a) => {
  loader.load(
    a.cfg.path,
    (gltf) => {
      const mesh = gltf.scene;
      const box = new THREE.Box3().setFromObject(mesh);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = (2.5 / maxDim) * a.baseScale;
      mesh.scale.setScalar(scale);
      const center = box.getCenter(new THREE.Vector3());
      mesh.position.set(
        a.pos.x - center.x * scale,
        a.pos.y - center.y * scale,
        a.pos.z,
      );
      mesh.traverse((child) => {
        if (child.isMesh) child.material = a.material;
      });
      mesh.rotation.y = Math.random() * Math.PI * 2;
      scene.add(mesh);
      a.mesh = mesh;
    },
    undefined,
    (err) => console.warn(`Ошибка загрузки ${a.cfg.path}:`, err),
  );
});

// ——— Мышь ———
const mouseWorld = new THREE.Vector3(9999, 9999, 0);

window.addEventListener("mousemove", (e) => {
  const mx = (e.clientX / window.innerWidth - 0.5) * 2;
  const my = -(e.clientY / window.innerHeight - 0.5) * 2;
  const vec = new THREE.Vector3(mx, my, 0.5).unproject(camera);
  const dir = vec.sub(camera.position).normalize();
  const dist = -camera.position.z / dir.z;
  mouseWorld.copy(camera.position).addScaledVector(dir, dist);
});

// ——— Анимация ———
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  const fov = (camera.fov * Math.PI) / 180;
  const h = 2 * Math.tan(fov / 2) * camera.position.z;
  const w = h * camera.aspect;
  const bounds = { x: (w / 2) * 0.85, y: (h / 2) * 0.85 };

  animals.forEach((a) => {
    if (!a.mesh) return;

    const floatY = Math.sin(t * a.floatSpeed + a.floatOffset) * a.floatAmp;

    // Отталкивание от мыши
    const dx = a.pos.x - mouseWorld.x;
    const dy = a.pos.y - mouseWorld.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const repelRadius = 1.8;

    if (dist < repelRadius && dist > 0.01) {
      const force = (repelRadius - dist) / repelRadius;
      a.vel.x += (dx / dist) * 0.02 * force * 2.5;
      a.vel.y += (dy / dist) * 0.02 * force * 2.5;
    }

    // Возврат к центру
    a.vel.x += (0 - a.pos.x) * 0.0004;
    a.vel.y += (0 - a.pos.y) * 0.0004;

    // Трение
    a.vel.x *= 0.96;
    a.vel.y *= 0.96;

    a.pos.x += a.vel.x;
    a.pos.y += a.vel.y;

    // Отскок от границ
    if (Math.abs(a.pos.x) > bounds.x) {
      a.vel.x *= -0.6;
      a.pos.x = Math.sign(a.pos.x) * bounds.x;
    }
    if (Math.abs(a.pos.y) > bounds.y) {
      a.vel.y *= -0.6;
      a.pos.y = Math.sign(a.pos.y) * bounds.y;
    }

    a.mesh.position.x = a.pos.x;
    a.mesh.position.y = a.pos.y + floatY;
    a.mesh.position.z = a.pos.z;

    // Вращение
    const rotSpeed = dist < repelRadius ? 0.04 : 0.005;
    a.mesh.rotation.y += rotSpeed;
    a.mesh.rotation.z += (a.vel.x * -0.8 - a.mesh.rotation.z) * 0.05;
    a.mesh.rotation.x += (a.vel.y * 0.5 - a.mesh.rotation.x) * 0.05;
  });

  renderer.render(scene, camera);
}
animate();

// ——— СКРЫТИЕ 3D ОБЪЕКТОВ НА МОБИЛЬНЫХ ———
function toggleCanvasVisibility() {
  const width = window.innerWidth;

  if (width <= 768) {
    canvas.style.display = "none";
  } else {
    canvas.style.display = "block";
  }
}

// ——— Ресайз (ОДИН обработчик) ———
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  toggleCanvasVisibility();
});

// Вызываем при загрузке
window.addEventListener("load", toggleCanvasVisibility);

// DOM элементы
const sidebarToggle = document.getElementById("sidebarToggle");
const sidebar = document.getElementById("sidebar");
const contactForm = document.getElementById("contactForm");
const nameInput = document.getElementById("nameInput");
const emailInput = document.getElementById("emailInput");
const phoneInput = document.getElementById("phoneInput");
