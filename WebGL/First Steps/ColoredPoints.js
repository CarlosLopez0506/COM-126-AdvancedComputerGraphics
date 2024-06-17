// ColoredPoint.js (c) 2012 matsuda
// TODO: Vertex shader program

// TODO: Fragment shader program

function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById("webgl");

  // TODO: Get the rendering context for WebGL

  // TODO: Initialize shaders

  // TODO: Get the storage location of a_Position
  var a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    console.log("Failed to get the storage location of a_Position");
    return;
  }

  // TODO: Get the storage location of u_FragColor

  // TODO: Register function (event handler) to be called on a mouse press

  // TODO: Specify the color for clearing <canvas>

  // TODO: Clear <canvas>
}

var g_points = []; // The array for the position of a mouse press
var g_colors = []; // The array to store the color of a point
function click(ev, gl, canvas, a_Position, u_FragColor) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = (x - rect.left - canvas.width / 2) / (canvas.width / 2);
  y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

  // Store the coordinates to g_points array
  g_points.push([x, y]);
  // TODO: Store the coordinates to g_points array

  // TODO: Clear <canvas>

  // TODO: Draw points
}
