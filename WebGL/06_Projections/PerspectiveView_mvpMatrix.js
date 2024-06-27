// PerspectiveView_mvpMatrix.js (c) 2012 matsuda
// Vertex shader program
// TODO: Prepare shader to deal with projection matrices
var VSHADER_SOURCE =
  "attribute vec4 a_Position;\n" +
  "attribute vec4 a_Color;\n" +
  "varying vec4 v_Color;\n" +
  "void main() {\n" +
  "  gl_Position = a_Position;\n" +
  "  v_Color = a_Color;\n" +
  "}\n";

// Fragment shader program
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

  // Set the vertex coordinates and color (the blue triangle is in the front)
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log("Failed to set the vertex information");
    return;
  }

  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);

  // TODO: Get the storage location of u_MvpMatrix

  // TODO: Create model, view, projection and combined matrices

  // TODO: Calculate the model, view and projection matrices

  // TODO: Calculate the model view projection matrix

  // TODO: Pass the model view projection matrix to u_MvpMatrix

  gl.clear(gl.COLOR_BUFFER_BIT); // Clear <canvas>

  gl.drawArrays(gl.TRIANGLES, 0, n); // Draw the triangles // TODO: Prepare the model matrix for another pair of triangles

  // TODO: Calculate the model view projection matrix

  // TODO: Pass the model view projection matrix to u_MvpMatrix

  gl.drawArrays(gl.TRIANGLES, 0, n); // Draw the triangles
}

function initVertexBuffers(gl) {
  // TODO: Prepare linearized coordinates and colors to display 3 triangles
  var verticesColors = new Float32Array([]);
  var n = 9;

  // Create a buffer object
  var vertexColorBuffer = gl.createBuffer();
  if (!vertexColorBuffer) {
    console.log("Failed to create the buffer object");
    return -1;
  }

  // Write the vertex information and enable it
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

  var FSIZE = verticesColors.BYTES_PER_ELEMENT;

  var a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    console.log("Failed to get the storage location of a_Position");
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
  gl.enableVertexAttribArray(a_Position);

  var a_Color = gl.getAttribLocation(gl.program, "a_Color");
  if (a_Color < 0) {
    console.log("Failed to get the storage location of a_Color");
    return -1;
  }
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
  gl.enableVertexAttribArray(a_Color);

  return n;
}