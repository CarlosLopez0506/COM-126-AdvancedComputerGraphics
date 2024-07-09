varying vec2 vUv;

varying float fogDepth;

void main() {
    vUv = uv;

    vec3 mvPosition = vec3(modelViewMatrix * vec4(position, 1.0));
    fogDepth = -mvPosition.z;


    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
