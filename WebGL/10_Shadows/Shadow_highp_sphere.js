// Shadow_highp.js (c) 2012 matsuda and tanaka
// TODO: Vertex shader program for generating a shadow map

// TODO: Fragment shader program for generating a shadow map

// Vertex shader program for regular drawing
// TODO: Add the light maps
var VSHADER_SOURCE =
  "attribute vec4 a_Position;\n" +
  "attribute vec4 a_Color;\n" +
  "uniform mat4 u_MvpMatrix;\n" +
  "varying vec4 v_Color;\n" +
  "void main() {\n" +
  "  gl_Position = u_MvpMatrix * a_Position;\n" +
  "  v_Color = a_Color;\n" +
  "}\n";

// Fragment shader program for regular drawing
// TODO: Prepare shader to receive light information from vs
// TODO: Prepare shader to receive shadow map
var FSHADER_SOURCE =
  "#ifdef GL_ES\n" +
  "precision mediump float;\n" +
  "#endif\n" +
  "varying vec4 v_Color;\n" +
  "void main() {\n" +
  "  gl_FragColor = vec4(v_Color.rgb, v_Color.a);\n" +
  "}\n";

var OFFSCREEN_WIDTH = 2048,
  OFFSCREEN_HEIGHT = 2048;
var LIGHT = [0, 7, 2]; // Light position(x, y, z)

function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById("webgl");

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log("Failed to get the rendering context for WebGL");
    return;
  }

  // TODO: Initialize shaders for generating a shadow map

  // Initialize shaders for regular drawing
  var normalProgram = createProgram(gl, VSHADER_SOURCE, FSHADER_SOURCE);
  normalProgram.a_Position = gl.getAttribLocation(normalProgram, "a_Position");
  normalProgram.a_Color = gl.getAttribLocation(normalProgram, "a_Color");
  normalProgram.u_MvpMatrix = gl.getUniformLocation(
    normalProgram,
    "u_MvpMatrix"
  );
  if (
    normalProgram.a_Position < 0 ||
    normalProgram.a_Color < 0 ||
    !normalProgram.u_MvpMatrix
  ) {
    console.log(
      "Failed to get the storage location of attribute or uniform variable from normalProgram"
    );
    return;
  }

  // TODO: get references from light and shadow variables from shader

  // Set the vertex information
  var triangle = initVertexBuffersForTriangle(gl);
  var sphere = initVertexBuffersForSphere(gl);
  if (!triangle || !sphere) {
    console.log("Failed to set the vertex information");
    return;
  }

  // TODO: Initialize framebuffer object (FBO)

  // TODO: Activate dynamicly created texture

  // Set the clear color and enable the depth test
  gl.clearColor(0, 0, 0, 1);
  gl.enable(gl.DEPTH_TEST);

  // TODO: Create projection matrix from light

  var viewProjMatrix = new Matrix4(); // Prepare a view projection matrix for regular drawing
  viewProjMatrix.setPerspective(45, canvas.width / canvas.height, 1.0, 100.0);
  viewProjMatrix.lookAt(0.0, 7.0, 9.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

  var currentAngle = 0.0; // Current rotation angle (degrees)
  // TODO: A model view projection matrix from light source (for triangle)
  // TODO: A model view projection matrix from light source (for plane)
  var tick = function () {
    currentAngle = animate(currentAngle);

    // CREATE offscreen shadow map in the first pass
    // TODO: Change the drawing destination to FBO
    // TODO: Set view port for FBO
    // TODO: Clear FBO

    // TODO: Set shaders for generating a shadow map
    // TODO: Draw the triangle and the plane (for generating a shadow map)

    // TODO: Change the drawing destination to color buffer
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear color and depth buffer

    // TODO: Set the shader for regular drawing
    // TODO: Pass the texture we just created in the 1st pass
    // Pass 0 because gl.TEXTURE0 is enabled

    // Draw the triangle and plane ( for regular drawing)
    // TODO: Use light information to draw geometry
    // TODO: Use light information to draw plane

    window.requestAnimationFrame(tick, canvas);
  };
  tick();
}

// Coordinate transformation matrix
var g_modelMatrix = new Matrix4();
var g_mvpMatrix = new Matrix4();
function drawTriangle(gl, program, triangle, angle, viewProjMatrix) {
  // Set rotate angle to model matrix and draw triangle
  g_modelMatrix.setRotate(angle, 0, 1, 0);
  draw(gl, program, triangle, viewProjMatrix);
}

