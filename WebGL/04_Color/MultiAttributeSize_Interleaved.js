/**
 * Vertex shader program source code.
 * @type {string}
 */
var VSHADER_SOURCE =
  "attribute vec4 a_Position;\n" +
  'attribute float a_PointSize;\n' +
  "void main() {\n" +
  "  gl_Position = a_Position;\n" +
  '  gl_PointSize = a_PointSize;\n' +
  "}\n";

/**
 * Fragment shader program source code.
 * @type {string}
 */
var FSHADER_SOURCE =
  "void main() {\n" + "  gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);\n" + "}\n";

/**
 * The main function initializes WebGL context, shaders, and draws points.
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
    console.log("Failed to set the positions of the vertices");
    return;
  }

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.POINTS, 0, n);
}

/**
 * Initializes the vertex buffers for the points.
 * @param {WebGLRenderingContext} gl - The WebGL rendering context.
 * @returns {number} The number of vertices.
 */
function initVertexBuffers(gl) {
  var verticesAndSizes = new Float32Array([0.0,0.5,10.0
    ,-0.5,-0.5,20.0
    ,0.5,-0.5,30.0]);
  var n = 3;

  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log("Failed to create the buffer object");
    return -1;
  }



  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesAndSizes, gl.STATIC_DRAW);

  var FSIZE = verticesAndSizes.BYTES_PER_ELEMENT;
  console.log(FSIZE);
  var a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    console.log("Failed to get the storage location of a_Position");
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false,  FSIZE * 3, 0);
  gl.enableVertexAttribArray(a_Position);


  var a_PointSize = gl.getAttribLocation(gl.program, "a_PointSize");
  if (a_PointSize < 0) {
    console.log("Failed to get the storage location of a_PointSize");
    return -1;
  }
  gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE * 3, FSIZE * 2);
  gl.enableVertexAttribArray(a_PointSize);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return n;
}
