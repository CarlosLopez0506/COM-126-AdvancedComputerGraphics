varying vec3 V_Normal_VCS;
varying vec3 V_ViewPosition;

void main() {
    // Transforma la posición del vértice al espacio de la cámara (View Coordinate Space)
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    V_ViewPosition = viewPosition.xyz;

    // Transforma la normal al espacio de la cámara
    V_Normal_VCS = normalize(normalMatrix * normal);

    // Calcula la posición final del vértice en la pantalla
    gl_Position = projectionMatrix * viewPosition;
}
