// TexturedQuad_Clamp_Mirror.js (c) 2012 matsuda
// Vertex shader program
// TODO: Prepare shader to receive texture coordinates
var VSHADER_SOURCE =
  "attribute vec4 a_Position;\n" +
  "void main() {\n" +
  "  gl_Position = a_Position;\n" +
  "}\n";

// Fragment shader program
// TODO: Prepare shader to receive sampling values and texture information
var FSHADER_SOURCE =
  "#ifdef GL_ES\n" +
  "precision mediump float;\n" +
  "#endif\n" +
  "void main() {\n" +
  "  vec4 color0 = vec4(1.0, 0.0, 0.0, 1.0);\n" +
  "  vec4 color1 = vec4(0.0, 1.0, 0.0, 1.0);\n" +
  "  gl_FragColor = color0 * color1;\n" +
  "}\n";

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

  // Set the vertex information
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log("Failed to set the vertex information");
    return;
  }

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // TODO: Initialize textures
}

function initVertexBuffers(gl) {
  // TODO: Setup vertex and texture coordinates

  var n = 4; // The number of vertices

  // TODO: Create a buffer object

  // TODO: Write the positions of vertices to a vertex shader

  var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;
  var a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    console.log("Failed to get the storage location of a_Position");
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
  gl.enableVertexAttribArray(a_Position);

  // TODO: Get the storage location of a_TexCoord

  // TODO: Pass information for textures

  // TODO: Enable the generic vertex attribute array

  // TODO: Unbind the buffer object

  return n;
}

function initTextures(gl, n) {
  // TODO: Create a texture object

  // TODO: Get the storage location of u_Sampler0 and u_Sampler1

  // TODO: Create the image object

  // TODO: Register the event handler to be called when image loading is completed

  // TODO: Tell the browser to load an Image

  return true;
}

function loadTexture(gl, n, texture, u_Sampler, image) {
  // TODO: Create function to load texture from files
}
