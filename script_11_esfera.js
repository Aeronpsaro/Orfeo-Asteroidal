let scene, renderer;
let camera;
let info;
let grid;
let camcontrols1;
let estrella, Planetas = [];
let Lunas = [];
let t0 = 0;
let accglobal = 0.001;
let timestamp;

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
  creaPlaneta(0.8, 4.0, 1.2,0x00ff00 , 1.2, 1.0);
  creaPlaneta(0.4, 5.0, 1.5,0x0000ff , 0.5, 1.2);
  creaLuna(Planetas[0],0.2,1.1,-3.5,0xff0000);
  
  //EsferaChild(objetos[0],3.0,0,0,0.8,10,10, 0x00ff00);
}

function creaEstrella(rad,col) {
	let geometry = new THREE.SphereGeometry( rad, 10, 10 );
	let material = new THREE.MeshBasicMaterial( { color: col } );
	estrella = new THREE.Mesh( geometry, material );
	scene.add( estrella );
}

function creaPlaneta(radio, dist, vel, col, f1, f2) {
	let geom = new THREE.SphereGeometry(radio, 10, 10);
	let mat = new THREE.MeshBasicMaterial({ color: col});
	let planeta = new THREE.Mesh(geom, mat);
	planeta.userData.dist = dist;
	planeta.userData.speed = vel;
  planeta.userData.f1 = f1;
	planeta.userData.f2 = f2;

	Planetas.push(planeta);
	scene.add(planeta);
  
  //Dibuja trayectoria, con
	let curve = new THREE.EllipseCurve(
		0,  0,            		// centro
		dist*f1, dist*f2        // radios elipse
		);
		//Crea geometría
		let points = curve.getPoints( 50 );
		let geome = new THREE.BufferGeometry().setFromPoints( points );
		let mate = new THREE.LineBasicMaterial( { color: 0xffffff } );
		// Objeto
		let orbita = new THREE.Line( geome, mate );
		scene.add(orbita);
  
  //Inicio tiempo
  t0 = Date.now();
};

function creaLuna(planeta, radio, dist, vel, col) {				
	var geom = new THREE.SphereGeometry(radio, 10, 10);
	var mat = new THREE.MeshBasicMaterial({ color: col});
	var luna = new THREE.Mesh(geom, mat);
	luna.userData.dist = dist;
	luna.userData.speed = vel;

	Lunas.push(luna);
	planeta.add(luna);
};
	
	
	
	//Bucle de animación
	function animationLoop() {
    
    timestamp = (Date.now() - t0) * accglobal;
    
		requestAnimationFrame(animationLoop);
		
		//Modifica rotación de todos los objetos
		for(let object of Planetas) {
			object.position.x = Math.cos(timestamp * object.userData.speed) * object.userData.f1 * object.userData.dist;
      object.position.y = Math.sin(timestamp * object.userData.speed) * object.userData.f2 * object.userData.dist;
		}
    
    //Modifica posición de cada luna
    Lunas.forEach(function(luna) {
      luna.position.x = Math.cos(timestamp * luna.userData.speed) * luna.userData.dist;
      luna.position.y = Math.sin(timestamp * luna.userData.speed) * luna.userData.dist;
    });
		
		renderer.render( scene, camera );
		
	}