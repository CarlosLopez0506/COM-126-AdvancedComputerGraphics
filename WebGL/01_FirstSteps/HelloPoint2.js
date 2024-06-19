// HelloPoint2.js (c) 2012 matsuda
// TODO: Vertex shader program
var VSHADER_SRC =
  "attribute vec4 a_Pos;\n" +
  "void main(){\n" +
  " gl_Position = a_Pos;\n" +
  " gl_PointSize = 10.0;\n" +
  "}\n"

// TODO: Fragment shader program
var FSHADER_SRC =
  "void main() {\n" +
  " gl_FragColor = vec4(1.0,0.0,0.0,1.0);\n" +
  "}\n";

/**
 * Main function to set up WebGL rendering context, initialize shaders, 
 * set vertex position, clear canvas, and draw a point.
 *
 * @return {void} No return value
 */
function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById("webgl");

  // TODO: Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log("Failed to load the WebGL context");
    return;
  }

  // TODO: Initialize shaders
  if (!initShaders(gl, VSHADER_SRC, FSHADER_SRC)) {
    console.log("Failed to initialize shaders.");
    return;
  }

  // TODO: Get the storage location of a_Position
  var local_a_Pos = gl.getAttribLocation(gl.program, "a_Pos");
  if (local_a_Pos < 0) {
    console.log("Failed to get the a_Pos attribute");
    return;
  }
  // TODO: Pass vertex position to attribute variable
  gl.vertexAttrib3f(local_a_Pos, 0.0, -0.5, 1.0);

  // TODO: Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // TODO: Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
  // TODO: Draw
  gl.drawArrays(gl.POINTS, 0, 1);
} 
