// RotatedTriangle_Matrix.js (c) matsuda
// Vertex shader program
// TODO: Prepare the roation matrix
var VSHADER_SOURCE =
  "attribute vec4 a_Position;\n" +
  'uniform mat4 u_zRotMatrix;\n' +
  "void main() {\n" +
  "  gl_Position = u_zRotMatrix * a_Position;\n" +
  "}\n";

// Fragment shader program
var FSHADER_SOURCE =
  "void main() {\n" + "  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n" + "}\n";

// The rotation angle
var ANGLE = 90.0;

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

  // TODO: Create a rotation matrix
  var radian = Math.PI * ANGLE / 180.0; // Convert to radians
  var cosB = Math.cos(radian), sinB = Math.sin(radian);


  // Note: WebGL is column major order
  var xformMatrix = new Float32Array([
    cosB, sinB, 0.0, 0.0,
    -sinB, cosB, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0
  ]);

  // TODO: Pass the rotation matrix to the vertex shader
  var u_zRotMatrix = gl.getUniformLocation(gl.program, 'u_zRotMatrix');
  if (!u_zRotMatrix) {
    console.error('Failed to get the storage location of u_zRotMatrix');
    return;
  }
  gl.uniformMatrix4fv(u_zRotMatrix, false, xformMatrix);


  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // TODO: Draw the rectangle
  gl.drawArrays(gl.TRIANGLES, 0, n);
}

/**
 * Initializes the vertex buffer.
 * 
 * @param {WebGLRenderingContext} gl - The WebGL rendering context.
 * @returns {number} The number of vertices.
 */
function initVertexBuffers(gl) {
  const vertices = new Float32Array([0, 0.5, -0.5, -0.5, 0.5, -0.5]);
  const n = 3; // The number of vertices

  const vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.error("Failed to create buffer object");
    return -1;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    console.error("Failed to get the storage location of a_Position");
    return -1;
  }

  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  return n;
}