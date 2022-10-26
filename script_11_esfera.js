let scene, renderer;
let camera;
let info;
let grid;
let camcontrols1;
let estrella, Planetas = [];
let t0 = 0;
let accglobal = 0.001;
let timestamp

init()
animationLoop()

function init() {	
	info = document.createElement('div');
	info.style.position = 'absolute';
	info.style.top = '30px';
	info.style.width = '100%';
	info.style.textAlign = 'center';
	info.style.color = '#fff';
	info.style.fontWeight = 'bold';
	info.style.backgroundColor = 'transparent';
	info.style.zIndex = '1';
	info.style.fontFamily = 'Monospace';
	info.innerHTML = "three.js - esfera";
	document.body.appendChild(info);
	
	//Defino cámara
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	camera.position.set(0, 0, 10);
	
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	
	camcontrols1 = new THREE.OrbitControls(camera, renderer.domElement);
	
	//Rejilla de referencia indicando tamaño y divisiones
	grid = new THREE.GridHelper(20, 40);
	//MOstrarla en vertical
	grid.geometry.rotateX( Math.PI / 2 );
	grid.position.set(0, 0, .05);
	scene.add(grid);
  
  //Objetos
	creaEstrella(1.8, 0xffff00);
  creaPlaneta(0.8, 2.0, 1.2,0x00ff00 )
  
  //EsferaChild(objetos[0],3.0,0,0,0.8,10,10, 0x00ff00);
}

function creaEstrella(rad,col) {
	let geometry = new THREE.SphereGeometry( rad, 10, 10 );
	let material = new THREE.MeshBasicMaterial( { color: col } );
	estrella = new THREE.Mesh( geometry, material );
	scene.add( estrella );
}

function creaPlaneta(radio, dist, vel, col) {
	let geom = new THREE.SphereGeometry(radio, 10, 10);
	let mat = new THREE.MeshBasicMaterial({ color: col});
	let planeta = new THREE.Mesh(geom, mat);
	planeta.userData.dist = dist;
	planeta.userData.speed = vel;

	Planetas.push(planeta);
	scene.add(planeta);
  
  //Inicio tiempo
  t0 = Date.now();
};
	
	
	
	//Bucle de animación
	function animationLoop() {
    
    timestamp = (Date.now() - t0) * accglobal;
    
		requestAnimationFrame(animationLoop);
		
		//Modifica rotación de todos los objetos
		for(let object of Planetas) {
			object.position.x = Math.cos(timestamp * planeta.userData.speed) * planeta.userData.dist;
		}
		
		renderer.render( scene, camera );
		
	}