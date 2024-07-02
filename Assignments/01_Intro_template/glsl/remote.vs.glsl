uniform vec3 remotePosition;

void main() {

    mat4 tPos = mat4(
    vec4(1.0, 0.0, 0.0, 0.0),
    vec4(0.0, 1.0, 0.0, 0.0),
    vec4(0.0, 0.0, 1.0, 0.0),
    vec4(remotePosition.x, remotePosition.y, remotePosition.z, 1.0)
    );
    
    gl_Position = projectionMatrix * modelViewMatrix *tPos * vec4(position ,1.0);
}
