/**
 * @fileoverview LightedCube_ambient - Renders a lighted cube with ambient lighting using WebGL
 * @author matsuda (original), [Carlos Lopez] (refactored)
 */

/**
 * Vertex shader program source
 * @type {string}
 */
const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  attribute vec4 a_Normal;
  uniform mat4 u_MvpMatrix;
  uniform vec3 u_DiffuseLight;
  uniform vec3 u_LightDirection;
  uniform vec3 u_AmbientLight;
  varying vec4 v_Color;
  void main() {
    gl_Position = u_MvpMatrix * a_Position;
    vec3 normal = normalize(a_Normal.xyz);
    float nDotL = max(dot(u_LightDirection, normal), 0.0);
    vec3 diffuse = u_DiffuseLight * a_Color.rgb * nDotL;
    vec3 ambient = u_AmbientLight * a_Color.rgb;
    v_Color = vec4(diffuse + ambient, a_Color.a);
  }`;

/**
 * Fragment shader program source
 * @type {string}
 */
const FSHADER_SOURCE = `
  #ifdef GL_ES
  precision mediump float;
  #endif
  varying vec4 v_Color;
  void main() {
    gl_FragColor = v_Color;
  }`;

/**
 * Main function to set up and render the WebGL scene
 */
function main() {
  const canvas = document.getElementById('webgl');
  const gl = getWebGLContext(canvas);

  if (!gl) {
    console.error('Failed to get the rendering context for WebGL');
    return;
  }

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.error('Failed to initialize shaders.');
    return;
  }

  const n = initVertexBuffers(gl);
  if (n < 0) {
    console.error('Failed to set the vertex information');
    return;
  }

  setupGLState(gl);
  const uniformLocations = getUniformLocations(gl);
  if (!uniformLocations) return;

  setLightingParameters(gl, uniformLocations);
  setViewProjection(gl, uniformLocations, canvas);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}

/**
 * Sets up the initial WebGL state
 * @param {WebGLRenderingContext} gl - The WebGL context
 */
function setupGLState(gl) {
  gl.clearColor(0, 0, 0, 1);
  gl.enable(gl.DEPTH_TEST);
}

/**
 * Retrieves uniform locations from the WebGL program
 * @param {WebGLRenderingContext} gl - The WebGL context
 * @returns {Object|null} An object containing uniform locations or null if retrieval fails
 */
function getUniformLocations(gl) {
  const uniformNames = ['u_MvpMatrix', 'u_DiffuseLight', 'u_LightDirection', 'u_AmbientLight'];
  const locations = {};

  for (const name of uniformNames) {
    locations[name] = gl.getUniformLocation(gl.program, name);
    if (!locations[name]) {
      console.error(`Failed to get the storage location of ${name}`);
      return null;
    }
  }

  return locations;
}

/**
 * Sets lighting parameters for the scene
 * @param {WebGLRenderingContext} gl - The WebGL context
 * @param {Object} uniformLocations - Object containing uniform locations
 */
function setLightingParameters(gl, uniformLocations) {
  gl.uniform3f(uniformLocations.u_DiffuseLight, 1.0, 1.0, 1.0);
  
  const lightDirection = new Vector3([0.5, 3.0, 4.0]);
  lightDirection.normalize();
  gl.uniform3fv(uniformLocations.u_LightDirection, lightDirection.elements);
  
  gl.uniform3f(uniformLocations.u_AmbientLight, 0.2, 0.2, 0.2);
}

/**
 * Sets up the view projection matrix
 * @param {WebGLRenderingContext} gl - The WebGL context
 * @param {Object} uniformLocations - Object containing uniform locations
 * @param {HTMLCanvasElement} canvas - The canvas element
 */
function setViewProjection(gl, uniformLocations, canvas) {
  const mvpMatrix = new Matrix4();
  mvpMatrix.setPerspective(30, canvas.width / canvas.height, 1, 100);
  mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);
  gl.uniformMatrix4fv(uniformLocations.u_MvpMatrix, false, mvpMatrix.elements);
}

/**
 * Initializes vertex buffers for the cube
 * @param {WebGLRenderingContext} gl - The WebGL context
 * @returns {number} The number of indices or -1 if initialization fails
 */
function initVertexBuffers(gl) {
  const vertices = new Float32Array([
    1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,
    1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,
    1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,
   -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,
   -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,
    1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0
  ]);

  const colors = new Float32Array([
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0
  ]);

  const normals = new Float32Array([
    0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,
    1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,
    0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,
   -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,
    0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,
    0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0
  ]);

  const indices = new Uint8Array([
     0, 1, 2,   0, 2, 3,
     4, 5, 6,   4, 6, 7,
     8, 9,10,   8,10,11,
    12,13,14,  12,14,15,
    16,17,18,  16,18,19,
    20,21,22,  20,22,23
  ]);

  if (!initArrayBuffer(gl, 'a_Position', vertices, 3)) return -1;
  if (!initArrayBuffer(gl, 'a_Color', colors, 3)) return -1;
  if (!initArrayBuffer(gl, 'a_Normal', normals, 3)) return -1;

  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  const indexBuffer = gl.createBuffer();
  if (!indexBuffer) {
    console.error('Failed to create the buffer object');
    return -1;
  }
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return indices.length;
}

/**
 * Initializes an array buffer for a given attribute
 * @param {WebGLRenderingContext} gl - The WebGL context
 * @param {string} attribute - The attribute name
 * @param {Float32Array} data - The data to be stored in the buffer
 * @param {number} num - The number of components per vertex attribute
 * @returns {boolean} True if initialization succeeds, false otherwise
 */
function initArrayBuffer(gl, attribute, data, num) {
  const buffer = gl.createBuffer();
  if (!buffer) {
    console.error('Failed to create the buffer object');
    return false;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  const a_attribute = gl.getAttribLocation(gl.program, attribute);
  if (a_attribute < 0) {
    console.error('Failed to get the storage location of ' + attribute);
    return false;
  }

  gl.vertexAttribPointer(a_attribute, num, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_attribute);

  return true;
}

// Call main function to start the application
main();