// HelloCanvas.js (c) 2012 matsuda
function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById("webgl");

  // TODO: Get the rendering context for WebGL
	var gl = getWebGLContext(canvas);
	if (!gl) {
		console.log('Failed to get the rendering context for WebGL');
		return;
	}

  // TODO: Set clear color
	gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // TODO: Clear <canvas>
	gl.clear(gl.COLOR_BUFFER_BIT);
}
