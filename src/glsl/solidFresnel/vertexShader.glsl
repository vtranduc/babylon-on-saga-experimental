precision highp float;

uniform mat4 worldViewProjection;

attribute vec3 position;
attribute vec3 normal;

varying vec3 vPosition;
varying vec3 vNormal;

// ===============================

const vec3 center = vec3(0., 0., 0.);

varying vec4 vGLPosition;

varying vec4 vGLCenterPosition;

uniform vec3 uCameraPosition;

const float pi = 3.14;

const float twoPi = 2. * pi;

const vec2 screenSize = vec2(800., 500.);

varying float vDepth;

mat3 getXRxMx(float theta) {
    mat3 mx = mat3(0.);
    float c = cos(theta);
    float s = sin(theta);
    mx[0][0] = 1.;
    mx[1][1] = c;
    mx[1][2] = -s;
    mx[2][1] = s;
    mx[2][2] = c;
    return mx;
}

mat3 getYRxMx(float theta) {
    mat3 mx = mat3(0.);
    float c = cos(theta);
    float s = sin(theta);
    mx[0][0] = c;
    mx[0][2] = s;
    mx[1][1] = 1.;
    mx[2][0] = -s;
    mx[2][2] = c;
    return mx;
}

mat3 getZRxMx(float theta) {
    mat3 mx = mat3(0.);
    float c = cos(theta);
    float s = sin(theta);
    mx[0][0] = c;
    mx[0][1] = -s;
    mx[1][0] = s;
    mx[1][1] = c;
    mx[2][2] = 1.;
    return mx;
}

float acosFull(float cosTheta) {
    float theta = acos(cosTheta);
    // return cosTheta < 0.0 ? 2.*  pi -theta : theta;

    return theta;
}

float atanFull(float opposite, float adjacent) {
    if (opposite == 0.) {
        if (adjacent >= 0.) return 0.;
        else return pi;
    } else if (opposite > 1.) {
        if (adjacent == 0.) return pi / 2.;

    }
    return 0.;
}

vec3 UnprojectPoint(float x, float y, float z) {
    mat4 worldViewProjectionInv = inverse(worldViewProjection);
    vec4 unprojectedPoint =  worldViewProjectionInv * vec4(x, y, z, 1.0);
    return unprojectedPoint.xyz / unprojectedPoint.w;
}

void main() {
    vPosition = position;
    vNormal = normal;

    vGLPosition = worldViewProjection * vec4(position, 1.0);

    vGLCenterPosition = worldViewProjection * vec4(center, 1.0);

    gl_Position = vGLPosition;

    vec3 planeNormal = normalize(uCameraPosition - center);

    float xRotation = acosFull(planeNormal.x);
    float yRotation = acosFull(planeNormal.y);
    float zRotation = acosFull(planeNormal.z);

    // mat3 xMx = mat3(0.);

    // float theta2 = yRotation;

    // xMx[0][0] = 1.;
    // xMx[1][1] = cos(theta2);
    // xMx[1][2] = -sin(theta2);
    // xMx[2][1] = sin(theta2);
    // xMx[2][2] = cos(theta2);

    // mat3 yMx = mat3(0.);

    // float theta = -xRotation;

    // yMx[0][0] = cos(theta);
    // yMx[0][2] = sin(theta);
    // yMx[1][1] = 1.;
    // yMx[2][0] = -sin(theta);
    // yMx[2][2] = cos(theta);

    // float theta3 = zRotation;

    // mat3 zMz = mat3(0.);

    // zMz[0][0] = cos(theta3);

    // vec3 rotatedPosition = xMx * position.xyz;

    mat3 xMx = getXRxMx(atan(-planeNormal.z, planeNormal.y));

    // mat3 xMx = getXRxMx(0.);

    // mat3 yMx = getYRxMx(atan(planeNormal.z, planeNormal.x));

    mat3 yMx = getYRxMx(0.);

    mat3 zMz = getZRxMx(0.);

    vec3 rotatedPosition = zMz * yMx * xMx * position.xyz;

    gl_Position = worldViewProjection * vec4(rotatedPosition, 1.0);

    // gl_Position = worldViewProjection * vec4(position, 1.);

    // ###

    vec3 center2 = uCameraPosition - planeNormal * 70.;

    // %%%

    vec4 centerGlPosition = worldViewProjection * vec4(center, 1.0);

    vec4 center2GlPosition = worldViewProjection * vec4(center2, 1.0);

    vec4 supposedGlPosition = worldViewProjection * vec4(position, 1.0);

    // supposedGlPosition.x = centerGlPosition.x + position.x * 20. + 20.;

    supposedGlPosition.x = centerGlPosition.x / centerGlPosition.w + position.x * 0.5;

    supposedGlPosition.y = centerGlPosition.y / centerGlPosition.w + position.y * 0.1;
// 
    supposedGlPosition.z = centerGlPosition.z;
// 
    // supposedGlPosition.z = 0.5;
// 
    // supposedGlPosition.w = 1.0;
// 
    supposedGlPosition.w = centerGlPosition.w;

    supposedGlPosition.z = 0.;

    // supposedGlPositioni
    supposedGlPosition.w = 1.;

    vec4 karano = worldViewProjection * vec4(center, 1.0);

    vDepth = karano.z / karano.w;

    gl_Position = supposedGlPosition;

    // **************************************************
    // **************************************************
    // **************************************************
    // **************************************************
    // **************************************************
    // **************************************************
    // **************************************************

    vec2 viewport = vec2(0.);
    float scale = .5;
    viewport.x = centerGlPosition.x + position.x * scale;
    viewport.y = centerGlPosition.y + position.y * scale;

    vec3 near = UnprojectPoint(viewport.x, viewport.y, 0.0);
    vec3 far = UnprojectPoint(viewport.x, viewport.y, 1.0);

    float a = planeNormal.x;
    float b = planeNormal.y;
    float c = planeNormal.z;

    float d = 0.; // -------------- THIS IS FOR CASE WITH ORIGIN CENTER ONLY

    float up = -a * near.x - b * near.y - c * near.z;

    vec3 m = far - near;

    float t = up / (m.x + m.y + m.z);

    vec3 point = m * t + near;

    // vec2 abc = gl_FragCoord.xy;

    // gl_Position = worldViewProjection * vec4(point, 1.);

    // vec3 unprojected = UnprojectPoint(
    //     supposedGlPosition.x,
    //     supposedGlPosition.y,
    //     0.5);

    
    // gl_Position = worldViewProjection * vec4(unprojected, 1.0);

    

    // ----

    // mat4 transform = worldViewProjection;

    // float Tx = transform[0][3];
    // float Ty = transform[1][3];
    // float Tz = transform[2][3];

    // float d = sqrt(pow(transform[0][0], 2.)
    //     + pow(transform[1][0], 2.)
    //     + pow(transform[2][0], 2.));

    // mat4 mx = mat4(0.);

    // mx[0][0] = d;
    // mx[1][1] = d;
    // mx[2][2] = d;

    // mx[0][3] = Tx;
    // mx[1][3] = Ty;
    // mx[2][3] = Tz;

    // mx[3][3] = 1.;

    // gl_Position = mx * vec4(position, 1.0);

    // gl_Position = worldViewProjection * vec4(position, 1.0);
}