// LightedCube_perFragment.js (c) 2012 matsuda
// TODO: Prepare shader to receive light and normal information
// TODO: Pass the corresponding data to the fragment shader
var VSHADER_SOURCE =
  "attribute vec4 a_Position;\n" +
  "attribute vec4 a_Color;\n" +
  "attribute vec4 a_Normal;\n" +
  "uniform mat4 u_MvpMatrix;\n" +
  "uniform mat4 u_NormalMatrix;\n" +
  "uniform vec3 u_LightDirection;\n" +
  "varying vec4 v_Color;\n" +
  "varying float v_Dot;\n" +
  "void main() {\n" +
  "  gl_Position = u_MvpMatrix * a_Position ;\n" +
  "  v_Color = a_Color ;\n" +
  "  vec4 normal = u_NormalMatrix * a_Normal;\n" +
  "  v_Dot = max(dot(u_LightDirection, normalize(normal.xyz)),0.0);\n" +
  "}\n";

// Fragment shader program
// TODO: Receive the lighting information from the vertex shader
var FSHADER_SOURCE =
  "#ifdef GL_ES\n" +
  "precision mediump float;\n" +
  "#endif\n" +
  "varying vec4 v_Color;\n" +
  "varying float v_Dot;\n" +
  "void main() {\n" +
  "  gl_FragColor = vec4(v_Color.rgb * v_Dot, v_Color.a);\n" +
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

  //
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log("Failed to initialize buffers");
    return;
  }

  // Set the clear color and enable the depth test
  gl.clearColor(0, 0, 0, 1);
  gl.enable(gl.DEPTH_TEST);

  // Get the storage locations of uniform variables and so on
  var u_mvpMatrix = gl.getUniformLocation(gl.program, "u_MvpMatrix");
  if (!u_mvpMatrix) {
    console.log("Failed to get the storage location");
    return;
  }

  // TODO: get reference to light color and normal matrix from shader
  var u_NormalMatrix = gl.getUniformLocation(gl.program, "u_NormalMatrix");
  var u_LightDirection = gl.getUniformLocation(gl.program, "u_LightDirection");
  if (!u_NormalMatrix || !u_LightDirection) {
    console.log("Failed to get the storage location");
    return;
  }
  // Set the viewing volume
  var viewMatrix = new Matrix4(); // View matrix
  var mvpMatrix = new Matrix4(); // Model view projection matrix
  var mvMatrix = new Matrix4(); // Model matrix

  // TODO: Create the transformation matrix for normals
  var normalMatrix = new Matrix4();
  // Calculate the view matrix
  viewMatrix.setLookAt(0, 3, 10, 0, 0, 0, 0, 1, 0);
  mvMatrix.set(viewMatrix).rotate(60, 0, 1, 0); // Rotate 60 degree around the y-axis
  // Calculate the model view projection matrix
  mvpMatrix.setPerspective(30, 1, 1, 100);
  mvpMatrix.multiply(mvMatrix);
  // TODO: Calculate the matrix to transform the normal based on the model matrix
  normalMatrix.setInverseOf(mvMatrix);
  normalMatrix.transpose();
  // Pass the model view matrix to u_mvpMatrix
  gl.uniformMatrix4fv(u_mvpMatrix, false, mvpMatrix.elements);

  // TODO: Pass the normal matrixu_normalMatrix
  gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
  // TODO: Pass the direction of the diffuse light(world coordinate, normalized)
  var lightDirection = new Vector3([0.5, 3.0, 4.0]);
  lightDirection.normalize();
  gl.uniform3fv(u_LightDirection, lightDirection.elements);

  // Clear color and depth buffer
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Draw the cube
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}

function initVertexBuffers(gl) {
  // Create a cube
  //    v6----- v5
  //   /|      /|
  //  v1------v0|
  //  | |     | |
  //  | |v7---|-|v4
  //  |/      |/
  //  v2------v3
  // Coordinates
  // prettier-ignore
  var vertices = new Float32Array([
     1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0, // v0-v1-v2-v3 front
     1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0, // v0-v3-v4-v5 right
     1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0, // v0-v5-v6-v1 up
    -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0, // v1-v6-v7-v2 left
    -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0, // v7-v4-v3-v2 down
     1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0  // v4-v7-v6-v5 back
  ]);

  // Colors
  // prettier-ignore
  var colors = new Float32Array([
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v1-v2-v3 front
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v3-v4-v5 right
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v5-v6-v1 up
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v1-v6-v7-v2 left
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v7-v4-v3-v2 down
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0　    // v4-v7-v6-v5 back
         ]);

  // Normal
  // prettier-ignore
  var normals = new Float32Array([
    0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
    1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
    0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
   -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
    0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,  // v7-v4-v3-v2 down
    0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0   // v4-v7-v6-v5 back
  ]);

  // Indices of the vertices
  // prettier-ignore
  var indices = new Uint8Array([
     0, 1, 2,   0, 2, 3,    // front
     4, 5, 6,   4, 6, 7,    // right
     8, 9,10,   8,10,11,    // up
    12,13,14,  12,14,15,    // left
    16,17,18,  16,18,19,    // down
    20,21,22,  20,22,23     // back
 ]);

  // Write the vertex property to buffers (coordinates, colors)
  if (!initArrayBuffer(gl, vertices, 3, gl.FLOAT, "a_Position")) return -1;
  if (!initArrayBuffer(gl, colors, 3, gl.FLOAT, "a_Color")) return -1;
  // TODO: Write data to normal buffer
  if (!initArrayBuffer(gl, normals, 3, gl.FLOAT, "a_Normal")) return -1;

  // Write the indices to the buffer object
  var indexBuffer = gl.createBuffer();
  if (!indexBuffer) {
    console.log("Failed to create the buffer object");
    return false;
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