/* global THREE */

// Fuentes
//https://threejs.org/docs/#manual/en/introduction/Creating-a-scene -->
//https://r105.threejsfundamentals.org/threejs/lessons/threejs-primitives.html  -->

//window.addEventListener('load', init)
let scene;
let camera;
let renderer;
let objetos = []
let uniforms = {}

init()
animationLoop()

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

	renderer = new THREE.WebGLRenderer();
			renderer.setSize( window.innerWidth, window.innerHeight );
			document.body.appendChild( renderer.domElement );
			
  //Objetos
  Esfera(0,1,10,10, 0xffff00)
  EsferaShader(2.5,0.75,10,10)
  
  //Posición de la cámara
  camera.position.z = 5;
  
}

function vertexShader() {
  return `
    varying vec3 vUv; 
    varying vec4 modelViewPosition; 
    varying vec3 vecNormal;

    void main() {
      vUv = position; 
      vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
      vecNormal = (modelViewMatrix * vec4(normal, 0.0)).xyz; //????????
      gl_Position = projectionMatrix * modelViewPosition; 
    }
  `
}

function fragmentShader() {
  return `
      uniform vec3 colorA; 
      uniform vec3 colorB; 
      varying vec3 vUv;

      void main() {
        gl_FragColor = vec4(mix(colorA, colorB, vUv.z), 1.0);
      }
  `
}

function Esfera(desp, radio, nx, ny, col) {
  let geometry = new THREE.SphereGeometry(radio, nx, ny)
  //Material con o sin relleno
  let material = new THREE.MeshBasicMaterial({
        color: col,
        //wireframe: true, //Descomenta para activar modelo de alambres
      });
  
  let mesh = new THREE.Mesh(geometry, material)
  mesh.position.x = desp
  scene.add(mesh)
  objetos.push(mesh)
}

function EsferaShader(desp, radio, nx, ny) {
  uniforms.colorA = {type: 'vec3', value: new THREE.Color(0x74ebd5)}
  uniforms.colorB = {type: 'vec3', value: new THREE.Color(0xACB6E5)}
  
  let geometry = new THREE.SphereGeometry(radio, nx, ny)
  let material =  new THREE.ShaderMaterial({
    uniforms: uniforms,
    fragmentShader: fragmentShader(),
    vertexShader: vertexShader(),
  })
  
  let mesh = new THREE.Mesh(geometry, material)
  mesh.position.x = 2
  scene.add(mesh)
  objetos.push(mesh)
}



//Bucle de animación
function animationLoop() {
  requestAnimationFrame(animationLoop);

  //Modifica rotación de la esfera
  for(let object of objetos) {
    object.rotation.x += 0.01
    //object.rotation.y += 0.03
  }

  renderer.render(scene, camera);
}

