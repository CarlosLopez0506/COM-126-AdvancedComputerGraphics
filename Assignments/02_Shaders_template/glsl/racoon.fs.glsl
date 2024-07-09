uniform sampler2D racoonTexture;
uniform float textureScale;
varying vec3 vNormal;
varying vec3 vPosition;

// Include the fog fragment uniforms and varying
uniform vec3 fogColor;
varying float fogDepth;

uniform float fogNear;
uniform float fogFar;

void main() {
    vec3 blendNormal = abs(vNormal);
    blendNormal /= dot(blendNormal, vec3(1.0));

    vec2 uvX = vPosition.yz * textureScale;
    vec2 uvY = vPosition.xz * textureScale;
    vec2 uvZ = vPosition.xy * textureScale;

    vec4 colX = texture2D(racoonTexture, uvX);
    vec4 colY = texture2D(racoonTexture, uvY);
    vec4 colZ = texture2D(racoonTexture, uvZ);

    vec4 texColor = colX * blendNormal.x + colY * blendNormal.y + colZ * blendNormal.z;

    float fogFactor = smoothstep(fogNear, fogFar, fogDepth);
    texColor.rgb = mix(texColor.rgb, fogColor, fogFactor);

    gl_FragColor = texColor;
}
