// LookAtTrianglesWithKeys.js
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'uniform mat4 u_ViewMatrix;\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_Position = u_ViewMatrix * a_Position;\n' +
  '  v_Color = a_Color;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_FragColor = v_Color;\n' +
  '}\n';

function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to initialize shaders.');
    return;
  }

  // Set the vertex information
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  // Get the storage location of the u_ViewMatrix variable
  var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }

  // Create Matrix4 object for a view matrix
  var viewMatrix = new Matrix4();

  // Register the event handler to be called on key press
  document.onkeydown = function(ev) { keydown(ev, gl, n, u_ViewMatrix, viewMatrix); };

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  draw(gl, n, u_ViewMatrix, viewMatrix); // Draw a triangle
}

function initVertexBuffers(gl) {
  var verticesColors = new Float32Array([
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
  var n = 9; // The number of vertices

  // Create a buffer object
  var vertexColorBuffer = gl.createBuffer();
  if (!vertexColorBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  // Write data into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

  var FSIZE = verticesColors.BYTES_PER_ELEMENT;
  // Assign the buffer object to a_Position and enable the assignment
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
  gl.enableVertexAttribArray(a_Position);

  // Assign the buffer object to a_Color and enable the assignment
  var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if (a_Color < 0) {
    console.log('Failed to get the storage location of a_Color');
    return -1;
  }
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
  gl.enableVertexAttribArray(a_Color);

  return n;
}

var g_eyeX = 0.20, g_eyeY = 0.25, g_eyeZ = 0.25; // The eye point
function keydown(ev, gl, n, u_ViewMatrix, viewMatrix) {
  if (ev.keyCode == 39) { // The right arrow key was pressed
    g_eyeX += 0.03;
  } else if (ev.keyCode == 37) { // The left arrow key was pressed
    g_eyeX -= 0.03;
  }
  else if (ev.keyCode == 38) { // The up arrow key was pressed
    g_eyeY += 0.03;
  }
  else if (ev.keyCode == 40) { // The down arrow key was pressed
    g_eyeY -= 0.03;
  }
   else {
    return; // Prevent unnecessary drawing
  }
  draw(gl, n, u_ViewMatrix, viewMatrix);
}

function draw(gl, n, u_ViewMatrix, viewMatrix) {
  // Set the eye point and line of sight
  viewMatrix.setLookAt(g_eyeX, g_eyeY, g_eyeZ, 0, 0, 0, 0, 1, 0);

  // Pass the view matrix to the u_ViewMatrix variable
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

  gl.clear(gl.COLOR_BUFFER_BIT); // Clear <canvas>

  gl.drawArrays(gl.TRIANGLES, 0, n); // Draw a triangle
}
