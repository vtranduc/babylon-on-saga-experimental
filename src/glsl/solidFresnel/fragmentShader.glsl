precision highp float;

uniform mat4 worldView;

varying vec3 vNormal;
varying vec3 vPosition;

uniform float uMaxRimProjection;
uniform vec3 uInnerColor;
uniform vec3 uOuterColor;

void main() {
    mat4 normalMatrix = transpose(inverse(worldView));
    vec3 worldNormal = normalize((normalMatrix * vec4(vNormal, 1.0)).xyz);
    vec3 viewPosition = normalize((worldView * vec4(vPosition, 1.0)).xyz);
    float fresnelTerm = -dot(viewPosition, worldNormal);
    if (fresnelTerm < 0.0) discard;
    else if (fresnelTerm < uMaxRimProjection) gl_FragColor = vec4(uOuterColor, 1.0);
    else gl_FragColor = vec4(uInnerColor, 1.0);
}