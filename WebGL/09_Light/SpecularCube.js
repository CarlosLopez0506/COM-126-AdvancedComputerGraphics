// Specular.js 2013 (c) matsuda
// Vertex shader program
// TODO: Prepare shader to receive light and normal information
// TODO: Calculate different aspects for light (ambient, diffuse)
// TODO: Pass the corresponding data to the fragment shader
var VSHADER_SOURCE =
  "attribute vec4 a_Position;\n" +
  "attribute vec4 a_Color;\n" +
  "uniform mat4 u_ViewMatrix;\n" +
  "uniform mat4 u_ModelMatrix;\n" +
  "varying vec4 v_Color;\n" +
  "void main() {\n" +
  "  mat4 modelViewMatrix = u_ViewMatrix * u_ModelMatrix;\n" +
  "  gl_Position = modelViewMatrix * a_Position ;\n" +
  "  v_Color = a_Color;\n" +
  "}\n";

// Fragment shader program
// TODO: Prepare shader to receive information to create specular
var FSHADER_SOURCE =
  "#ifdef GL_ES\n" +
  "precision mediump float;\n" +
  "#endif\n" +
  "varying vec4 v_Color;\n" +
  "void main() {\n" +
  "  gl_FragColor = v_Color;\n" +
  "}\n";

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

  var u_ViewMatrix = gl.getUniformLocation(gl.program, "u_ViewMatrix");
  if (!u_ViewMatrix) {
    console.log("Failed to get the storage location");
    return;
  }

  // Set the vertex coordinates, the color and the normal
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log("Failed to set the vertex information");
    return;
  }

  gl.clearColor(0, 0, 0, 1);
  gl.enable(gl.DEPTH_TEST);

  // TODO: Pass the required matrices to the vertices
  var u_ViewMatrix = gl.getUniformLocation(gl.program, "u_ViewMatrix");
  var u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
  if (!u_ViewMatrix || !u_ModelMatrix) {
    console.log("Failed to get the storage location");
    return;
  }
  // TODO: Set values for matrices required by shaders

  var viewMatrix = new Matrix4();
  viewMatrix.setLookAt(0, 3, 10, 0, 0, 0, 0, 1, 0); // eyePos - focusPos - upVector

  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

  // TODO: get reference to light color and normal matrix from shader

  // TODO: Set the light color (white)

  // TODO: Set the light direction (in the world coordinate)

  // TODO: Set the ambient light

  var modelMatrix = new Matrix4();
  var angle = 0;
  var tick = function () {
    angle += 0.3;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    drawCube(gl, n, angle, modelMatrix, u_ModelMatrix);
    requestAnimationFrame(tick, canvas);
  };
  tick();
}

function drawCube(gl, n, angle, modelMatrix, u_ModelMatrix) {
  // TODO: Adjust the model matrix to deal with the new angle

  // TODO: Pass the updated matrix to the shader

  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}

function initVertexBuffers(gl) {
  // prettier-ignore
  var cubeVertices = new Float32Array([
     1, 1, 1,  -1, 1, 1,  -1,-1, 1,   1,-1, 1,  // v0-v1-v2-v3 front
     1, 1, 1,   1,-1, 1,   1,-1,-1,   1, 1,-1,  // v0-v3-v4-v5 right
     1, 1, 1,   1, 1,-1,  -1, 1,-1,  -1, 1, 1,  // v0-v5-v6-v1 top 
    -1, 1, 1,  -1, 1,-1,  -1,-1,-1,  -1,-1, 1,  // v1-v6-v7-v2 left
    -1,-1,-1,   1,-1,-1,   1,-1, 1,  -1,-1, 1,  // v7-v4-v3-v2 bottom
     1,-1,-1,  -1,-1,-1,  -1, 1,-1,   1, 1,-1   // v4-v7-v6-v5 back
  ]);

  // Colors
  // prettier-ignore
  var cubeColors = new Float32Array([
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v1-v2-v3 front
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v3-v4-v5 right
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v5-v6-v1 up
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v1-v6-v7-v2 left
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v7-v4-v3-v2 down
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0     // v4-v7-v6-v5 back
 ]);

  // prettier-ignore
  var cubeNormals = new Float32Array([
    0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,     // v0-v1-v2-v3 front
    1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,     // v0-v3-v4-v5 right
    0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,     // v0-v5-v6-v1 top
   -1, 0, 0,  -1, 0, 0,  -1, 0, 0,  -1, 0, 0,     // v1-v6-v7-v2 left
    0,-1, 0,   0,-1, 0,   0,-1, 0,   0,-1, 0,     // v7-v4-v3-v2 bottom
    0, 0,-1,   0, 0,-1,   0, 0,-1,   0, 0,-1      // v4-v7-v6-v5 back
	]);

  // prettier-ignore
  var indices = new Uint8Array([
     0,  1,  2,   0,  2,  3,    // front
     4,  5,  6,   4,  6,  7,    // right
     8,  9, 10,   8, 10, 11,    // top
    12, 13, 14,  12, 14, 15,    // left
    16, 17, 18,  16, 18, 19,    // bottom
    20, 21, 22,  20, 22, 23     // back
  ]);

  if (!initArrayBuffer(gl, cubeVertices, 3, gl.FLOAT, "a_Position")) return -1;
  if (!initArrayBuffer(gl, cubeColors, 3, gl.FLOAT, "a_Color")) return -1;
  if (!initArrayBuffer(gl, cubeNormals, 3, gl.FLOAT, "a_Normal")) return -1;

  var indexBuffer = gl.createBuffer();
  if (!indexBuffer) {
    console.log("Failed to create the buffer object");
    return -1;
  }
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return indices.length;
}

function initArrayBuffer(gl, data, num, type, attribute) {
  // Create a buffer object
  var buffer = gl.createBuffer();
  if (!buffer) {
    console.log("Failed to create the buffer object");
    return false;
  }
  // Write date into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  // Assign the buffer object to the attribute variable
  var a_attribute = gl.getAttribLocation(gl.program, attribute);
  if (a_attribute < 0) {
    console.log("Failed to get the storage location of " + attribute);
    return false;
  }
  gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
  // Enable the assignment of the buffer object to the attribute variable
  gl.enableVertexAttribArray(a_attribute);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return true;
}
