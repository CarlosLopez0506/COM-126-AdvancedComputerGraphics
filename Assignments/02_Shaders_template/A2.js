// CREATE SCENE
var scene = new THREE.Scene();

// ADD FOG
scene.fog = new THREE.Fog(0xcdcdcd, 10, 50);

// SETUP RENDERER
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xcdcdcd);
document.body.appendChild(renderer.domElement);

// SETUP CAMERA
var camera = new THREE.PerspectiveCamera(
  25.0,
  window.innerWidth / window.innerHeight,
  0.1,
  10000
);
camera.position.set(0.0, 15.0, 40.0);
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

// FLOOR
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

//TEXTURES
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


//LIGHTING PROPERTIES
var lightColor = { type: "c", value: new THREE.Color(1.0, 1.0, 1.0) };
var ambientColor = { type: "c", value: new THREE.Color(0.4, 0.4, 0.4) };
var lightPosition = { type: "v3", value: new THREE.Vector3(0.49, 0.79, 0.49) };

//MATERIAL PROPERTIES
var kAmbient = { type: "f", value: 0.4 };
var kDiffuse = { type: "f", value: 0.8 };
var kSpecular = { type: "f", value: 0.8 };
var shininess = { type: "f", value: 10.0 };

// SHADER MATERIALS (Remember to change this, in order to use uniform variables.)
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
      fogColor: { type: "c", value: scene.fog.color },
      fogNear: { type: "f", value: scene.fog.near },
      fogFar: { type: "f", value: scene.fog.far }
  }
});

var phongMaterial = new THREE.ShaderMaterial({
  uniforms: {
    lightPosition: lightPosition ,
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
var blinnPhongMaterial = new THREE.ShaderMaterial({
  uniforms: {
    lightPosition: lightPosition ,
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
  fog: true // Enable fog
});

var racoonMaterial = new THREE.ShaderMaterial({
  uniforms: {
      racoonTexture: { type: 't', value: racoonTexture },
      textureScale: { type: 'f', value: 0.1 },
      fogColor: { type: 'c', value: scene.fog.color },
      fogNear: { type: 'f', value: scene.fog.near },
      fogFar: { type: 'f', value: scene.fog.far }
  },
  fog: true // Enable fog
});


// LOAD SHADERS
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

// WORLD COORDINATE FRAME: other objects are defined with respect to it
var worldFrame = new THREE.AxisHelper(5);
scene.add(worldFrame);
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
  Math.PI *1.5,
  0,
  0
);
// CREATE SPHERES
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

// Keyboard event listener
document.addEventListener('keydown', function(event) {
  switch(event.key) {
    case 'l':
      randomizeLightColor();
      break;
    case 'm':
      randomizeSphereBaseColor();
      break;
  }
});

// Function to randomize light color while keeping intensity constant
function randomizeLightColor() {
  var randomColor = new THREE.Color(Math.random(), Math.random(), Math.random());
  lightColor.value.copy(randomColor);
}

// Function to randomize sphere base color while keeping intensity constant
function randomizeSphereBaseColor() {
  var randomColor = new THREE.Color(Math.random(), Math.random(), Math.random());
  gouraudMaterial.uniforms.diffuseColor.value.copy(randomColor);
  phongMaterial.uniforms.diffuseColor.value.copy(randomColor);
  blinnPhongMaterial.uniforms.diffuseColor.value.copy(randomColor);
  gouraudMaterial.uniforms.ambientColor.value.copy(randomColor);
  phongMaterial.uniforms.ambientColor.value.copy(randomColor);
  blinnPhongMaterial.uniforms.ambientColor.value.copy(randomColor);
}

// Ensure shaders are updated after changing uniforms
function updateShaders() {
  gouraudMaterial.needsUpdate = true;
  phongMaterial.needsUpdate = true;
  blinnPhongMaterial.needsUpdate = true;
}

// Inside your render loop
var render = function () {
  textureMaterial.needsUpdate = true;
  racoonMaterial.needsUpdate = true;
  updateShaders(); 
  requestAnimationFrame(render);
  renderer.render(scene, camera);
};

render();
