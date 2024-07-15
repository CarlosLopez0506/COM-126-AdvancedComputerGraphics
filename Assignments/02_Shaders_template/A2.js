/*
 * A2.js
 * Assignment 2
 * WebGL template
 * By: Clopez
 * Use of ChatGPT for generating documentation and improving readability
 */

/**
 * Initialize and run the 3D scene.
 */

var scene = new THREE.Scene();

scene.fog = new THREE.Fog(0xcdcdcd, 10, 50);
var isFogEnabled = true;

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xcdcdcd);
document.body.appendChild(renderer.domElement);

var camera = new THREE.PerspectiveCamera(
  25.0,
  window.innerWidth / window.innerHeight,
  0.1,
  10000
);
camera.position.set(0.0, 15.0, 40.0);
scene.add(camera);

var controls = new THREE.OrbitControls(camera);
controls.damping = 0.2;

function resize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

window.addEventListener("resize", resize);
resize();

var floorTexture = new THREE.ImageUtils.loadTexture("images/checkerboard.jpg");
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(4, 4);

var floorMaterial = new THREE.MeshBasicMaterial({
  map: floorTexture,
  side: THREE.DoubleSide,
});
var floor = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(30.0, 30.0),
  floorMaterial
);
floor.rotation.x = Math.PI / 2;
scene.add(floor);

var rocksTexture = new THREE.ImageUtils.loadTexture(
  "images/gravel-rocks-texture.jpg"
);
var racoonTexture = new THREE.ImageUtils.loadTexture(
  "images/gold.jpg",
  function(texture) {
      console.log("Textura del mapache cargada correctamente");
  },
  undefined,
  function(err) {
      console.error("Error al cargar la textura del mapache", err);
  }
);

var lightColor = { type: "c", value: new THREE.Color(1.0, 1.0, 1.0) };
var ambientColor = { type: "c", value: new THREE.Color(0.4, 0.4, 0.4) };
var lightPosition = { type: "v3", value: new THREE.Vector3(0.0, 0.0, 1.0) };

var kAmbient = { type: "f", value: 0.4 };
var kDiffuse = { type: "f", value: 0.8 };
var kSpecular = { type: "f", value: 0.8 };
var shininess = { type: "f", value: 10.0 };

var gouraudMaterial = new THREE.ShaderMaterial({
  uniforms: {
    lightPosition: lightPosition,
    lightColor: lightColor,
    ambientColor: ambientColor,
    diffuseColor: { type: "c", value: new THREE.Color(0.8, 0.8, 0.8) },
    specularColor: { type: "c", value: new THREE.Color(1.0, 1.0, 1.0) },
    ambientIntensity: kAmbient,
    diffuseIntensity: kDiffuse,
    specularIntensity: kSpecular,
    shininess: shininess,
  }
});

var phongMaterial = new THREE.ShaderMaterial({
  uniforms: {
    lightPosition: lightPosition,
    lightColor: lightColor,
    ambientColor: { type: "c", value: new THREE.Color(0.2, 0.2, 0.2) },
    diffuseColor: { type: "c", value: new THREE.Color(0.8, 0.8, 0.8) },
    specularColor: { type: "c", value: new THREE.Color(1.0, 1.0, 1.0) },
    ambientIntensity: { type: "f", value: 0.5 },
    diffuseIntensity: { type: "f", value: 0.8 },
    specularIntensity: { type: "f", value: 1.0 },
    shininess: { type: "f", value: 10.0 }
  }
});

var blinnPhongMaterial = new THREE.ShaderMaterial({
  uniforms: {
    lightPosition: lightPosition,
    lightColor: lightColor,
    ambientColor: { type: "c", value: new THREE.Color(0.2, 0.2, 0.2) },
    diffuseColor: { type: "c", value: new THREE.Color(0.8, 0.8, 0.8) },
    specularColor: { type: "c", value: new THREE.Color(1.0, 1.0, 1.0) },
    ambientIntensity: { type: "f", value: 0.5 },
    diffuseIntensity: { type: "f", value: 0.8 },
    specularIntensity: { type: "f", value: 1.0 },
    shininess: { type: "f", value: 32.0 }
  }
});

var textureMaterial = new THREE.ShaderMaterial({
  uniforms: {
    sphereTexture: { type: 't', value: rocksTexture },
    fogColor: { type: 'c', value: scene.fog.color },
    fogNear: { type: 'f', value: scene.fog.near },
    fogFar: { type: 'f', value: scene.fog.far }
  },
  fog: true
});

var racoonMaterial = new THREE.ShaderMaterial({
  uniforms: {
    racoonTexture: { type: 't', value: racoonTexture },
    textureScale: { type: 'f', value: 0.1 },
    fogColor: { type: 'c', value: scene.fog.color },
    fogNear: { type: 'f', value: scene.fog.near },
    fogFar: { type: 'f', value: scene.fog.far }
  },
  fog: true
});

var shaderFiles = [
  "glsl/racoon.vs.glsl",
  "glsl/racoon.fs.glsl",
  "glsl/gouraud.fs.glsl",
  "glsl/gouraud.vs.glsl",
  "glsl/phong.vs.glsl",
  "glsl/phong.fs.glsl",
  "glsl/blinnPhong.vs.glsl",
  "glsl/blinnPhong.fs.glsl",
  "glsl/texture.fs.glsl",
  "glsl/texture.vs.glsl",
];

