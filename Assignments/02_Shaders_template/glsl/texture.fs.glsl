varying vec2 vUv;
uniform sampler2D sphereTexture;

uniform vec3 fogColor;
varying float fogDepth;

uniform float fogNear;
uniform float fogFar;

void main() {
    float fogFactor = smoothstep(fogNear, fogFar, fogDepth);
    vec4 textureColor = texture2D(sphereTexture, vUv);
    textureColor.rgb = mix(textureColor.rgb, fogColor, fogFactor);
    gl_FragColor = textureColor;
}
