/* global THREE */

// Fuentes
//https://threejs.org/docs/#manual/en/introduction/Creating-a-scene -->
//https://r105.threejsfundamentals.org/threejs/lessons/threejs-primitives.html  -->


let scene;
let camera;
let renderer;
let objetos = []
let uniforms = {}

function init() {
  scene = new THREE.Scene()
  
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.z = 5
  
  renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  
  document.body.appendChild(renderer.domElement)
  adjustLighting()
  addBasicCube()
  addExperimentalCube()
  //addExperimentalLightCube()
  animationLoop()
}

scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );

renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//Objeto esfera (radio, eltos ancho, eltos alto)
const geometry = new THREE.SphereGeometry(1, 10, 10);
//ELEGIR UNA OPCIÓN
//Material con o sin relleno
      const material = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        wireframe: true, //Descomenta para activar modelo de alambres
      });

const esfera = new THREE.Mesh(geometry, material);
scene.add(esfera);

//Posición de la cámara
camera.position.z = 5;

//Bucle de animación
function animate() {
  requestAnimationFrame(animate);

  //Modifica rotación de la esfera
  esfera.rotation.x += 0.01;

  renderer.render(scene, camera);
}

animate();