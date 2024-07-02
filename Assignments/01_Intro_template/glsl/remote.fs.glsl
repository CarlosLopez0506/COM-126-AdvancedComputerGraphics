uniform int rcState;

void main() {
    precision mediump float;

    vec4 color;

    if (rcState == 1) {
        color = vec4(1.0, 0.0, 0.0, 1.0);
    } else if (rcState == 2) {
        color = vec4(0.0, 0.0, 1.0, 1.0);
    } else if (rcState == 3) {
        color = vec4(0.0, 1.0, 0.0, 1.0);
    } else {
        color = vec4(1.0, 1.0, 1.0, 1.0); 
    }

    gl_FragColor = color;
}
