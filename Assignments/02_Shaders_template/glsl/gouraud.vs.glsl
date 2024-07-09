// Vertex shader
attribute vec3 position;
attribute vec3 normal;

varying vec3 V_Normal;
varying vec3 V_ViewDir;
varying vec3 V_LightDir;
varying vec4 V_Color;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

uniform vec3 lightPosition;
uniform vec3 lightColor;
uniform vec3 ambientColor;
uniform vec3 diffuseColor;
uniform vec3 specularColor;

uniform float ambientIntensity;
uniform float diffuseIntensity;
uniform float specularIntensity;
uniform float shininess;

varying float fogDepth;

void main() {
    vec3 normal = normalize(normalMatrix * normal);
    V_Normal = normal;

    vec3 vertexPosition = vec3(modelViewMatrix * vec4(position, 1.0));

    V_ViewDir = normalize(-vertexPosition);
    V_LightDir = normalize(lightPosition - vertexPosition);

    // Ambient component
    vec3 ambient = ambientColor * ambientIntensity;

    // Diffuse component
    float diff = max(dot(normal, V_LightDir), 0.0);
    vec3 diffuse = diffuseColor * diff * diffuseIntensity * lightColor;

    // Specular component
    vec3 reflectDir = reflect(-V_LightDir, normal);
    float spec = pow(max(dot(V_ViewDir, reflectDir), 0.0), shininess);
    vec3 specular = specularColor * spec * specularIntensity * lightColor;

    // Combine all components
    vec3 finalColor = ambient + diffuse + specular;

    V_Color = vec4(finalColor, 1.0);

    // Position
    vec3 mvPosition = vec3(modelViewMatrix * vec4(position, 1.0));
    fogDepth = -mvPosition.z;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}