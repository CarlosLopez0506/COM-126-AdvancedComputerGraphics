// ScaledTriangle_Matrix.js (c) 2012 matsuda
// Vertex shader program
// TODO: Prepare the transformation matrix
var VSHADER_SOURCE =
  "attribute vec4 a_Position;\n" +
  "void main() {\n" +
  "  gl_Position = a_Position;\n" +
  "}\n";

// Fragment shader program
var FSHADER_SOURCE =
  "void main() {\n" + "  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n" + "}\n";

// The scaling factor
var Sx = 1.0,
  Sy = 1.5,
  Sz = 1.0;

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

  // Write the positions of vertices to a vertex shader
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log("Failed to set the positions of the vertices");
    return;
  }

  // TODO: Prepare the transformation matrix
  // Note: WebGL is column major order

  // TODO: Pass the rotation matrix to the vertex shader

  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // TODO: Draw the rectangle
}

function initVertexBuffers(gl) {
  var vertices = new Float32Array([0, 0.5, -0.5, -0.5, 0.5, -0.5]);
  var n = 3; // The number of vertices

  // TODO: Create a buffer object

  // TODO: Bind the buffer object to target

  // TODO: Write date into the buffer object

  var a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    console.log("Failed to get the storage location of a_Position");
    return -1;
  }
  // TODO: Assign the buffer object to a_Position variable

  // TODO: Enable the assignment to a_Position variable

  return n;
}
