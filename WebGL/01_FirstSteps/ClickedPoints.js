// ClickedPints.js (c) 2012 matsuda

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
    console.log("Failed to get the storage location of a_Pos");
    return;
  }
  // TODO: Register function (event handler) to be called on a mouse press
  canvas.onmousedown = function (ev) { click(ev, gl, canvas, local_a_Pos); }
  // TODO: Specify the color for clearing <canvas>

  // TODO: Clear <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
}

var g_points = []; // The array for the position of a mouse press
function click(ev, gl, canvas, a_Position) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = (x - rect.left - canvas.width / 2) / (canvas.width / 2);
  y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);
  // Store the coordinates to g_points array
  g_points.push(x);
  g_points.push(y);

  // TODO: Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // TODO: Draw points
  var pts = g_points.length;
  for(var i = 0; i < pts; i += 2) {
    // TODO: Pass vertex position to attribute variable
    gl.vertexAttrib3f(a_Position, g_points[i], g_points[i+1], 0.0);
    gl.drawArrays(gl.POINTS, 0, 1);
  }
}