function drawSphere(gl, program, sphere, viewProjMatrix) {
  // Set scaling and translation to model matrix and draw sphere
  g_modelMatrix.setScale(3.0, 3.0, 3.0);
  g_modelMatrix.translate(0.0, -0.7, 0.0);
  draw(gl, program, sphere, viewProjMatrix);
}

function draw(gl, program, o, viewProjMatrix) {
  initAttributeVariable(gl, program.a_Position, o.vertexBuffer);
  if (program.a_Color != undefined)
    // If a_Color is defined to attribute
    initAttributeVariable(gl, program.a_Color, o.colorBuffer);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, o.indexBuffer);

  // Calculate the model view project matrix and pass it to u_MvpMatrix
  g_mvpMatrix.set(viewProjMatrix);
  g_mvpMatrix.multiply(g_modelMatrix);
  gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);

  gl.drawElements(gl.TRIANGLES, o.numIndices, gl.UNSIGNED_BYTE, 0);
}

// Assign the buffer objects and enable the assignment
function initAttributeVariable(gl, a_attribute, buffer) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(a_attribute, buffer.num, buffer.type, false, 0, 0);
  gl.enableVertexAttribArray(a_attribute);
}

function initVertexBuffersForSphere(gl) {
  // Create a sphere
  var SPHERE_DIV = 20;

  var i, ai, si, ci;
  var j, aj, sj, cj;
  var p1, p2;

  var vertices = [];
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

      vertices.push(si * sj); // X
      vertices.push(cj); // Y
      vertices.push(ci * sj); // Z
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

  var o = new Object(); // Utilize Object object to return multiple buffer objects together

  // TODO: Write vertex information to buffer object

  o.numIndices = indices.length;

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  return o;
}

function initVertexBuffersForTriangle(gl) {
  // Create a triangle
  //       v2
  //      / |
  //     /  |
  //    /   |
  //  v0----v1

  // Vertex coordinates
  // prettier-ignore
  var vertices = new Float32Array([
    -0.8, 3.5, 0.0,  
     0.8, 3.5, 0.0,  
     0.0, 3.5, 1.8
    ]);
  // Colors
  // prettier-ignore
  var colors = new Float32Array([
    1.0, 0.5, 0.0,  
    1.0, 0.5, 0.0,  
    1.0, 0.0, 0.0
  ]);
  // Indices of the vertices
  var indices = new Uint8Array([0, 1, 2]);

  // Utilize Object object to return multiple buffer objects together
  var o = new Object();

  // TODO: Write vertex information to buffer object

  o.numIndices = indices.length;

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  return o;
}

function initArrayBufferForLaterUse(gl, data, num, type) {
  // Create a buffer object
  var buffer = gl.createBuffer();
  if (!buffer) {
    console.log("Failed to create the buffer object");
    return null;
  }
  // Write date into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  // Store the necessary information to assign the object to the attribute variable later
  buffer.num = num;
  buffer.type = type;

  return buffer;
}

function initElementArrayBufferForLaterUse(gl, data, type) {
  // Create a buffer object
  var buffer = gl.createBuffer();
  if (!buffer) {
    console.log("Failed to create the buffer object");
    return null;
  }
  // Write date into the buffer object
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);

  buffer.type = type;

  return buffer;
}

function initFramebufferObject(gl) {
  var framebuffer, texture, depthBuffer;

  // TODO: Define the error handling function
  var error = function () {
    return null;
  };

  // TODO: Create a framebuffer object (FBO)

  // TODO: Create a texture object and set its size and parameters

  // TODO: Bind information to texture

  // TODO: Create a renderbuffer object and Set its size and parameters

  // TODO: Bind information to depth buffer

  // TODO: Attach the texture and the renderbuffer object to the FBO

  // TODO: Check if FBO is configured correctly  (SANITY CHECK)

  // TODO: Unbind the buffer object

  return framebuffer;
}

var ANGLE_STEP = 40; // The increments of rotation angle (degrees)

var last = Date.now(); // Last time that this function was called
function animate(angle) {
  var now = Date.now(); // Calculate the elapsed time
  var elapsed = now - last;
  last = now;
  // Update the current rotation angle (adjusted by the elapsed time)
  var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
  return newAngle % 360;
}
