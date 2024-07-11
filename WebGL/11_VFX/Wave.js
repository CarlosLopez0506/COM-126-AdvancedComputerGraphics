// Wave.js
// Vertex shader program
var VSHADER_SOURCE =`
uniform mat4 u_perspectiveMatrix;
uniform mat4 u_modelMatrix;
uniform mat4 u_viewMatrix;
uniform float u_time;

attribute vec4 a_Position;

varying vec4 v_Color;
varying vec3 v_Normal;
varying vec3 v_Position;

void main() {
  vec4 position = a_Position;
  float dist = length(vec3(position));
  float wave = sin(dist * 10.0 + u_time) * 0.05;
  position.y += wave;
  
  v_Position = vec3(u_modelMatrix * position);
  v_Normal = normalize(vec3(0.0, 1.0, 0.0) + vec3(0.0, wave, 0.0));

  mat4 modelViewMatrix = u_viewMatrix * u_modelMatrix;
  gl_Position = u_perspectiveMatrix * modelViewMatrix * position;

  float c = (wave + 1.0) * 0.5 * 0.8 + 0.2;
  v_Color = vec4(0, c, c, 1.0);
}
`;


// Fragment shader program
var FSHADER_SOURCE =`
#ifdef GL_ES
precision mediump float;
#endif

varying vec4 v_Color;
varying vec3 v_Normal;
varying vec3 v_Position;

uniform vec3 u_lightPosition;
uniform vec3 u_viewPosition;

void main() {
  vec3 normal = normalize(v_Normal);
  vec3 lightDir = normalize(u_lightPosition - v_Position);
  float diff = max(dot(lightDir, normal), 0.0);
  
  vec3 viewDir = normalize(u_viewPosition - v_Position);
  vec3 reflectDir = reflect(-lightDir, normal);
  float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
  
  vec3 ambient = vec3(0.1, 0.1, 0.4);
  vec3 diffuse = diff * vec3(0.0, 0.6, 0.8);
  vec3 specular = spec * vec3(1.0, 1.0, 1.0);
  
  vec3 color = ambient + diffuse + specular;
  gl_FragColor = vec4(color, 1.0);
}

`;

var g_perspMatrix = new Matrix4();
var g_modelMatrix = new Matrix4();
var g_viewMatrix = new Matrix4();

var g_vertexPositionBuffer;
var g_vertexIndexBuffer;
var g_vertexIndexNum;

function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('example');

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
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

  var perspectiveMatrixShaderLocation = gl.getUniformLocation(gl.program, 'u_perspectiveMatrix');
  var modelMatrixShaderLocation = gl.getUniformLocation(gl.program, 'u_modelMatrix');
  var viewMatrixShaderLocation = gl.getUniformLocation(gl.program, 'u_viewMatrix');
  var timeShaderLocation = gl.getUniformLocation(gl.program, 'u_time');
  
  
  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0, 0, 0, 1);

  if (!initVertexBuffers(gl)) {
    console.log("Failed to set the vertex information");
    return;
  }

  var time = 0;

  var tick = function () {
    // TODO: Update time for the shader
  
  var tick = function() {
    
    window.requestAnimationFrame(tick);
    time += 0.04;

    gl.uniform1f(timeShaderLocation, time);

    drawCommon(gl, canvas, u_perspMatrix, u_viewMatrix);
    drawGrid(gl, u_modelMatrix);
    requestAnimationFrame(tick);
    drawCommon(gl, canvas, perspectiveMatrixShaderLocation, viewMatrixShaderLocation);
    drawGrid(gl, perspectiveMatrixShaderLocation, modelMatrixShaderLocation);
  };
  tick(); 
}

function drawCommon(gl, canvas, u_perspMatrix, u_viewMatrix) {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear <canvas>
  g_perspMatrix.setPerspective(30, canvas.width / canvas.height, 1, 10000);
  g_viewMatrix.setLookAt(0, 3, 5, 0, 0, 0, 0, 1, 0); // eyePos - focusPos - upVector

function drawCommon(gl, canvas, perspectiveMatrixShaderLocation, viewMatrixShaderLocation) {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);    // Clear <canvas>
  g_perspectiveMatrix.setPerspective(30, canvas.width/canvas.height, 1, 10000);
  g_viewMatrix.setLookAt(0, 3, 5,   0, 0, 0,    0, 1, 0);   // eyePos - focusPos - upVector

  gl.uniformMatrix4fv(u_perspMatrix, false, g_perspMatrix.elements);
  gl.uniformMatrix4fv(u_viewMatrix, false, g_viewMatrix.elements);
  gl.uniformMatrix4fv(perspectiveMatrixShaderLocation, false, g_perspectiveMatrix.elements);
  gl.uniformMatrix4fv(viewMatrixShaderLocation, false, g_viewMatrix.elements);
}

function drawGrid(gl, u_modelMatrix) {
  if (!updateArrayBuffer(gl, g_PositionBuffer, 3, gl.FLOAT, "a_Position")) {
    console.log("Failed to update a_Position attributes");
    return;
  }
function drawGrid(gl, perspectiveMatrixShaderLocation, modelMatrixShaderLocation) {
  
  gl.bindBuffer(gl.ARRAY_BUFFER, g_vertexPositionBuffer);
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

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
      positionData.push((x-xnum/2)*width/xnum);
      positionData.push(0);
      positionData.push((z-znum/2)*height/znum);
    }
  }
  for (var z = 0; z < znum-1; z++) {
    for (var x = 0; x < xnum-1; x++) {
      indexData.push(z*xnum+x+0);
      indexData.push(z*xnum+x+1);
      indexData.push(z*xnum+x+xnum+0);

      indexData.push(z*xnum+x+1);
      indexData.push(z*xnum+x+xnum+0);
      indexData.push(z*xnum+x+xnum+1);
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
  g_vertexPositionBuffer = gl.createBuffer();
  g_vertexIndexBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, g_vertexPositionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionData), gl.STATIC_DRAW);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, g_vertexIndexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW);

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

