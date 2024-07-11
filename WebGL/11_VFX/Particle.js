// Particle.js (c) 2012 tanaka and matsuda
// Vertex shader program
var VSHADER_SOURCE =
  "uniform mat4 u_perspectiveMatrix;\n" +
  "uniform mat4 u_modelMatrix;\n" +
  "uniform mat4 u_viewMatrix;\n" +
  "attribute vec4 a_Position;\n" +
  "attribute vec2 a_TexCoord;\n" +
  "varying vec4 v_Color;\n" +
  "varying vec2 v_TexCoord;\n" +
  "void main() {\n" +
  "  mat4 modelViewMatrix = u_viewMatrix * u_modelMatrix;\n" +
  "  gl_Position = u_perspectiveMatrix * modelViewMatrix * a_Position;\n" +
  "  v_TexCoord = a_TexCoord;\n" +
  "}\n";

// Fragment shader program
var FSHADER_SOURCE =
  "#ifdef GL_ES\n" +
  "precision mediump float;\n" +
  "#endif\n" +
  "uniform sampler2D u_Sampler;\n" +
  "uniform float u_Alpha;\n" +
  "varying vec2 v_TexCoord;\n" +
  "void main() {\n" +
  "  gl_FragColor.rgb = texture2D(u_Sampler, vec2(v_TexCoord.s, v_TexCoord.t)).rgb;\n" +
  "  gl_FragColor.a = u_Alpha;\n" +
  "}\n";

var g_perspMatrix = new Matrix4();
var g_modelMatrix = new Matrix4();
var g_viewMatrix = new Matrix4();

var a_PositionBuffer;
var a_IndexBuffer;
var a_TexCoordBuffer;

var TEXTURE;
var IMAGE;

function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById("webgl");

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log("Failed to get the rendering context for WebGL");
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("Failed to intialize shaders.");
    return;
  }

  // Set texture
  if (!initTextures(gl, "../resources/particle.png")) {
    console.log("Failed to set texture");
    return;
  }

  // Transformation matrices
  var u_perspMatrix = gl.getUniformLocation(gl.program, "u_perspectiveMatrix");
  var u_modelMatrix = gl.getUniformLocation(gl.program, "u_modelMatrix");
  var u_viewMatrix = gl.getUniformLocation(gl.program, "u_viewMatrix");
  if (!u_perspMatrix || !u_modelMatrix || !u_viewMatrix) {
    console.log("Failed to get the storage location");
    return;
  }
  // Light and texture uniforms
  var u_Sampler = gl.getUniformLocation(gl.program, "u_Sampler");
  var u_Alpha = gl.getUniformLocation(gl.program, "u_Alpha");
  if (!u_Sampler || !u_Alpha) {
    console.log("Failed to get the storage location");
    return;
  }

  init_gl(gl);
  if (!initVertexBuffers(gl)) {
    console.log("Failed to set the vertex information");
    return;
  }

  var particle = new Array(500);
  // TODO: Create particles

  var tick = function () {
    updateParticle(particle);
    drawCommon(gl, canvas, u_perspMatrix, u_viewMatrix);
    drawParticle(gl, particle, u_modelMatrix, u_Sampler, u_Alpha);
    window.requestAnimationFrame(tick);
  };
  tick();
}

function init_gl(gl) {
  gl.enable(gl.DEPTH_TEST);
  gl.depthMask(false);

  gl.clearColor(0, 0, 0, 1);

  // TODO: Activate blending for per-fragment operations
}

function drawCommon(gl, canvas, u_perspMatrix, u_viewMatrix) {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear <canvas>
  g_perspMatrix.setPerspective(30, canvas.width / canvas.height, 1, 10000);
  // eyePos - focusPos - upVector
  g_viewMatrix.setLookAt(0, 3, 10, 0, 2, 0, 0, 1, 0);
  gl.uniformMatrix4fv(u_perspMatrix, false, g_perspMatrix.elements);
  gl.uniformMatrix4fv(u_viewMatrix, false, g_viewMatrix.elements);
}

