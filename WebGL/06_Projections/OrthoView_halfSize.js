// LookAtTriangles.js (c) 2012 matsuda
// Vertex shader program
// TODO: Prepare shader to deal with projection matrices
var VSHADER_SOURCE =
  `
attribute vec4 a_Position;
attribute vec4 a_Color;

varying vec4 v_Color;

uniform mat4 u_ViewModelMatrix;

void main(){
  gl_Position = u_ViewModelMatrix * a_Position;
  v_Color = a_Color;
}
`

// Fragment shader program
var FSHADER_SOURCE =
  `
#ifdef GL_ES
precision mediump float;
#endif

varying vec4 v_Color;

void main(){
  gl_FragColor = v_Color;
}
`

let px = 0.25;
let py = 0.25;
let pz = 0.25
let step = 0.1;

let g_near = 0.0;
let g_far = 0.5;

function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById("webgl");
  var nf = document.getElementById("nearFar")

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

  // Set the vertex coordinates and color (the blue triangle is in the front)
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log("Failed to set the vertex information");
    return;
  }

  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);

  // TODO: Get the storage location of u_ViewMatrix
  const u_ViewModelMatrix = gl.getUniformLocation(gl.program, "u_ViewModelMatrix");
  if (u_ViewModelMatrix < 0) {
    console.error("Failed to the the storage location of u_ViewModelMatrix");
    return -1;
  }

  // TODO: Set the matrix to be used for to set the camera view
  let viewMatrix = new Matrix4();
  viewMatrix.setLookAt(px, py, pz, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

  let modelMatrix = new Matrix4();
  modelMatrix.setRotate(90, 0, 1, 0);

  let modelViewMatrix = viewMatrix.multiply(modelMatrix)

  // TODO: Set the view matrix in shader
  gl.uniformMatrix4fv(u_ViewModelMatrix, false, modelViewMatrix.elements);
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw the rectangle
  gl.drawArrays(gl.TRIANGLES, 0, n);


  window.onkeydown = (evt) => {
    if (evt.keyCode === 85) { //u
      g_far += step;
    }
    if (evt.keyCode === 73) { //i
      g_far -= step;
    }

    if (evt.keyCode === 79) { //u
      g_near += step;
    }
    if (evt.keyCode === 80) { //iw
      g_near -= step;
    }

    // TODO: Set the matrix to be used for to set the camera view
    modelViewMatrix.setOrtho(-0.3, 0.3, -1.0, 1.0, g_near, g_far);

    // TODO: Set the view matrix in shader
    gl.uniformMatrix4fv(u_ViewModelMatrix, false, modelViewMatrix.elements);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
    nf.innerHTML = `near: ${Math.round(g_near * 100) / 100}\tfar: ${Math.round(g_far * 100) / 100}`

    // Draw the rectangle
    gl.drawArrays(gl.TRIANGLES, 0, n);



  }
}



function initVertexBuffers(gl) {
  // TODO: Prepare linearized coordinates and colors to display 3 triangles
  var verticesColors = new Float32Array([
    //XYZ, RGB
    0.0, 0.5, -0.4, 1.0, 0.0, 0.0,
    -0.5, -0.5, -0.4, 0.0, 1.0, 0.0,
    0.5, -0.5, -0.4, 0.0, 0.0, 1.0,

    0.5, 0.5, -0.2, 0.0, 1.0, 1.0,
    -0.5, 0.5, -0.2, 1.0, 0.0, 1.0,
    0.0, -0.5, -0.2, 1.0, 1.0, 0.0,

    0.0, 0.5, 0.0, 1.0, 1.0, 1.0,
    -0.5, -0.5, 0.0, 1.0, 0.0, 1.0,
    0.5, -0.5, 0.0, 0.0, 0.0, 0.0,
  ]);
  var n = 9;

  // Create a buffer object
  var vertexColorbuffer = gl.createBuffer();
  if (!vertexColorbuffer) {
    console.log("Failed to create the buffer object");
    return -1;
  }

  // Write the vertex coordinates and color to the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorbuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

  var FSIZE = verticesColors.BYTES_PER_ELEMENT;
  // Assign the buffer object to a_Position and enable the assignment
  var a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    console.log("Failed to get the storage location of a_Position");
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
  gl.enableVertexAttribArray(a_Position);

  // Assign the buffer object to a_Color and enable the assignment
  var a_Color = gl.getAttribLocation(gl.program, "a_Color");
  if (a_Color < 0) {
    console.log("Failed to get the storage location of a_Color");
    return -1;
  }
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
  gl.enableVertexAttribArray(a_Color);

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return n;
}