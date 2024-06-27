// Vertex shader program
const VSHADER_SOURCE = `
attribute vec4 a_Position; // Attribute variable for vertex positions
attribute vec2 a_TexCoord; // Attribute variable for texture coordinates

varying vec2 v_TexCoord; // Varying variable to pass texture coordinates to the fragment shader

void main() {
  gl_Position = a_Position; // Set the position of the vertex
  v_TexCoord = a_TexCoord; // Pass the texture coordinates to the fragment shader
}
`;

// Fragment shader program
const FSHADER_SOURCE = `
#ifdef GL_ES
precision mediump float;
#endif

// Uniform sampler for the texture
uniform sampler2D u_Sampler;

// Varying variable to hold the texture coordinates
varying vec2 v_TexCoord;

void main() {
  // Set the fragment color to the color from the texture
  gl_FragColor = texture2D(u_Sampler, v_TexCoord);
}
`;

/**
 * Main function to initialize and run WebGL rendering.
 */
function main() {
  var canvas = document.getElementById("webgl");
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log("Failed to get the rendering context for WebGL");
    return;
  }

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("Failed to initialize shaders.");
    return;
  }

  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log("Failed to set the vertex information");
    return;
  }

  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  if (!initTextures(gl, n)) {
    console.log("Failed to initialize textures");
    return;
  }
}

/**
 * Initializes the vertex buffers.
 * @param {WebGLRenderingContext} gl The WebGL rendering context.
 * @returns {number} The number of vertices.
 */
function initVertexBuffers(gl) {
  var verticesTexCoords = new Float32Array([
    // Vertex coordinates and texture coordinates
    -0.5, 0.5, 0.0, 2.0,   // Top-left corner
    -0.5, -0.5, 0.0, 0.0,  // Bottom-left corner
    0.5, 0.5, 2.0, 2.0,    // Top-right corner
    0.5, -0.5, 2.0, 0.0    // Bottom-right corner
  ]);

  var n = 4;

  var vertexTexCoordBuffer = gl.createBuffer();
  if (!vertexTexCoordBuffer) {
    console.log("Failed to create the buffer object");
    return -1;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

  var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;

  var a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    console.log("Failed to get the storage location of a_Position");
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
  gl.enableVertexAttribArray(a_Position);

  var a_TexCoord = gl.getAttribLocation(gl.program, "a_TexCoord");
  if (a_TexCoord < 0) {
    console.log("Failed to get the storage location of a_TexCoord");
    return -1;
  }
  gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
  gl.enableVertexAttribArray(a_TexCoord);

  return n;
}

/**
 * Initializes the texture.
 * @param {WebGLRenderingContext} gl The WebGL rendering context.
 * @param {number} n The number of vertices.
 * @returns {boolean} Whether the texture was successfully initialized.
 */
function initTextures(gl, n) {
  var texture = gl.createTexture();
  if (!texture) {
    console.log("Failed to create the texture object");
    return false;
  }

  var u_Sampler = gl.getUniformLocation(gl.program, "u_Sampler");
  if (!u_Sampler) {
    console.log("Failed to get the storage location of u_Sampler");
    return false;
  }

  var image = new Image();
  if (!image) {
    console.log("Failed to create the image object");
    return false;
  }

  image.onload = function () {
    loadTexture(gl, n, texture, u_Sampler, image);
  };

  image.src = "../resources/sky.jpg";

  return true;
}

/**
 * Loads the texture image.
 * @param {WebGLRenderingContext} gl The WebGL rendering context.
 * @param {number} n The number of vertices.
 * @param {WebGLTexture} texture The texture object.
 * @param {WebGLUniformLocation} u_Sampler The sampler location.
 * @param {HTMLImageElement} image The image object.
 */
function loadTexture(gl, n, texture, u_Sampler, image) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  gl.uniform1i(u_Sampler, 0);

  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}