function drawParticle(gl, p, u_modelMatrix, u_Sampler, u_Alpha) {
  // TODO: Bind positions of particles into shader data

  // TODO: Bind texture coordinates of particles into shader data

  // TODO: Activate the texture information so particles con be properly rendered

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, a_IndexBuffer);

  for (var i = 0; i < p.length; ++i) {
    if (p[i].wait <= 0) {
      g_modelMatrix.setTranslate(
        p[i].position[0],
        p[i].position[1],
        p[i].position[2]
      );
      // Rotate around z-axis to show the front face
      g_modelMatrix.rotate(p[i].angle, 0, 0, 1);
      var scale = 0.5 * p[i].scale;
      g_modelMatrix.scale(scale, scale, scale);

      gl.uniformMatrix4fv(u_modelMatrix, false, g_modelMatrix.elements);
      gl.uniform1f(u_Alpha, p[i].alpha);
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 0);
    }
  }
}

// This method deals with the behavior
function updateParticle(p) {
  for (var i = 0; i < p.length; ++i) {
    // Wait for creation
    if (p[i].wait > 0) {
      p[i].wait--;
      continue;
    }
    // Update a vertex coordinate
    p[i].position[0] += p[i].velocity[0];
    p[i].position[1] += p[i].velocity[1];
    p[i].position[2] += p[i].velocity[2];

    // Decrease Y translation
    p[i].velocity[1] -= 0.003;
    // Fading out
    p[i].alpha -= 0.05;

    if (p[i].alpha <= 0) {
      initParticle(p[i], false);
    }
  }
}

// This method will bind the buffer data of the initial quads that will represent the sparks
function initVertexBuffers(gl) {
  //  v3----v2
  //  |      |
  //  |      |
  //  |      |
  //  v0----v1

  var quadVertices = new Float32Array([
    -0.5, -0.5, 0, 0.5, -0.5, 0, 0.5, 0.5, 0, -0.5, 0.5, 0,
  ]);
  a_PositionBuffer = initArrayBuffer(gl, quadVertices);
  if (!a_PositionBuffer) return false;

  var quadTexCoords = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]);
  a_TexCoordBuffer = initArrayBuffer(gl, quadTexCoords);
  if (!a_TexCoordBuffer) return false;

  var indices = new Uint8Array([0, 1, 2, 2, 3, 0]);
  a_IndexBuffer = gl.createBuffer();
  if (!a_IndexBuffer) {
    console.log("Failed to create the buffer object");
    return -1;
  }
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, a_IndexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return true;
}

function Particle() {
  this.velocity = new Array(3);
  this.position = new Array(3);
  this.angle = 0;
  this.scale = 0;
  this.alpha = 0;
  this.wait = 0;
}

// This method initializes a particle with random data
function initParticle(p, wait) {
  // Movement speed
  var angle = Math.random() * Math.PI * 2;
  var height = Math.random() * 0.02 + 0.13;
  var speed = Math.random() * 0.01 + 0.02;
  p.velocity[0] = Math.cos(angle) * speed;
  p.velocity[1] = height;
  p.velocity[2] = Math.sin(angle) * speed;

  p.position[0] = Math.random() * 0.2;
  p.position[1] = Math.random() * 0.2;
  p.position[2] = Math.random() * 0.2;

  // Rotation angle
  p.angle = Math.random() * 360;
  // Size
  p.scale = Math.random() * 0.5 + 0.5;
  // Transparency
  p.alpha = 5;
  // In initial stage, vary a time for creation
  if (wait == true) {
    // Time to wait
    p.wait = Math.random() * 120;
  }
}

function initTextures(gl, str) {
  TEXTURE = gl.createTexture();
  if (!TEXTURE) {
    console.log("Could not create texture");
    return false;
  }

  IMAGE = new Image();
  if (!IMAGE) {
    console.log("Could not create image");
    return false;
  }

  IMAGE.onload = function () {
    loadTexture(gl, TEXTURE, IMAGE);
  };
  IMAGE.src = str;

  return true;
}

function loadTexture(gl, texture, image) {
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  gl.bindTexture(gl.TEXTURE_2D, null);
}

function initArrayBuffer(gl, data) {
  // Create a buffer object
  var buffer = gl.createBuffer();
  if (!buffer) {
    console.log("Failed to create the buffer object");
    return 0;
  }
  // Write date into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  return buffer;
}
