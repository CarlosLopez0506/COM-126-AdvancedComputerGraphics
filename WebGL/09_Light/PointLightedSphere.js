// PointLightedCube.js (c) 2012 matsuda and kanda
// Vertex shader program
// TODO: Prepare shader to receive light and normal information
// TODO: Calculate different aspects for light (ambient, diffuse)
var VSHADER_SOURCE =
  "attribute vec4 a_Position;\n" +
  "attribute vec4 a_Color;\n" +
  "uniform mat4 u_MvpMatrix;\n" +
  "varying vec4 v_Color;\n" +
  "void main() {\n" +
  "  gl_Position = u_MvpMatrix * a_Position ;\n" +
  "  v_Color = a_Color;\n" +
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

  // Set the vertex coordinates, the color and the normal
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log("Failed to set the vertex information");
    return;
  }

  // Set the clear color and enable the depth test
  gl.clearColor(0, 0, 0, 1);
  gl.enable(gl.DEPTH_TEST);

  // Get the storage locations of uniform variables and so on
  var u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
  var u_MvpMatrix = gl.getUniformLocation(gl.program, "u_MvpMatrix");
  if (!u_ModelMatrix || !u_AmbientLight) {
    console.log("Failed to get the storage location");
    return;
  }

  // TODO: get reference to light color and normal matrix from shader

  // TODO: Set the light color (white)

  // TODO: Set the light direction (in the world coordinate)

  // TODO: Set the ambient light

  var modelMatrix = new Matrix4(); // Model matrix
  var mvpMatrix = new Matrix4(); // Model view projection matrix
  // TODO: Transformation matrix for normals

  // Pass the model matrix to u_ModelMatrix
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  // Calculate the view projection matrix
  mvpMatrix.setPerspective(30, canvas.width / canvas.height, 1, 100);
  mvpMatrix.lookAt(0, 0, 6, 0, 0, 0, 0, 1, 0);
  mvpMatrix.multiply(modelMatrix);
  // Pass the model view projection matrix to u_MvpMatrix
  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

  // TODO: Calculate the matrix to transform the normal based on the model matrix

  // TODO: Pass the transformation matrix for normals to u_NormalMatrix

  // Clear color and depth buffer
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Draw the cube(Note that the 3rd argument is the gl.UNSIGNED_SHORT)
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0);
}

function initVertexBuffers(gl) {
  // Create a sphere
  var SPHERE_DIV = 13;

  var i, ai, si, ci;
  var j, aj, sj, cj;
  var p1, p2;

  var color = [1.0, 1.0, 1.0];
  var positions = [];
  var colors = [];
  var indices = [];

  // Generate coordinates
  for (j = 0; j <= SPHERE_DIV; j++) {
    aj = (j * Math.PI) / SPHERE_DIV;
    sj = Math.sin(aj);
    cj = Math.cos(aj);
    for (i = 0; i <= SPHERE_DIV; i++) {
      ai = (i * 2 * Math.PI) / SPHERE_DIV;
      si = Math.sin(ai);
      ci = Math.cos(ai);

      positions.push(si * sj); // X
      positions.push(cj); // Y
      positions.push(ci * sj); // Z

      colors.push(color[0]);
      colors.push(color[1]);
      colors.push(color[2]);
    }
  }

  // Generate indices
  for (j = 0; j < SPHERE_DIV; j++) {
    for (i = 0; i < SPHERE_DIV; i++) {
      p1 = j * (SPHERE_DIV + 1) + i;
      p2 = p1 + (SPHERE_DIV + 1);

      indices.push(p1);
      indices.push(p2);
      indices.push(p1 + 1);

      indices.push(p1 + 1);
      indices.push(p2);
      indices.push(p2 + 1);
    }
  }

  // Write the vertex property to buffers (coordinates and normals)
  // Same data can be used for vertex and normal
  // In order to make it intelligible, another buffer is prepared separately
  // prettier-ignore
  if (!initArrayBuffer(gl, new Float32Array(positions), 3, gl.FLOAT, "a_Position"))
    return -1;
  if (!initArrayBuffer(gl, new Float32Array(colors), 3, gl.FLOAT, "a_Color"))
    return -1;
  // prettier-ignore
  if (!initArrayBuffer(gl, new Float32Array(positions), 3, gl.FLOAT, "a_Normal"))
    return -1;

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // Write the indices to the buffer object
  var indexBuffer = gl.createBuffer();
  if (!indexBuffer) {
    console.log("Failed to create the buffer object");
    return -1;
  }
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices),
    gl.STATIC_DRAW
  );

  return indices.length;
}

function initArrayBuffer(gl, data, num, type, attribute) {
  // Create a buffer object
  var buffer = gl.createBuffer();
  if (!buffer) {
    console.log("Failed to create the buffer object");
    return false;
  }
  // Write date into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  // Assign the buffer object to the attribute variable
  var a_attribute = gl.getAttribLocation(gl.program, attribute);
  if (a_attribute < 0) {
    console.log("Failed to get the storage location of " + attribute);
    return false;
  }
  gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
  // Enable the assignment of the buffer object to the attribute variable
  gl.enableVertexAttribArray(a_attribute);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return true;
}
