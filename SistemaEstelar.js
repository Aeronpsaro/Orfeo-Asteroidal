let scene, renderer;
let renderer2;
let camera;
let camera2;
let info;
let grid;
let estrella, Planetas = [];
let Lunas = [];
let Nubes = [];
let t0 = 0;
let accglobal = 0.001;
let timestamp;
let starLight;

init()
animationLoop()

function getColor() {
	//Obteniendo el color aleatorio en hexadecimal
	let c = new THREE.Color();
	c.set( THREE.MathUtils.randInt(0, 16777216) );
	return c;
}

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
	info.innerHTML = "Sistema estelar Orfeo";
	document.body.appendChild(info);
	
	//Defino cámara
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	camera.position.set(0, 0, 10);

	camera2 = new THREE.OrthographicCamera( -10 * window.innerWidth / window.innerHeight, 10 * window.innerWidth / window.innerHeight, 10, -10, 0.1, 1000 );
	camera2.position.set(0, 0, 10);
	
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	let x,y,w,h;

	//Efecto similar al de defecto, ocupa toda la ventana
	x = Math.floor( window.innerWidth * 0.7 );
	y = Math.floor( window.innerHeight * 0.7 );
	w = Math.floor( window.innerWidth * 0.3 );
	h = Math.floor( window.innerHeight * 0.3 );

	renderer2 = new THREE.WebGLRenderer();
	renderer2.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer2.domElement );
	renderer2.domElement.style.position = "absolute";
	renderer2.domElement.style.top = 0;

	renderer2.setViewport( x,y,w,h );

	//No extiende el color de fondo fuera del viewport
	renderer2.setScissor( x,y,w,h );
	renderer2.setScissorTest( true );

	//restablece relación de aspecto
	camera2.aspect = w/h;
	camera2.updateProjectionMatrix();

	renderer2.render( scene, camera2 );
	
	//Rejilla de referencia indicando tamaño y divisiones
	grid = new THREE.GridHelper(20, 40);
	//MOstrarla en vertical
	grid.geometry.rotateX( Math.PI / 2 );
	grid.position.set(0, 0, .05);
	//scene.add(grid);

	starLight = new THREE.PointLight(0xffffff,2,0,2);
	scene.add(starLight);

	const solTex = new THREE.TextureLoader().load("Texturas planetarias/sunmap.jpg");
  
  //Objetos
	creaEstrella(1.8, 0xffff00, solTex);
	creaPlaneta(0.8, 4.0, 1.2, 0,0x00ff00 , 1.2, 1.0, 1);
	creaPlaneta(0.4, 5.0, 1.5, 0.5,0x0000ff , 0.5, 1.2, 2);
	let anillosGeom = new THREE.PlaneGeometry(2.0,2.0);
	let anillosMat = new THREE.MeshPhongMaterial();
	anillosMat.map = new THREE.TextureLoader().load("Texturas planetarias/Otras/Anillos.png");
	anillosMat.transparent = true;
	anillosMat.side = THREE.DoubleSide;
	anillosMat.opacity = 1.0;
	let anillos = new THREE.Mesh(anillosGeom, anillosMat);
	Planetas[1].add(anillos);
	Planetas[1].rotation.x=0.5;
	for (let i = 0; i < 5; i++) {
		creaPlaneta(Math.random(), Planetas[Planetas.length-1].userData.dist+Math.random()*2, Math.random(), Math.random(), getColor() , 1, 0.5+Math.random(), 3+i);
	}
	Planetas[0].rotation.x=Math.PI/2;
	creaLuna(Planetas[0],0.2,1.1,-3.5, 2,0xff0000, 1, 2, 7);
	creaLuna(Planetas[Planetas.length-1],Math.random(), Lunas[Lunas.length-1].userData.dist+Math.random()*2, Math.random(), Math.random(), getColor() , 1, 0.5+Math.random(), 8);
  
  //EsferaChild(objetos[0],3.0,0,0,0.8,10,10, 0x00ff00);

	flyControls = new THREE.FlyControls(camera, renderer.domElement);
	flyControls.dragToLook = true;
	flyControls.movementSpeed = .01;
	flyControls.rollSpeed = .001;

	t0 = new Date();
}

function creaEstrella(rad,col, texture = undefined) {
	let geometry = new THREE.SphereGeometry( rad, 10, 10 );
	let material = new THREE.MeshBasicMaterial( { color: col } );
	if (texture != undefined){
		material.map = texture;
	}
	estrella = new THREE.Mesh( geometry, material );
	estrella.userData.rSpeed = Math.random();
	scene.add( estrella );
}

