/**
 * HelloTriangle_FragCoord.js (c) 2012 matsuda
 */

// Vertex shader program
const VSHADER_SOURCE =
  "attribute vec4 a_Position;\n" +
  "void main() {\n" +
  "  gl_Position = a_Position;\n" +
  "}\n";

// Fragment shader program
const FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'uniform float u_Width;\n' +
  'uniform float u_Height;\n' +
  'void main() {\n' +
  ' gl_FragColor = vec4(gl_FragCoord.x/u_Width, 0.0, gl_FragCoord.y/u_Height, 1.0); \n' +
  '}\n';

/**
 * Renders a triangle using WebGL.
 */
function main() {
  const canvas = document.getElementById("webgl");
  const gl = getWebGLContext(canvas);
  if (!gl) return console.log("Failed to get the rendering context for WebGL");

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) return console.log("Failed to initialize shaders.");

  const n = initVertexBuffers(gl);
  if (n < 0) return console.log("Failed to set the positions of the vertices");

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, n);
}

/**
 * Initializes the vertex buffers.
 * 
 * @param {WebGLRenderingContext} gl The WebGL rendering context.
 * @returns {number} The number of vertices.
 */
function initVertexBuffers(gl) {
  const vertices = new Float32Array([0, 0.5, -0.5, -0.5, 0.5, -0.5]);
  const n = 3;

  const vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log("Failed to create the buffer object");
    return -1;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    console.log("Failed to get the storage location of a_Position");
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  const u_Width = gl.getUniformLocation(gl.program, 'u_Width');
  const u_Height = gl.getUniformLocation(gl.program, 'u_Height');
  gl.uniform1f(u_Width, gl.canvas.width);
  gl.uniform1f(u_Height, gl.canvas.height);

  gl.enableVertexAttribArray(a_Position);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return n;
}
