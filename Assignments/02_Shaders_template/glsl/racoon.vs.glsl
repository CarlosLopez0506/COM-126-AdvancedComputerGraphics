varying vec3 vNormal;
varying vec3 vPosition;

// Include the fog vertex uniforms and varying
varying float fogDepth;

void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelMatrix * vec4(position, 1.0)).xyz;

    // Calculate fog depth
    vec3 mvPosition = vec3(modelViewMatrix * vec4(position, 1.0));
    fogDepth = -mvPosition.z;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
