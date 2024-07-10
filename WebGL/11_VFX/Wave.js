// Wave.js
// Vertex shader program
// TODO: Adjust the shader to change the position based on time
var VSHADER_SOURCE =
  "uniform mat4 u_perspectiveMatrix;\n" +
  "uniform mat4 u_modelMatrix;\n" +
  "uniform mat4 u_viewMatrix;\n" +
  "attribute vec4 a_Position;\n" +
  "varying vec4 v_Color;\n" +
  "void main() {\n" +
  "  mat4 modelViewMatrix = u_viewMatrix * u_modelMatrix;\n" +
  "  gl_Position = u_perspectiveMatrix * modelViewMatrix * a_Position;\n" +
  "  float c = (y+1.0) * 0.5 * 0.8+0.2;\n" +
  "  v_Color = vec4(c, c, c, 1.0);\n" +
  "}\n";

// Fragment shader program
var FSHADER_SOURCE =
  "#ifdef GL_ES\n" +
  "precision mediump float;\n" +
  "#endif\n" +
  "varying vec4 v_Color;\n" +
  "void main() {\n" +
  "  gl_FragColor = v_Color;\n" +
  "}\n";

var g_perspMatrix = new Matrix4();
var g_modelMatrix = new Matrix4();
var g_viewMatrix = new Matrix4();

var g_vertexPositionBuffer;
var g_vertexIndexBuffer;
var g_vertexIndexNum;

function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById("example");

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

  // Transformation matrices
  var u_perspMatrix = gl.getUniformLocation(gl.program, "u_perspectiveMatrix");
  var u_modelMatrix = gl.getUniformLocation(gl.program, "u_modelMatrix");
  var u_viewMatrix = gl.getUniformLocation(gl.program, "u_viewMatrix");
  if (!u_perspMatrix || !u_modelMatrix || !u_viewMatrix) {
    console.log("Failed to get the storage location");
    return;
  }

  // TODO: Pass the uniform variable that represent time for the shader

  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0, 0, 0, 1);

  if (!initVertexBuffers(gl)) {
    console.log("Failed to set the vertex information");
    return;
  }

  var time = 0;

  var tick = function () {
    // TODO: Update time for the shader

    drawCommon(gl, canvas, u_perspMatrix, u_viewMatrix);
    drawGrid(gl, u_modelMatrix);
    requestAnimationFrame(tick);
  };
  tick();
}

function drawCommon(gl, canvas, u_perspMatrix, u_viewMatrix) {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear <canvas>
  g_perspMatrix.setPerspective(30, canvas.width / canvas.height, 1, 10000);
  g_viewMatrix.setLookAt(0, 3, 5, 0, 0, 0, 0, 1, 0); // eyePos - focusPos - upVector

  gl.uniformMatrix4fv(u_perspMatrix, false, g_perspMatrix.elements);
  gl.uniformMatrix4fv(u_viewMatrix, false, g_viewMatrix.elements);
}

function drawGrid(gl, u_modelMatrix) {
  if (!updateArrayBuffer(gl, g_PositionBuffer, 3, gl.FLOAT, "a_Position")) {
    console.log("Failed to update a_Position attributes");
    return;
  }

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, g_IndexBuffer);

  g_modelMatrix.setTranslate(0, 0, 0);
  g_modelMatrix.rotate(0, 0, 1, 0);
  g_modelMatrix.scale(1.0, 1.0, 1.0);

  gl.uniformMatrix4fv(u_modelMatrix, false, g_modelMatrix.elements);
  gl.drawElements(gl.TRIANGLES, g_vertexIndexNum, gl.UNSIGNED_SHORT, 0);
}

function sendGridVertexBuffers(gl) {
  var positionData = [];
  var indexData = [];

  var xnum = 200;
  var znum = 200;
  var width = 5;
  var height = 5;

  for (var z = 0; z < znum; z++) {
    for (var x = 0; x < xnum; x++) {
      positionData.push(((x - xnum / 2) * width) / xnum);
      positionData.push(0);
      positionData.push(((z - znum / 2) * height) / znum);
    }
  }
  for (var z = 0; z < znum - 1; z++) {
    for (var x = 0; x < xnum - 1; x++) {
      indexData.push(z * xnum + x + 0);
      indexData.push(z * xnum + x + 1);
      indexData.push(z * xnum + x + xnum + 0);

      indexData.push(z * xnum + x + 1);
      indexData.push(z * xnum + x + xnum + 0);
      indexData.push(z * xnum + x + xnum + 1);
    }
  }

  g_PositionBuffer = initArrayBuffer(gl, new Float32Array(positionData));
  if (!g_PositionBuffer) return false;

  g_IndexBuffer = gl.createBuffer();
  if (!g_IndexBuffer) {
    console.log("Failed to create the buffer object");
    return false;
  }
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, g_IndexBuffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indexData),
    gl.STATIC_DRAW
  );
  g_vertexIndexNum = indexData.length;
  return true;
}

function initArrayBuffer(gl, data) {
  // Create a buffer object
  var buffer = gl.createBuffer();
  if (!buffer) {
    console.log("Failed to create the buffer object");
    return 0;
  }
  // Write date into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  return buffer;
}

function updateArrayBuffer(gl, buffer, num, type, attribute) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  var a_attribute = gl.getAttribLocation(gl.program, attribute);
  if (a_attribute < 0) {
    console.log("Failed to update the storage location of " + attribute);
    return false;
  }
  gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
  // Enable the assignment of the buffer object to the attribute variable
  gl.enableVertexAttribArray(a_attribute);

  //gl.bindBuffer(gl.ARRAY_BUFFER, null);
  return true;
}
