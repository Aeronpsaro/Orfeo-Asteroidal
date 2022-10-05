# Primeros pasos con Three.js

## Introducción

[Three.js](https://threejs.org/) es una biblioteca de JavaScript de grandes posibilidades para gráficos 3D en el navegador, que hace uso de WEebGL. Cuenta
con nutrida documentación y una comunidad activa, por lo que la hemos escogido para las prácticas de las próximas semanas en la asignatura

## Ejemplo mínimo

Los ejemeplos de código proporcionados a través de [Glitch](https://glitch.com) cuentan con un archivo index.html. En nuestra adaptación para crear un ejemplo mínimo, hemos decidido separar nuestro código JavaScript, para facilitarnos alternar entre distintos ejemplos.

Para un ejemplo mínimo, sugerir el primer tutorial de la documentación de Three.js, [Creación de una escena](https://threejs.org/docs/#manual/en/introduction/Creating-a-scene). El archico index.html es similar a:


```
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Ejemplo de three.js app mínimo</title>
		<style>
			body { margin: 0; }
		</style>
	</head>
	<body>
		<script src="three.min.js"></script>
		<script src="/miscript.js" defer></script>		
	</body>
</html>
```

Renombrando miscript.js por el código concreto de JavaScript que nos interese, tendremos ejecuciones diferentes. Como primer paso, a diferencia del ejemplo de la documentaciónde Three.js, en lugar de un cubo, optaremos por una esfera. El código de *script_esfera_minimo.js*, luce así:

```
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
```

El código crea y configura instancias a escena, cámara y reproductor antes de definir la esfera a partir de una geometría y un material, añadiendo la esfera a la escena previamente creada. En el bucle de animación se modifica la rotación en x de la esfera. Rota sobre el origen localizado en el centro de la ventana.


Para conocer otras primitivas disponibles, recomendar el [tutorial](https://r105.threejsfundamentals.org/threejs/lessons/threejs-primitives.html) de *Three.js Fundamentals* sobre primitivas.

## Modularidad

De cara a crear escenas con mayor número de objetos, estructurar el código facilita el trabajo. El siguiente código *script_esfera_estructurado.js*, facilita la creación de esferas similares:

```
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
  Esfera(2.5,1,10,10, 0xf0f00f)

  //Posición de la cámara
  camera.position.z = 5;  
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
```

## Rotación sobre un pivote

La tarea propuesta para esta semana consiste en crear un sistema planetario, con planetas que puedan tener lunas. Asumiendo órbitas circulares 


## Rotación elçiptica

## Referencias

Referencias que han servido para la confección de los diversos ejemplos:

- [Documentación](https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene)  
- [Three.js Fundamentals](Three.js Fundamentals)
