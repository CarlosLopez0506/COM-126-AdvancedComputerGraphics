/**
 * Assignment 1 Carlos Esteban Lopez Sanchez
 */

var scene = new THREE.Scene();

// SETUP RENDERER
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xffffff); // white background colour
document.body.appendChild(renderer.domElement);

// SETUP CAMERA
var camera = new THREE.PerspectiveCamera(30, 1, 0.1, 1000); // view angle, aspect ratio, near, far
camera.position.set(10, 15, 40);
camera.lookAt(scene.position);
scene.add(camera);

// SETUP ORBIT CONTROL OF THE CAMERA
var controls = new THREE.OrbitControls(camera);
controls.damping = 0.2;

// ADAPT TO WINDOW RESIZE
function resize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

window.addEventListener("resize", resize);
resize();

// WORLD COORDINATE FRAME: other objects are defined with respect to it
var worldFrame = new THREE.AxisHelper(5);
scene.add(worldFrame);

var displayScreenGeometry = new THREE.CylinderGeometry(8, 8, 13.5, 32);
var displayMaterial = new THREE.MeshBasicMaterial({
  color: 0xffff00,
  transparent: true,
  opacity: 0.2,
});
var displayObject = new THREE.Mesh(displayScreenGeometry, displayMaterial);
displayObject.position.x = 0;
displayObject.position.y = 5;
scene.add(displayObject);
displayObject.parent = worldFrame;

// FLOOR
var floorTexture = new THREE.ImageUtils.loadTexture("images/floor.jpg");
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(1, 1);

var floorMaterial = new THREE.MeshBasicMaterial({
  map: floorTexture,
  side: THREE.DoubleSide,
});
var floorGeometry = new THREE.PlaneBufferGeometry(30, 30);
var floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.y = -0.1;
floor.rotation.x = Math.PI / 2;
scene.add(floor);
floor.parent = worldFrame;

// UNIFORMS
var remotePosition = { type: "v3", value: new THREE.Vector3(0, 5, 5 ) };
var rcState = { type: "i", value: 1 };
var explosionFactor = {type: "f", value:0.0}; // Initial explosion factor
var transitionDuration = 3000; // Transition duration in milliseconds
var startTime = 0; // Start time of the transition

// MATERIALS
/* HINT: YOU WILL NEED TO SHARE VARIABLES FROM HERE */

var racoonMaterial = new THREE.ShaderMaterial({
  uniforms: {
    remotePosition: remotePosition,
    explosionFactor: explosionFactor
  },
});

var remoteMaterial = new THREE.ShaderMaterial({
  uniforms: {
    remotePosition: remotePosition,
    rcState: rcState
  },
});

// LOAD SHADERS
var shaderFiles = [
  "glsl/racoon.vs.glsl",
  "glsl/racoon.fs.glsl",
  "glsl/remote.vs.glsl",
  "glsl/remote.fs.glsl",
];

new THREE.SourceLoader().load(shaderFiles, function (shaders) {
  racoonMaterial.vertexShader = shaders["glsl/racoon.vs.glsl"];
  racoonMaterial.fragmentShader = shaders["glsl/racoon.fs.glsl"];

  remoteMaterial.vertexShader = shaders["glsl/remote.vs.glsl"];
  remoteMaterial.fragmentShader = shaders["glsl/remote.fs.glsl"];
});

// LOAD RACCOON
function loadOBJ(file, material, scale, xOff, yOff, zOff, xRot, yRot, zRot) {
  var onProgress = function (query) {
    if (query.lengthComputable) {
      var percentComplete = (query.loaded / query.total) * 100;
      console.log(Math.round(percentComplete, 2) + "% downloaded");
    }
  };

  var onError = function () {
    console.log("Failed to load " + file);
  };

  var loader = new THREE.OBJLoader();
  loader.load(
    file,
    function (object) {
      object.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          child.material = material;
        }
      });

      object.position.set(xOff, yOff, zOff);
      object.rotation.x = xRot;
      object.rotation.y = yRot;
      object.rotation.z = zRot;
      object.scale.set(scale, scale, scale);
      object.parent = worldFrame;
      scene.add(object);
    },
    onProgress,
    onError
  );
}

loadOBJ(
  "obj/Racoon.obj",
  racoonMaterial,
  1.0,
  0,
  0,
  0,
  0,
  0,
  0
);

// CREATE REMOTE CONTROL
var remoteGeometry = new THREE.SphereGeometry(1, 32, 32);
var remote = new THREE.Mesh(remoteGeometry, remoteMaterial);
remote.parent = worldFrame;
scene.add(remote);

// LISTEN TO KEYBOARD
var keyboard = new THREEx.KeyboardState();
function checkKeyboard() {
  if (keyboard.pressed("W")) remotePosition.value.z -= 0.1;
  else if (keyboard.pressed("S")) remotePosition.value.z += 0.1;

  if (keyboard.pressed("A")) remotePosition.value.x -= 0.1;
  else if (keyboard.pressed("D")) remotePosition.value.x += 0.1;

  if (keyboard.pressed("Q")) remotePosition.value.y += 0.1;
  else if (keyboard.pressed("E")) remotePosition.value.y -= 0.1;

  for (var i = 1; i < 4; i++) {
    if (keyboard.pressed(i.toString())) {
      rcState.value = i;
      break;
    }
  }
  remoteMaterial.needsUpdate = true; // Tells three.js that some uniforms might have changed
  racoonMaterial.needsUpdate = true; // Tells three.js that some uniforms might have changed
}

var spacePressed = false;

// LISTEN TO KEYBOARD
var keyboard = new THREEx.KeyboardState();
var spacePressed = false;
var startExplosionFactor = 0.0;
var targetExplosionFactor = 0.0;
var transitionDuration = 1000; // Duration of explosion and implosion in milliseconds
var transitionStartTime = 0; // Start time of the transition

window.addEventListener("keydown", function(event) {
  if (event.keyCode == 32 && !spacePressed) { // Space key
    if (explosionFactor.value === 0.0) {
      startExplosionFactor = 0.0;
    } else {
      startExplosionFactor = explosionFactor.value;
    }
    targetExplosionFactor = 30.0;
    transitionStartTime = Date.now();
    spacePressed = true;
  }
});

function updateExplosionFactor() {
  if (spacePressed) {
    var elapsed = Date.now() - transitionStartTime;
    if (elapsed < transitionDuration / 2) {
      // Explosion phase
      var t = elapsed / (transitionDuration / 2);
      explosionFactor.value = lerp(startExplosionFactor, targetExplosionFactor, t);
    } else if (elapsed < transitionDuration) {
      // Implosion phase
      var t = (elapsed - transitionDuration / 2) / (transitionDuration / 2);
      explosionFactor.value = lerp(targetExplosionFactor, 0.0, t);
    } else {
      explosionFactor.value = 0.0;
      spacePressed = false;
    }
  }
}

// Linear interpolation function
function lerp(start, end, t) {
  return start * (1 - t) + end * t;
}

// SETUP UPDATE CALL-BACK
function update() {
  updateExplosionFactor(); // Check and update explosionFactor
  checkKeyboard(); // Check other keyboard inputs
  requestAnimationFrame(update);
  renderer.render(scene, camera);
}

update();
   