new THREE.SourceLoader().load(shaderFiles, function (shaders) {
  gouraudMaterial.vertexShader = shaders["glsl/gouraud.vs.glsl"];
  gouraudMaterial.fragmentShader = shaders["glsl/gouraud.fs.glsl"];
  phongMaterial.vertexShader = shaders["glsl/phong.vs.glsl"];
  phongMaterial.fragmentShader = shaders["glsl/phong.fs.glsl"];
  blinnPhongMaterial.vertexShader = shaders["glsl/blinnPhong.vs.glsl"];
  blinnPhongMaterial.fragmentShader = shaders["glsl/blinnPhong.fs.glsl"];
  textureMaterial.fragmentShader = shaders["glsl/texture.fs.glsl"];
  textureMaterial.vertexShader = shaders["glsl/texture.vs.glsl"];
  racoonMaterial.vertexShader = shaders["glsl/racoon.vs.glsl"];
  racoonMaterial.fragmentShader = shaders["glsl/racoon.fs.glsl"];
});

var worldFrame = new THREE.AxisHelper(5);
scene.add(worldFrame);

/**
 * Load an OBJ file and add it to the scene.
 * @param {string} file - The path to the OBJ file.
 * @param {THREE.Material} material - The material to apply to the OBJ.
 * @param {number} scale - The scale of the OBJ.
 * @param {number} xOff - The x offset position.
 * @param {number} yOff - The y offset position.
 * @param {number} zOff - The z offset position.
 * @param {number} xRot - The x rotation.
 * @param {number} yRot - The y rotation.
 * @param {number} zRot - The z rotation.
 */
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
  4.0,
  0,
  0,
  -5,
  Math.PI * 1.5,
  0,
  0
);

var sphereRadius = 2.0;
var sphere = new THREE.SphereGeometry(sphereRadius, 16, 16);

var gouraudSphere = new THREE.Mesh(sphere, gouraudMaterial);
gouraudSphere.position.set(-7.5, sphereRadius, 0);
scene.add(gouraudSphere);

var phongSphere = new THREE.Mesh(sphere, phongMaterial);
phongSphere.position.set(-2.5, sphereRadius, 0);
scene.add(phongSphere);

var blinnPhongSphere = new THREE.Mesh(sphere, blinnPhongMaterial);
blinnPhongSphere.position.set(2.5, sphereRadius, 0);
scene.add(blinnPhongSphere);

var textureSphere = new THREE.Mesh(sphere, textureMaterial);
textureSphere.position.set(7.5, sphereRadius, 0);
scene.add(textureSphere);

document.addEventListener('keydown', function(event) {
  switch(event.key) {
    case 'l':
      randomizeLightColor();
      break;
    case 'm':
      randomizeSphereBaseColor();
      break;
    case 'f':
      toggleFog();
      break;
  }
});

/**
 * Randomize the light color while keeping intensity constant.
 */
function randomizeLightColor() {
  var randomColor = new THREE.Color(Math.random(), Math.random(), Math.random());
  lightColor.value.copy(randomColor);
}

/**
 * Randomize the sphere base color while keeping intensity constant.
 */
function randomizeSphereBaseColor() {
  var randomColor = new THREE.Color(Math.random(), Math.random(), Math.random());
  gouraudMaterial.uniforms.diffuseColor.value.copy(randomColor);
  phongMaterial.uniforms.diffuseColor.value.copy(randomColor);
  blinnPhongMaterial.uniforms.diffuseColor.value.copy(randomColor);
  gouraudMaterial.uniforms.ambientColor.value.copy(randomColor);
  phongMaterial.uniforms.ambientColor.value.copy(randomColor);
  blinnPhongMaterial.uniforms.ambientColor.value.copy(randomColor);
}

/**
 * Toggle the fog effect on and off.
 */
function toggleFog() {
  isFogEnabled = !isFogEnabled;
  if (isFogEnabled) {
    scene.fog = new THREE.Fog(0xcdcdcd, 10, 50);
    console.log("Fog enabled");
  } else {
    scene.fog = null;
    console.log("Fog disabled");
  }

  textureMaterial.uniforms.fogColor.value = scene.fog ? scene.fog.color : new THREE.Color(0xcdcdcd);
  textureMaterial.uniforms.fogNear.value = scene.fog ? scene.fog.near : 1000000;
  textureMaterial.uniforms.fogFar.value = scene.fog ? scene.fog.far : 1000000;

  racoonMaterial.uniforms.fogColor.value = scene.fog ? scene.fog.color : new THREE.Color(0xcdcdcd);
  racoonMaterial.uniforms.fogNear.value = scene.fog ? scene.fog.near : 1000000;
  racoonMaterial.uniforms.fogFar.value = scene.fog ? scene.fog.far : 1000000;

  console.log("Fog uniforms updated", textureMaterial.uniforms.fogNear.value, textureMaterial.uniforms.fogFar.value);
}

/**
 * Update shaders to reflect changes in uniforms.
 */
function updateShaders() {
  gouraudMaterial.needsUpdate = true;
  phongMaterial.needsUpdate = true;
  blinnPhongMaterial.needsUpdate = true;
}

var render = function () {
  textureMaterial.needsUpdate = true;
  racoonMaterial.needsUpdate = true;
  updateShaders(); 
  requestAnimationFrame(render);
  renderer.render(scene, camera);
};

render();