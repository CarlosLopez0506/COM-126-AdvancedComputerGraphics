/**
 * Vertex shader program
 * @type {string}
 */
const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjMatrix;
  varying vec4 v_Color;
  void main() {
    gl_Position = u_ProjMatrix * u_ViewMatrix * a_Position;
    v_Color = a_Color;
  }
`;

/**
 * Fragment shader program
 * @type {string}
 */
const FSHADER_SOURCE = `
  #ifdef GL_ES
  precision mediump float;
  #endif
  varying vec4 v_Color;
  void main() {
    gl_FragColor = v_Color;
  }
`;

/**
 * The main entry point for the application
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

  /** @type {number} */
  const n = initVertexBuffers(gl);
  if (n < 0) {
    console.error("Failed to set the vertex information");
    return;
  }

  gl.clearColor(0, 0, 0, 1);

  /** @type {WebGLUniformLocation} */
  const u_ViewMatrix = gl.getUniformLocation(gl.program, "u_ViewMatrix");
  /** @type {WebGLUniformLocation} */
  const u_ProjMatrix = gl.getUniformLocation(gl.program, "u_ProjMatrix");

  if (!u_ViewMatrix || !u_ProjMatrix) {
    console.error("Failed to get the storage location of u_ViewMatrix or u_ProjMatrix");
    return;
  }

  /** @type {Matrix4} */
  const viewMatrix = new Matrix4();
  /** @type {Matrix4} */
  const projMatrix = new Matrix4();

  viewMatrix.setLookAt(0, 0, 5, 0, 0, -100, 0, 1, 0);
  projMatrix.setPerspective(30, canvas.width / canvas.clientHeight, 1, 100);

  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
  gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, n);
}

/**
 * Initializes the vertex buffers
 * @param {WebGLRenderingContext} gl The WebGL rendering context
 * @returns {number} The number of vertices
 */
function initVertexBuffers(gl) {
  /** @type {Float32Array} */
  const verticesColors = new Float32Array([
    // Three triangles on the right side
    0.75, 1.0, -4.0, 0.4, 1.0, 0.4, // The green triangle in back
    0.25, -1.0, -4.0, 0.4, 1.0, 0.4,
    1.25, -1.0, -4.0, 1.0, 0.4, 0.4,

    0.75, 1.0, -2.0, 1.0, 1.0, 0.4, // The yellow triangle in middle
    0.25, -1.0, -2.0, 1.0, 1.0, 0.4,
    1.25, -1.0, -2.0, 1.0, 0.4, 0.4,

    0.75, 1.0, 0.0, 0.4, 0.4, 1.0, // The blue triangle in front
    0.25, -1.0, 0.0, 0.4, 0.4, 1.0,
    1.25, -1.0, 0.0, 1.0, 0.4, 0.4,

    // Three triangles on the left side
    -0.75, 1.0, -4.0, 0.4, 1.0, 0.4, // The green triangle in back
    -1.25, -1.0, -4.0, 0.4, 1.0, 0.4,
    -0.25, -1.0, -4.0, 1.0, 0.4, 0.4,

    -0.75, 1.0, -2.0, 1.0, 1.0, 0.4, // The yellow triangle in middle
    -1.25, -1.0, -2.0, 1.0, 1.0, 0.4,
    -0.25, -1.0, -2.0, 1.0, 0.4, 0.4,

    -0.75, 1.0, 0.0, 0.4, 0.4, 1.0, // The blue triangle in front
    -1.25, -1.0, 0.0, 0.4, 0.4, 1.0,
    -0.25, -1.0, 0.0, 1.0, 0.4, 0.4,
  ]);
  const n = 18; // Three vertices per triangle * 6

  /** @type {WebGLBuffer} */
  const vertexColorbuffer = gl.createBuffer();
  if (!vertexColorbuffer) {
    console.error("Failed to create the buffer object");
    return -1;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorbuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

  const FSIZE = verticesColors.BYTES_PER_ELEMENT;

  /** @type {number} */
  const a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    console.error("Failed to get the storage location of a_Position");
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
  gl.enableVertexAttribArray(a_Position);

  /** @type {number} */
  const a_Color = gl.getAttribLocation(gl.program, "a_Color");
  if (a_Color < 0) {
    console.error("Failed to get the storage location of a_Color");
    return -1;
  }
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
  gl.enableVertexAttribArray(a_Color);

  return n;
}
