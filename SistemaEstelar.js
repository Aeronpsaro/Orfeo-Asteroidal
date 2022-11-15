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
let uniforms;

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
	let gridGeom = new THREE.PlaneGeometry(30, 30);
	function vertexShader() {return `
        varying vec2 pos; 

        void main() {
            pos = uv; 

            vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * modelViewPosition; 
        }
    `;}
	function fragmentShader() {return `
		#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
varying vec2 pos;


// Valor aleatorio en 2D
vec2 random2(vec2 st){
  st = vec2( dot(st,vec2(127.1,311.7)),
            dot(st,vec2(269.5,183.3)) );
  return -1.0 + 2.0*fract(sin(st)*43758.5453123);
}

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

// Gradient Noise by Inigo Quilez - iq/2013
// https://www.shadertoy.com/view/XdXGW8
float noise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);

  // Interpolación con Hemite cúbico
  //vec2 u = smoothstep(0.,1.,f); // Equivalente
  vec2 u = f*f*(3.0-2.0*f);

  return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                   dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
              mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                   dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}

// Permutation polynomial: (34x^2 + x) mod 289
vec4 permute(vec4 x) {
  return mod((34.0 * x + 1.0) * x, 289.0);
}

// Cellular noise, returning F1 and F2 in a vec2.
// Speeded up by using 2x2 search window instead of 3x3,
// at the expense of some strong pattern artifacts.
// F2 is often wrong and has sharp discontinuities.
// If you need a smooth F2, use the slower 3x3 version.
// F1 is sometimes wrong, too, but OK for most purposes.
vec2 cellular2x2(vec2 P) {
#define K 0.142857142857 // 1/7
#define K2 0.0714285714285 // K/2
#define jitter 0.8 // jitter 1.0 makes F1 wrong more often
vec2 Pi = mod(floor(P), 289.0);
vec2 Pf = fract(P);
vec4 Pfx = Pf.x + vec4(-0.5, -1.5, -0.5, -1.5);
vec4 Pfy = Pf.y + vec4(-0.5, -0.5, -1.5, -1.5);
vec4 p = permute(Pi.x + vec4(0.0, 1.0, 0.0, 1.0));
p = permute(p + Pi.y + vec4(0.0, 0.0, 1.0, 1.0));
vec4 ox = mod(p, 7.0)*K+K2;
vec4 oy = mod(floor(p*K),7.0)*K+K2;
vec4 dx = Pfx + jitter*ox;
vec4 dy = Pfy + jitter*oy;
vec4 d = dx * dx + dy * dy; // d11, d12, d21 and d22, squared
// Sort out the two smallest distances
#if 0
// Cheat and pick only F1
d.xy = min(d.xy, d.zw);
d.x = min(d.x, d.y);
return d.xx; // F1 duplicated, F2 not computed
#else
// Do it right and find both F1 and F2
d.xy = (d.x < d.y) ? d.xy : d.yx; // Swap if smaller
d.xz = (d.x < d.z) ? d.xz : d.zx;
d.xw = (d.x < d.w) ? d.xw : d.wx;
d.y = min(d.y, d.z);
d.y = min(d.y, d.w);
return sqrt(d.xy);
#endif
}

#define SCALE 15.

void main() {
    //vec2 st = gl_Position.xy;//gl_FragCoord.xy/u_resolution.xy;
    vec2 st = pos;
    st -= 0.5;
    st *= SCALE;
    st = rotate2d(u_time)*st;
    vec3 color = vec3(0.0);

    // Escalado
    vec2 pos = vec2(st*5.0);
    // Función de ruido
    float noise = noise(pos);
    
    vec2 F = cellular2x2(st*20.);

pos = st-.5;
float a = 100000.;//-u_time*0.1;

float n = 1.-step(abs(sin(a))-.1,.05+(F.x-F.y)*2.) ;
    
    color = vec3( noise*.5+.5 )*step(0.2,noise)*smoothstep(0.1*SCALE,0.15*SCALE,distance(vec2(0.),st)*0.5)*smoothstep(0.25*SCALE,0.2*SCALE,distance(vec2(0.),st)*0.5)*n;

    gl_FragColor = vec4(color, step(0.2,noise)*step(0.1,smoothstep(0.1*SCALE,0.15*SCALE,distance(vec2(0.),st)*0.5)*smoothstep(0.25*SCALE,0.2*SCALE,distance(vec2(0.),st)*0.5)));
    }
	  `;}
	uniforms = {
		u_time: { value: 0 },
		u_resolution:  { value: new THREE.Vector2() },
	};
	let gridMat = new THREE.ShaderMaterial({
		vertexShader: vertexShader(),
		fragmentShader: fragmentShader(),
		uniforms: uniforms,
		transparent: true,
		side: THREE.DoubleSide
	});
	//const gridMat = new THREE.MeshBasicMaterial({color:0xffffff, side: THREE.DoubleSide});
	grid = new THREE.Mesh(gridGeom, gridMat);
	//Mostrarla en vertical
	//grid.geometry.rotateX( Math.PI / 2 );
	grid.position.set(0, 0, .05);
	scene.add(grid);

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

		uniforms.u_resolution.value.set(renderer.domElement.width, renderer.domElement.height);
		uniforms.u_time.value = timestamp;
		
		renderer.render( scene, camera );
		uniforms.u_resolution.value.set(renderer2.domElement.width, renderer2.domElement.height);
		renderer2.render( scene, camera2 );
		
	}