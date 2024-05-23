
if (!Detector.webgl) {
	Detector.addGetWebGLMessage();
}

var container;
var camera, controls, scene, renderer;
var lighting, ambient, keyLight, fillLight, backLight;
var model, material;

/* Set size of canvas */
var width = 500;
var height = 450;

/* Get model */
model = 'giraffe.obj';

container = document.getElementById('viewer');

/* Camera */
camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
camera.position.z = 3;

/* Scene */
scene = new THREE.Scene();
lighting = false;
ambient = new THREE.AmbientLight(0xffffff, 1.0);
scene.add(ambient);
keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1.0);
keyLight.position.set(-100, 0, 100);
fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
fillLight.position.set(100, 0, 100);
backLight = new THREE.DirectionalLight(0xffffff, 1.0);
backLight.position.set(100, 0, -100).normalize();

/* Material (wireframe) */
material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });

/* Model */
var objLoader = new THREE.OBJLoader();
objLoader.setPath('.');


/* Renderer */
renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(width, height);
renderer.setClearColor(new THREE.Color("hsl(0, 0%, 10%)"));
container.appendChild(renderer.domElement);


/* Controls */
controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.75;
controls.enableZoom = false;

/* timeout handling */
controls.addEventListener('touchmove', function(evt) {
	reset_timeout()
}, false);

/* Events */
window.addEventListener('resize', onWindowResize, false);
window.addEventListener('keydown', onKeyboardEvent, false);


function onWindowResize() {
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
	renderer.setSize(width, height);
}

function onKeyboardEvent(e) {
	if (e.code === 'KeyL') {
		lighting = !lighting;
		if (lighting) {
			ambient.intensity = 0.25;
			scene.add(keyLight);
			scene.add(fillLight);
			scene.add(backLight);
		} else {
			ambient.intensity = 1.0;
			scene.remove(keyLight);
			scene.remove(fillLight);
			scene.remove(backLight);
		}
	}
}

function animate() {
	requestAnimationFrame(animate);
	controls.update();
	render();
}

function render() {
	renderer.render(scene, camera);
}

animate()