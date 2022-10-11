/* global THREE */

// Fuentes
<!-- Fuentes -->
//https://threejs.org/docs/#manual/en/introduction/Creating-a-scene -->
// https://r105.threejsfundamentals.org/threejs/lessons/threejs-primitives.html  -->
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


//Texto 2D
let sprite = new THREE.TextSprite( {
                               text: 'Text must be rendered here...',
                          alignment: 'center'
                         fontFamily: 'Arial, Helvetica, sans-serif',
                           fontSize: 28,
                              color: '#ffffff' } );
 
scene.add( sprite );

//Eventos de ratón
mouse = new THREE.Vector2()
document.addEventListener('mousemove', onDocumentMouseMove, false);
//window.addEventListener('resize', onWindowResize, false);
document.addEventListener('mousedown', onMouseDown, false);


function onDocumentMouseMove(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onMouseDown(event){
   customLog("mouse position: (" + mouse.x + ", "+ mouse.y + ")");
}

/*function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}*/

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