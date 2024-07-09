// Fragment shader
#ifdef GL_ES
precision highp float;
#endif

varying vec4 V_Color;

uniform vec3 fogColor;
varying float fogDepth;

uniform float fogNear;
uniform float fogFar;

void main() {
    float fogFactor = smoothstep(fogNear, fogFar, fogDepth);
    vec3 finalColor = mix(V_Color.rgb, fogColor, clamp(fogFactor, 0.0, 1.0));
    gl_FragColor = vec4(finalColor, V_Color.a);
}