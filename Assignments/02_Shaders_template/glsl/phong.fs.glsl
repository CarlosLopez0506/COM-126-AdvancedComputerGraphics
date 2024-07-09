varying vec3 V_ViewPosition;
varying vec3 V_Normal_VCS;

uniform vec3 lightPosition; 
uniform vec3 lightColor; 
uniform vec3 ambientColor; 
uniform vec3 diffuseColor; 
uniform vec3 specularColor; 
uniform float shininess; 

void main() {
    vec3 normal = normalize(V_Normal_VCS);

    vec3 lightDir = normalize(lightPosition - V_ViewPosition);

    vec3 ambient = ambientColor;

    float diff = max(dot(normal, lightDir), 0.0);
    vec3 diffuse = diff * diffuseColor * lightColor;

    vec3 viewDir = normalize(-V_ViewPosition);
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), shininess);
    vec3 specular = spec * specularColor * lightColor;

    vec3 color = ambient + diffuse + specular;

    gl_FragColor = vec4(color, 1.0);
}
