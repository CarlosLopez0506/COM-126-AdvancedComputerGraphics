varying vec3 vNormal;
varying vec3 vPosition;

varying float fogDepth;

void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelMatrix * vec4(position, 1.0)).xyz;

    vec3 mvPosition = vec3(modelViewMatrix * vec4(position, 1.0));
    fogDepth = -mvPosition.z;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
