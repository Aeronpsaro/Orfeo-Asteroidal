let scene, renderer;
let camera;
let info;
let grid;
let camcontrols1;
let objetos = [];

// GUI
let gui = new dat.gui.GUI();

init();
animationLoop();

function init() {
  info = document.createElement("div");
  info.style.position = "absolute";
  info.style.top = "30px";
  info.style.width = "100%";
  info.style.textAlign = "center";
  info.style.color = "#fff";
  info.style.fontWeight = "bold";
  info.style.backgroundColor = "transparent";
  info.style.zIndex = "1";
  info.style.fontFamily = "Monospace";
  info.innerHTML = "three.js - luces";
  document.body.appendChild(info);

  //Defino cámara
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 10);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  camcontrols1 = new THREE.OrbitControls(camera, renderer.domElement);

  //Rejilla de referencia
  grid = new THREE.GridHelper(20, 40);
  //MOstrarla en vertical
  grid.geometry.rotateX(Math.PI / 2);
  grid.position.set(0, 0, 0.05);
  scene.add(grid);

  //Objetos BasicMaterial
  /*Esfera(-3.0, 0, 0, 0.8, 10, 10, 0xff0000);
  Esfera(0.0, 0, 0, 0.8, 10, 10, 0x00ff00);
  Esfera(3.0, 0, 0, 0.8, 10, 10, 0x0000ff);*/

  //Objetos Phong
  EsferaPhong(-3.0, 0, 0, 0.8, 10, 10, 0xff0000);
  EsferaPhong(0.0, 0, 0, 0.8, 10, 10, 0x00ff00);
  EsferaPhong(3.0, 0, 0, 0.8, 10, 10, 0x0000ff);

  //Luces
  //Luz ambiente
  /*const Lamb = new THREE.AmbientLight(0xffffff, 0.5);
				scene.add(Lamb);
				
				//Luz ambiente GUI
				const Lamb_Info = gui.addFolder('luz ambiente');
				const Lamb_Params = { color: Lamb.color.getHex() };
				
				Lamb_Info.add(Lamb, 'intensity', 0, 1, 0.1);
				Lamb_Info
				  .addColor(Lamb_Params, 'color')
				  .onChange((value) => Lamb.color.set(value));
				Lamb_Info.open();*/

  //Luz direccional y asistente
  /*const Ldir = new THREE.DirectionalLight(0xffffff, 0.5);
				Ldir.position.set(0, 2, 0);
				//Sombras 
				//Ldir.castShadow = true;
				const LdirHelper = new THREE.DirectionalLightHelper(Ldir, 3);
				scene.add(Ldir);
				scene.add(LdirHelper);

				// Luz direccional GUI
				const Ldir_Params = {
				  visible: true,
				  color: Ldir.color.getHex(),
				};
				const Ldir_Info = gui.addFolder('luz direccional');
				Ldir_Info.add(Ldir_Params, 'visible').onChange((value) => {
				  Ldir.visible = value;
				  LdirHelper.visible = value;
				});
				Ldir_Info.add(Ldir, 'intensity', 0, 1, 0.25);
				Ldir_Info.add(Ldir.position, 'y', 1, 4, 0.5);
				Ldir_Info
				  .addColor(Ldir_Params, 'color')
				  .onChange((value) => Ldir.color.set(value));
				Ldir_Info.open();*/

  //Luz focal y asistente
  /*const Lspot = new THREE.SpotLight(0x00ff00, 1, 8, Math.PI / 8, 0);
				Lspot.position.set(0, 2, 2);
				const LspotHelper = new THREE.SpotLightHelper(Lspot);
				scene.add(Lspot, LspotHelper);

				// Luz spot GUI
				const Lspot_Params = {
				  visible: true,
				};
				const Lspot_Info = gui.addFolder('luz spot');
				Lspot_Info.add(Lspot_Params, 'visible').onChange((value) => {
				  Lspot.visible = value;
				  LspotHelper.visible = value;
				});
				Lspot_Info.add(Lspot, 'intensity', 0, 4, 0.5);
				Lspot_Info.add(Lspot, 'angle', Math.PI / 16, Math.PI / 2, Math.PI / 16);
				Lspot_Info.open();*/

  //Luz puntual y asistente
  /*const Lpunt = new THREE.PointLight(0xffffff, 1, 8, 2);
				Lpunt.position.set(2, 2, 2);
				const LpuntHelper = new THREE.PointLightHelper(Lpunt, 0.5);
				scene.add(Lpunt, LpuntHelper);

				// Luz puntual GUI
				const Lpunt_Params = {
				  visible: true,
				  color: Lpunt.color.getHex(),
				};
				const Lpunt_Info = gui.addFolder('luz puntual');
				Lpunt_Info.add(Lpunt_Params, 'visible').onChange((value) => {
				  Lpunt.visible = value;
				  LpuntHelper.visible = value;
				});
				Lpunt_Info.add(Lpunt, 'intensity', 0, 2, 0.25);
				Lpunt_Info.add(Lpunt.position, 'x', -2, 4, 0.5);
				Lpunt_Info.add(Lpunt.position, 'y', -2, 4, 0.5);
				Lpunt_Info.add(Lpunt.position, 'z', -2, 4, 0.5);
				Lpunt_Info
				  .addColor(Lpunt_Params, 'color')
				  .onChange((value) => Lpunt.color.set(value));
				Lpunt_Info.open();*/
}

function Esfera(px, py, pz, radio, nx, ny, col) {
  let geometry = new THREE.SphereBufferGeometry(radio, nx, ny);
  //Material con o sin relleno
  let material = new THREE.MeshBasicMaterial({
    color: col,
  });

  let mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(px, py, pz);
  scene.add(mesh);
  objetos.push(mesh);
}

function EsferaPhong(px, py, pz, radio, nx, ny, col) {
  let geometry = new THREE.SphereBufferGeometry(radio, nx, ny);
  //Material con o sin relleno
  let material = new THREE.MeshPhongMaterial({
    color: col,
  });

  let mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(px, py, pz);
  scene.add(mesh);
  objetos.push(mesh);
}

//Bucle de animación
function animationLoop() {
  requestAnimationFrame(animationLoop);

  //Modifica rotación de todos los objetos
  for (let object of objetos) {
    object.rotation.y += 0.01;
  }

  renderer.render(scene, camera);
}
