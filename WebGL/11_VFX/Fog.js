// Fog.js (c) 2012 matsuda and ohnishi
// Vertex shader program
// TODO: Use position information to pass fog info to fragment shader
// TODO: Consider the perspective of the camera
var VSHADER_SOURCE =
  "attribute vec4 a_Position;\n" +
  "attribute vec4 a_Color;\n" +
  "uniform mat4 u_MvpMatrix;\n" +
  "varying vec4 v_Color;\n" +
  "void main() {\n" +
  "  gl_Position = u_MvpMatrix * a_Position;\n" +
  "  v_Color = a_Color;\n" +
  "}\n";

// Fragment shader program
// TODO: Prepare shader to receive information on fog distance and color
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

  var n = initVertexBuffers(gl);
  if (n < 1) {
    console.log("Failed to set the vertex information");
    return;
  }

  // Color of Fog
  var fogColor = new Float32Array([0.137, 0.231, 0.423]);
  // Distance of fog [where fog starts, where fog completely covers object]
  var fogDist = new Float32Array([55, 80]);
  // Position of eye point (world coordinates)
  var eye = new Float32Array([25, 65, 35, 1.0]);

  // Get the storage locations of uniform variables
  var u_MvpMatrix = gl.getUniformLocation(gl.program, "u_MvpMatrix");
  if (!u_MvpMatrix) {
    console.log("Failed to get the storage location");
    return;
  }

  // TODO: Get storaga information for fog and eye

  // TODO: Pass fog color, distances, and eye point to uniform variable

  // TODO: Set clear color and enable hidden surface removal

  gl.enable(gl.DEPTH_TEST);

  // Pass the model matrix to u_ModelMatrix
  var modelMatrix = new Matrix4();
  modelMatrix.setScale(10, 10, 10);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  // Pass the model view projection matrix to u_MvpMatrix
  var mvpMatrix = new Matrix4();
  mvpMatrix.setPerspective(30, canvas.width / canvas.height, 1, 1000);
  mvpMatrix.lookAt(eye[0], eye[1], eye[2], 0, 2, 0, 0, 1, 0);
  mvpMatrix.multiply(modelMatrix);
  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
  document.onkeydown = function (ev) {
    keydown(ev, gl, n, u_FogDist, fogDist);
  };

  // Clear color and depth buffer
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  // Draw
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);

  var modelViewMatrix = new Matrix4();
  modelViewMatrix.setLookAt(eye[0], eye[1], eye[2], 0, 2, 0, 0, 1, 0);
  modelViewMatrix.multiply(modelMatrix);
  modelViewMatrix.multiplyVector4(new Vector4([1, 1, 1, 1]));
  mvpMatrix.multiplyVector4(new Vector4([1, 1, 1, 1]));
  modelViewMatrix.multiplyVector4(new Vector4([-1, 1, 1, 1]));
  mvpMatrix.multiplyVector4(new Vector4([-1, 1, 1, 1]));
}

function keydown(ev, gl, n, u_FogDist, fogDist) {
  switch (ev.keyCode) {
    case 38: // TODO: Up arrow key -> Increase the maximum distance of fog
      break;
    case 40: // TODO: Down arrow key -> Decrease the maximum distance of fog
      break;
    default:
      return;
  }
  // TODO: Pass the distance of fog
  // Clear color and depth buffer
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  // Draw
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
  // prettier-ignore
  var vertices = new Float32Array([   // Vertex coordinates
     1, 1, 1,  -1, 1, 1,  -1,-1, 1,   1,-1, 1,    // v0-v1-v2-v3 front
     1, 1, 1,   1,-1, 1,   1,-1,-1,   1, 1,-1,    // v0-v3-v4-v5 right
     1, 1, 1,   1, 1,-1,  -1, 1,-1,  -1, 1, 1,    // v0-v5-v6-v1 up
    -1, 1, 1,  -1, 1,-1,  -1,-1,-1,  -1,-1, 1,    // v1-v6-v7-v2 left
    -1,-1,-1,   1,-1,-1,   1,-1, 1,  -1,-1, 1,    // v7-v4-v3-v2 down
     1,-1,-1,  -1,-1,-1,  -1, 1,-1,   1, 1,-1     // v4-v7-v6-v5 back
  ]);
  // prettier-ignore
  var colors = new Float32Array([     // Colors
    0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  // v0-v1-v2-v3 front
    0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  // v0-v3-v4-v5 right
    1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  // v0-v5-v6-v1 up
    1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  // v1-v6-v7-v2 left
    1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  // v7-v4-v3-v2 down
    0.4, 1.0, 1.0,  0.4, 1.0, 1.0,  0.4, 1.0, 1.0,  0.4, 1.0, 1.0   // v4-v7-v6-v5 back
  ]);

  // prettier-ignore
  var indices = new Uint8Array([       // Indices of the vertices
     0, 1, 2,   0, 2, 3,    // front
     4, 5, 6,   4, 6, 7,    // right
     8, 9,10,   8,10,11,    // up
    12,13,14,  12,14,15,    // left
    16,17,18,  16,18,19,    // down
    20,21,22,  20,22,23     // back
  ]);

  // Create a buffer object
  var indexBuffer = gl.createBuffer();
  if (!indexBuffer) return -1;

  // Write the vertex property to buffers (coordinates and normals)
  if (!initArrayBuffer(gl, vertices, 3, gl.FLOAT, "a_Position")) return -1;
  if (!initArrayBuffer(gl, colors, 3, gl.FLOAT, "a_Color")) return -1;

  // Write the indices to the buffer object
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
  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return true;
}
