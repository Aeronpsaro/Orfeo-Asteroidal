/* global THREE */

// Fuentes
//https://threejs.org/docs/#manual/en/introduction/Creating-a-scene -->
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75,
                window.innerWidth / window.innerHeight, 0.1, 1000 );
 
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
 
//Objeto cubo
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cubo = new THREE.Mesh( geometry, material );
//Objeto añadido a la escena
scene.add( cubo );
 
//Posición de la cámara
camera.position.z = 5;
 
//Bucle de animación
function animate() {
    requestAnimationFrame( animate );
 
    //Modifica posición del cubo
    cubo.position.x += 0.01;
    //Modifica orientación del cubo
    cubo.rotation.x += 0.01;
    cubo.rotation.y += 0.01;
 
    renderer.render( scene, camera );
}
animate();