precision mediump float;

uniform vec3 remotePosition;
varying vec3 interpolatedNormal;
varying vec3 vertexPosition; 



void main() {
    float distance = length(vertexPosition - remotePosition);

    float threshold = 5.0; 

    vec4 closeColor = vec4(vec3(0.2*interpolatedNormal.r,0.2*interpolatedNormal.g ,0.2*interpolatedNormal.b), 1.0);
    vec4 normalColor = vec4(normalize(interpolatedNormal), 1.0);

    if (distance < threshold) {
        gl_FragColor = closeColor;
    } else {
        gl_FragColor = normalColor;
    }}
