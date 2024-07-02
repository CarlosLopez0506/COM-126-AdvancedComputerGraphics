// Este fragment shader fue realizado con ayuda de ChatGPT para simular la iluminación.
precision mediump float;

uniform vec3 remotePosition;
uniform int rcState;
uniform vec3 lightPosition; 
varying vec3 interpolatedNormal;
varying vec3 vertexPosition; 

void main() {
    float distance = length(vertexPosition - remotePosition);
    float threshold = 5.0; 

    vec4 closeColor = vec4(vec3(0.2*interpolatedNormal.r,0.2*interpolatedNormal.g,0.2*interpolatedNormal.b), 1.0);
    vec4 normalColor = vec4(normalize(interpolatedNormal), 1.0);

    vec4 stateColor;

    if (rcState == 1) {
        stateColor = vec4(1.0, 0.0, 0.0, 1.0); // Rojo
    } else if (rcState == 2) {
        stateColor = vec4(0.0, 0.0, 1.0, 1.0); // Azul
    } else if (rcState == 3) {
        stateColor = vec4(0.0, 1.0, 0.0, 1.0); // Verde
    } else {
        stateColor = vec4(1.0, 1.0, 1.0, 1.0); // Blanco por defecto
    }

    float smoothFactor = smoothstep(threshold - 1.0, threshold, distance); // Smooth transition
    vec4 blendedColor = mix(stateColor, normalColor, smoothFactor);

    // Basic diffuse lighting
    vec3 lightDirection = normalize(lightPosition - vertexPosition);
    float diffuse = max(dot(normalize(interpolatedNormal), lightDirection), 1.0);

    // Specular highlight
    vec3 viewDirection = normalize(-vertexPosition); // Assuming the camera is at the origin
    vec3 reflectDirection = reflect(-lightDirection, normalize(interpolatedNormal));
    float specular = pow(max(dot(viewDirection, reflectDirection), 0.0), 32.0);

    vec4 finalColor = blendedColor * diffuse + vec4(0.2, 0.2, 0.2, 1.0) + vec4(specular, specular, specular, 1.0);

    gl_FragColor = finalColor;
}
