varying vec3 V_ViewPosition;
varying vec3 V_Normal_VCS;

uniform vec3 lightPosition; 
uniform vec3 lightColor;
uniform vec3 ambientColor;
uniform vec3 diffuseColor;
uniform vec3 specularColor;
uniform float ambientIntensity;
uniform float diffuseIntensity;
uniform float specularIntensity;
uniform float shininess;

void main() {
    vec3 normal = normalize(V_Normal_VCS);
    vec3 lightDir = normalize(lightPosition - V_ViewPosition);
    vec3 viewDir = normalize(-V_ViewPosition);

    // Cálculo del vector halfway
    vec3 halfwayDir = normalize(lightDir + viewDir);

    // Componente ambiente
    vec3 ambient = ambientIntensity * ambientColor;

    // Componente difusa
    float diff = max(dot(normal, lightDir), 0.0);
    vec3 diffuse = diff * diffuseIntensity * diffuseColor * lightColor;

    // Componente especular usando Blinn-Phong
    float spec = pow(max(dot(normal, halfwayDir), 0.0), shininess);
    vec3 specular = spec * specularIntensity * specularColor * lightColor;

    // Suma todas las componentes
    vec3 color = ambient + diffuse + specular;

    gl_FragColor = vec4(color, 1.0);
}
