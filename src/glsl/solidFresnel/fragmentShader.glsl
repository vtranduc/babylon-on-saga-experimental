precision highp float;

uniform mat4 worldView;

varying vec3 vNormal;
varying vec3 vPosition;

uniform float uMaxRimProjection;
uniform vec3 uInnerColor;
uniform vec3 uOuterColor;

varying vec4 vGLPosition;

varying vec4 vGLCenterPosition;

varying float vDepth;

void main() {
    // vec4 gl_pos = gl_Position;

    // mat4 normalMatrix = transpose(inverse(worldView));
    // vec3 worldNormal = normalize((normalMatrix * vec4(vNormal, 1.0)).xyz);
    // vec3 viewPosition = normalize((worldView * vec4(vPosition, 1.0)).xyz);
    // float fresnelTerm = -dot(viewPosition, worldNormal);
    // if (fresnelTerm < 0.0) discard;
    // else if (fresnelTerm < uMaxRimProjection) gl_FragColor = vec4(uOuterColor, 1.0);
    // else {
    //     if (0. > vGLPosition.x) {
    //         gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
    //         return;
    //     }


    //     gl_FragColor = vec4(uInnerColor, 1.0);
    // }

    float far=gl_DepthRange.far;
    float near=gl_DepthRange.near;

    // vec4 eye_space_pos = gl_ModelViewMatrix * /*something*/
    // vec4 clip_space_pos = gl_ProjectionMatrix * eye_space_pos;

    // float ndc_depth = clip_space_pos.z / clip_space_pos.w;

    // float depth = (((far-near) * ndc_depth) + near + far) / 2.0;

    vec2 abc = gl_FragCoord.xy;

    // if (abc.x > 400.) {
    //     gl_FragColor = vec4(1., 1., 0., 1.);
    //     return;
    // }

    gl_FragDepth = (1. / vDepth - 1. / near)
        / (1. / far - 1./near);

    gl_FragDepth = vDepth;

    // gl_FragDepth = gl_FragCoord.w;

    gl_FragColor = vec4(uInnerColor, 1.);
}