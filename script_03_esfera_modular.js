/* global THREE */

// Fuentes
//https://threejs.org/docs/#manual/en/introduction/Creating-a-scene -->
//https://r105.threejsfundamentals.org/threejs/lessons/threejs-primitives.html  -->
let scene;
let camera;
let renderer;
let objetos = [];

init()
animationLoop()

function init() {
  
  var info = document.createElement('div');
			info.style.position = 'absolute';
			info.style.top = '30px';
			info.style.width = '100%';
			info.style.textAlign = 'center';
			info.style.color = '#fff';
			info.style.fontWeight = 'bold';
			info.style.backgroundColor = 'transparent';
			info.style.zIndex = '1';
			info.style.fontFamily = 'Monospace';
			info.innerHTML = "three.js - mi texto aquí";
			document.body.appendChild(info);
  
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  camera.position.set(0, 0, 10);

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
			
  //Objetos
  Esfera(0,0,0,1,10,10, 0xffff00);
  Esfera(1,0,0,1,10,10, 0xff00ff);
  
  var controls = new THREE.OrbitControls(camera, renderer.domElement);
  
  //Rejilla de referencia indicando tamaño y divisiones
var grid = new THREE.GridHelper(20, 40);
//MOstrarla en vertical
grid.geometry.rotateX( Math.PI / 2 );
grid.position.set(0, 0, .05);
scene.add(grid);
  
  //Manejador de evento del botón
document.getElementById("onoff").addEventListener("click",
			function(){
				grid.visible = !grid.visible;
			});
  
}


function Esfera(px,py,pz, radio, nx, ny, col) {
  let geometry = new THREE.SphereBufferGeometry(radio, nx, ny)
  //Material con o sin relleno
  let material = new THREE.MeshBasicMaterial({
        color: col,
        //wireframe: true, //Descomenta para activar modelo de alambres
      });
  
  let mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(px,py,pz);
  scene.add(mesh)
  objetos.push(mesh)
}


//Bucle de animación
function animationLoop() {
  requestAnimationFrame(animationLoop);

  //Modifica rotación de todos los objetos
  for(let object of objetos) {
    object.rotation.x += 0.01;
  }

  renderer.render(scene, camera);
}

