// OrthoView_halfWidth.js (c) 2012 matsuda
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
  // TODO: Retrieve the nearFar element (Check html)

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

  // TODO: get the storage location of u_ProjMatrix

  // TODO: Create the matrix to set the eye point, and the line of sight

  // TODO: Register the event handler to be called on key press

  // TODO: complete the parameters for draw
  // draw(gl, n, ..., ..., ...);   // Draw
}

function initVertexBuffers(gl) {
  // TODO: Prepare linearized coordinates and colors to display 3 triangles
  var verticesColors = new Float32Array([]);
  var n = 9;

  // Create a buffer object
  var vertexColorbuffer = gl.createBuffer();
  if (!vertexColorbuffer) {
    console.log("Failed to create the buffer object");
    return -1;
  }

  // Write the vertex coordinates and color to the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorbuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

  var FSIZE = verticesColors.BYTES_PER_ELEMENT;
  // Assign the buffer object to a_Position and enable the assignment
  var a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    console.log("Failed to get the storage location of a_Position");
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
  gl.enableVertexAttribArray(a_Position);
  // Assign the buffer object to a_Color and enable the assignment
  var a_Color = gl.getAttribLocation(gl.program, "a_Color");
  if (a_Color < 0) {
    console.log("Failed to get the storage location of a_Color");
    return -1;
  }
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
  gl.enableVertexAttribArray(a_Color);

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return n;
}

// The distances to the near and far clipping plane (hundredfold of the real value)
var g_near = 0.0,
  g_far = 0.5;
// TODO: Define transformations from keys
// The right arrow key was pressed: keyCode = 39
// The left arrow key was pressed: keyCode = 37
// The up arrow key was pressed: keyCode = 38
// The down arrow key was pressed: keyCode = 40
// TODO: Fix the method signature
function keydown(ev, gl, n, u, v, p) {}

// TODO: Fix the method signature
function draw(gl, n, u, v, p) {
  // TODO: Specify the viewing volume

  // TODO: Pass the projection matrix to u_ProjMatrix

  gl.clear(gl.COLOR_BUFFER_BIT); // Clear <canvas>

  // TODO: Display the current near and far values

  gl.drawArrays(gl.TRIANGLES, 0, n); // Draw the triangles
}
