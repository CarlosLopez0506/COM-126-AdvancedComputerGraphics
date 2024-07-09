varying vec3 V_ViewPosition;
varying vec3 V_Normal_VCS;

void main() {
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    V_ViewPosition = viewPosition.xyz;

    V_Normal_VCS = normalize(normalMatrix * normal);

    gl_Position = projectionMatrix * viewPosition;
}
