// ColoredPoint.js (c) 2012 matsuda

// Vertex shader program
const VSHADER_SRC = `
  attribute vec4 a_Pos;
  void main() {
    gl_Position = a_Pos;
    gl_PointSize = 10.0;
  }
`;

// Fragment shader program
const FSHADER_SRC = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }
`;

function main() {
  // Retrieve <canvas> element
  const canvas = document.getElementById("webgl");

  // Get the rendering context for WebGL
  const gl = getWebGLContext(canvas);
  if (!gl) {
    console.error("Failed to load the WebGL context");
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SRC, FSHADER_SRC)) {
    console.error("Failed to initialize shaders.");
    return;
  }

  // Get the storage location of a_Position
  const a_Pos = gl.getAttribLocation(gl.program, "a_Pos");
  if (a_Pos < 0) {
    console.error("Failed to get the storage location of a_Pos");
    return;
  }

  // Get the storage location of u_FragColor
  const u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");
  if (!u_FragColor) {
    console.error("Failed to get the storage location of u_FragColor");
    return;
  }

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = (ev) => click(ev, gl, canvas, a_Pos, u_FragColor);

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}

let g_points = []; // The array for the position of a mouse press
let g_colors = []; // The array to store the color of a point

function click(ev, gl, canvas, a_Position, u_FragColor) {
  const { clientX, clientY } = ev;
  const rect = ev.target.getBoundingClientRect();

  const x = (clientX - rect.left - canvas.width / 2) / (canvas.width / 2);
  const y = (canvas.height / 2 - (clientY - rect.top)) / (canvas.height / 2);

  // Store the coordinates to g_points array
  g_points.push([x, y]);

  // Store the color to g_colors array
  g_colors.push(getColorForPosition(x, y));

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw points
  g_points.forEach((point, i) => {
    // Pass vertex position to attribute variable
    gl.vertexAttrib3f(a_Position, point[0], point[1], 0.0);
    // Pass the color of the point to uniform variable
    const color = g_colors[i];
    gl.uniform4f(u_FragColor, color[0], color[1], color[2], 1.0);
    gl.drawArrays(gl.POINTS, 0, 1);
  });
}

function getColorForPosition(x, y) {
  if (x > 0 && y > 0) {
    return [1.0, 0.0, 0.0, 1.0]; 
  } else if (x < 0 && y > 0) {
    return [0.0, 1.0, 0.0, 1.0]; 
  } else if (x < 0 && y < 0) {
    return [0.0, 0.0, 1.0, 1.0]; 
  } else if (x > 0 && y < 0) {
    return [1.0, 1.0, 0.0, 1.0]; 
  } else {
    return [0.0, 0.0, 0.0, 1.0]; 
  }
}
