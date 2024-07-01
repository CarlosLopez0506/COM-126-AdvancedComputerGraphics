/**
 * Vertex shader program
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
 * Initializes WebGL, shaders, and sets up the scene.
 */
function main() {
  const canvas = document.getElementById("webgl");
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
    console.error("Failed to specify the vertex information");
    return;
  }

  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  const u_ViewMatrix = gl.getUniformLocation(gl.program, "u_ViewMatrix");
  const u_ProjMatrix = gl.getUniformLocation(gl.program, "u_ProjMatrix");

  if (!u_ViewMatrix || !u_ProjMatrix) {
    console.error("Failed to get the storage location of u_ViewMatrix or u_ProjMatrix");
    return;
  }

  const viewMatrix = new Matrix4();
  document.onkeydown = (ev) => keydown(ev, gl, n, u_ViewMatrix, viewMatrix);

  const projMatrix = new Matrix4();
  projMatrix.setOrtho(-1.0, 1.0, -1.0, 1.0, 0.0, 6.0);
  gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

  draw(gl, n, u_ViewMatrix, viewMatrix);
}

/**
 * Initializes the vertex buffer with coordinates and colors.
 * @param {WebGLRenderingContext} gl 
 * @returns {number} Number of vertices
 */
function initVertexBuffers(gl) {
  const verticesColors = new Float32Array([
    // Vertex coordinates and color
    0.0,  0.5,  -0.4,  0.4, 1.0, 0.4,
   -0.5, -0.5,  -0.4,  0.4, 1.0, 0.4,
    0.5, -0.5,  -0.4,  1.0, 0.4, 0.4, 

    0.5,  0.4,  -0.2,  1.0, 0.4, 0.4,
   -0.5,  0.4,  -0.2,  1.0, 1.0, 0.4,
    0.0, -0.6,  -0.2,  1.0, 1.0, 0.4,

    0.0,  0.5,   0.0,  0.4, 0.4, 1.0,
   -0.5, -0.5,   0.0,  0.4, 0.4, 1.0,
    0.5, -0.5,   0.0,  1.0, 0.4, 0.4
  ]);
  const n = 9;

  const vertexColorbuffer = gl.createBuffer();
  if (!vertexColorbuffer) {
    console.error("Failed to create the buffer object");
    return -1;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorbuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

  const FSIZE = verticesColors.BYTES_PER_ELEMENT;

  const a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    console.error("Failed to get the storage location of a_Position");
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
  gl.enableVertexAttribArray(a_Position);

  const a_Color = gl.getAttribLocation(gl.program, "a_Color");
  if (a_Color < 0) {
    console.error("Failed to get the storage location of a_Color");
    return -1;
  }
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
  gl.enableVertexAttribArray(a_Color);

  return n;
}

let g_EyeX = 0.2;
let g_EyeY = 0.25;
let g_EyeZ = 0.25;

/**
 * Handles keydown events to adjust the view based on arrow key inputs.
 * @param {KeyboardEvent} ev 
 * @param {WebGLRenderingContext} gl 
 * @param {number} n 
 * @param {WebGLUniformLocation} u_ViewMatrix 
 * @param {Matrix4} viewMatrix 
 */
function keydown(ev, gl, n, u_ViewMatrix, viewMatrix) {
  switch (ev.keyCode) {
    case 39: // Right arrow key
      g_EyeX += 0.03;
      break;
    case 37: // Left arrow key
      g_EyeX -= 0.03;
      break;
    case 38: // Up arrow key
      g_EyeY += 0.03;
      break;
    case 40: // Down arrow key
      g_EyeY -= 0.03;
      break;
    default:
      return;
  }
  draw(gl, n, u_ViewMatrix, viewMatrix);
}

/**
 * Draws the scene.
 * @param {WebGLRenderingContext} gl 
 * @param {number} n 
 * @param {WebGLUniformLocation} u_ViewMatrix 
 * @param {Matrix4} viewMatrix 
 */
function draw(gl, n, u_ViewMatrix, viewMatrix) {
  viewMatrix.setLookAt(g_EyeX, g_EyeY, g_EyeZ, 0, 0, 0, 0, 1, 0);
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, n);
}
