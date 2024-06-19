/**
 * Vertex shader program
 * @constant
 * @type {string}
 */
const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  void main() {
    gl_Position = a_Position;
  }
`;

/**
 * Fragment shader program
 * @constant
 * @type {string}
 */
const FSHADER_SOURCE = `
  void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  }
`;

/**
 * Main function to initialize WebGL context and shaders, and to draw the triangle.
 */
function main() {
  /** @type {HTMLCanvasElement} */
  const canvas = document.getElementById("webgl");

  /** @type {WebGLRenderingContext} */
  const gl = getWebGLContext(canvas);
  if (!gl) {
    console.error("Failed to get the rendering context for WebGL");
    return;
  }

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.error("Failed to initialize shaders.");
    return;
  }

  const n = initVertexBuffers(gl);
  if (n < 0) {
    console.error("Failed to set the positions of the vertices");
    return;
  }

  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, n);
}

/**
 * Initializes the vertex buffer.
 * 
 * @param {WebGLRenderingContext} gl - The WebGL rendering context.
 * @returns {number} The number of vertices.
 */
function initVertexBuffers(gl) {
  const vertices = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);
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
