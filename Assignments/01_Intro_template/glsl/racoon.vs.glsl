precision mediump float;

varying mediump vec3 interpolatedNormal;
varying mediump vec3 vertexPosition;

uniform float explosionFactor;

void main() {
    mat4 sPos = mat4(vec4(4.0, 0.0, 0.0, 0.0),
                     vec4(0.0, 4.0, 0.0, 0.0),
                     vec4(0.0, 0.0, 4.0, 0.0),
                     vec4(0.0, 0.0, 0.0, 1.0));

    mat4 tPos = mat4(
        vec4(1.0, 0.0, 0.0, 0.0),
        vec4(0.0, 1.0, 0.0, 0.0),
        vec4(0.0, 0.0, 1.0, 0.0),
        vec4(0, 0, 0, 1.0)
    );

    mat4 rXPos = mat4(
        vec4(1.0, 0.0, 0.0, 0.0),
        vec4(0.0, cos(1.5), -sin(1.5), 0.0),
        vec4(0.0, sin(1.5), cos(1.5), 0.0),
        vec4(0.0, 0.0, 0.0, 1.0)
    );


    vec3 displacedPosition = position + normal * explosionFactor;

    vec4 scaledPosition = tPos * rXPos * sPos * vec4(displacedPosition, 1.0);

    vertexPosition = scaledPosition.xyz;

    gl_Position = projectionMatrix * modelViewMatrix * scaledPosition;

    interpolatedNormal = normalize(normalMatrix * normal);
}