function creaNubes(cuerpo, r, vel, tex) {
	var geom = new THREE.SphereGeometry(r, 10, 10);
	var mat = new THREE.MeshPhongMaterial();
	mat.map = tex;
	mat.transparent = true;
	mat.side = THREE.DoubleSide;
	mat.opacity = 1.0;
	var nubes = new THREE.Mesh(geom, mat);
	nubes.userData.v = vel;
	cuerpo.add(nubes);
	Nubes.push(nubes);
}

function creaPlaneta(radio, dist, vel, rotate, col, f1, f2, i=undefined) {
	let geom = new THREE.SphereGeometry(radio, 10, 10);
	let mat = new THREE.MeshPhongMaterial();

	let texture = undefined;
	let texbump = undefined;
	let texspec = undefined;
	let texnubes = undefined;

	if (i != undefined){
		texture = new THREE.TextureLoader().load("Texturas planetarias/P"+i+"/Difusa.png");
		texbump = new THREE.TextureLoader().load("Texturas planetarias/P"+i+"/Rugosidad.png");
		texspec = new THREE.TextureLoader().load("Texturas planetarias/P"+i+"/Especular.png");
		texnubes = new THREE.TextureLoader().load("Texturas planetarias/P"+i+"/Nubes.png");
	}

	//Textura
	if (texture != undefined){
		mat.map = texture;
	}
	//Rugosidad
	if (texbump != undefined){
		mat.bumpMap = texbump;
		mat.bumpScale = 0.5;
	}

	//Especular
	if (texspec != undefined){
		mat.specularMap = texspec;
		mat.specular = new THREE.Color('grey');
	}

	let planeta = new THREE.Mesh(geom, mat);
	planeta.userData.dist = dist;
	planeta.userData.speed = vel;
	planeta.userData.rSpeed = rotate;
  	planeta.userData.f1 = f1;
	planeta.userData.f2 = f2;

	if (texnubes != undefined){
		creaNubes(planeta, radio*1.1, Math.random()+0.5, texnubes);
	}

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

function creaLuna(planeta, radio, dist, vel, rotate, col, f1, f2, i=undefined) {
	var geom = new THREE.SphereGeometry(radio, 10, 10);
	var mat = new THREE.MeshPhongMaterial();

	let texture = undefined;
	let texbump = undefined;
	let texspec = undefined;
	let texnubes = undefined;

	if (i != undefined){
		texture = new THREE.TextureLoader().load("Texturas planetarias/P"+i+"/Difusa.png");
		texbump = new THREE.TextureLoader().load("Texturas planetarias/P"+i+"/Rugosidad.png");
		texspec = new THREE.TextureLoader().load("Texturas planetarias/P"+i+"/Especular.png");
		texnubes = new THREE.TextureLoader().load("Texturas planetarias/P"+i+"/Nubes.png");
	}

	//Textura
	if (texture != undefined){
		mat.map = texture;
	}
	//Rugosidad
	if (texbump != undefined){
		mat.bumpMap = texbump;
		mat.bumpScale = 0.5;
	}

	//Especular
	if (texspec != undefined){
		mat.specularMap = texspec;
		mat.specular = new THREE.Color('grey');
	}

	var luna = new THREE.Mesh(geom, mat);
	luna.userData.dist = dist;
	luna.userData.speed = vel;
	luna.userData.rSpeed = rotate;
	luna.userData.f1 = f1;
	luna.userData.f2 = f2;

	Lunas.push(luna);
	planeta.add(luna);

	if (texnubes != undefined){
		creaNubes(luna, radio*1.1, Math.random()+0.5, texnubes);
	}

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
	planeta.add(orbita);
};
	
	
	
	//Bucle de animación
	function animationLoop() {
    
		timestamp = (Date.now() - t0) * accglobal;

		requestAnimationFrame(animationLoop);

		estrella.rotation.z = timestamp * estrella.userData.rSpeed;

		//Modifica rotación de todos los objetos
		for(let object of Planetas) {
			object.position.x = Math.cos(timestamp * object.userData.speed) * object.userData.f1 * object.userData.dist;
			object.position.y = Math.sin(timestamp * object.userData.speed) * object.userData.f2 * object.userData.dist;
			object.rotation.z = timestamp * object.userData.rSpeed;
		}

		//Modifica posición de cada luna
		Lunas.forEach(function(luna) {
		  luna.position.x = Math.cos(timestamp * luna.userData.speed) * luna.userData.f1 * luna.userData.dist;
		  luna.position.y = Math.sin(timestamp * luna.userData.speed) * luna.userData.f2 * luna.userData.dist;
		  luna.rotation.z = timestamp * luna.userData.rSpeed;
		});
		//Modifica posición de cada luna
		Nubes.forEach(function(nubes) {
			nubes.rotation.z = timestamp * nubes.userData.v;
		});

		t1 = new Date();
		let secs = (t1 - t0) / 1000;
		flyControls.update(0.5 * secs);
		
		renderer.render( scene, camera );
		renderer2.render( scene, camera2 );
		
	}