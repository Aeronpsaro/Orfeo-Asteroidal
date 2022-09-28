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
  Esfera(0,1,10,10)
  
  //Posición de la cámara
  camera.position.z = 5;
  
  
  //addExperimentalLightCube()
  //animationLoop()
}


function Esfera(desp, radio, nx, ny) {
  let geometry = new THREE.SphereGeometry(radio, nx, ny)
  //Material con o sin relleno
  let material = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        wireframe: true, //Descomenta para activar modelo de alambres
      });
  
  let mesh = new THREE.Mesh(geometry, material)
  mesh.position.x = desp
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

