// MultiAttributeColor.js (c) 2012 matsuda
// Vertex shader program
// TODO: Add information for color and size in vertex shader
var VSHADER_SOURCE =
  "attribute vec4 a_Position;\n" +
  "void main() {\n" +
  "  gl_Position = a_Position;\n" +
  "}\n";

// Fragment shader program
// TODO: Example of pre-processord directive
// TODO: Pass color information
var FSHADER_SOURCE =
  "void main() {\n" + "  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n" + "}\n";

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
    console.log("Failed to set the vertex information");
    return;
  }

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw three points
  gl.drawArrays(gl.POINTS, 0, n);
}

function initVertexBuffers(gl) {
  // TODO: Define vertex colors
  var n = 3; // The number of vertices

  // TODO: Create a buffer object

  // TODO: Bind the buffer object to target
  // Write the vertex coordinates and colors to the buffer object

  // TODO: Define size of vertex colors from data

  //Get the storage location of a_Position, assign and enable buffer
  var a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    console.log("Failed to get the storage location of a_Position");
    return -1;
  }
  // TODO: modify call to pass also the parameter for reserving space for color info
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position); // Enable the assignment of the buffer object

  // TODO: Get the storage location of a_Position, assign buffer and enable

  // TODO: pass information to shader

  return n;
}
