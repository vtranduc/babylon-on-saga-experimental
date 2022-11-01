precision highp float;

uniform mat4 worldViewProjection;

attribute vec3 position;

varying vec2 planeCoord;

uniform vec3 uCameraPosition;
uniform vec2 uFadeRange;

void main() {
    planeCoord = uFadeRange.y * position.xz + uCameraPosition.xz;
    gl_Position = worldViewProjection * vec4(planeCoord.x, 0.0, planeCoord.y, 1.0);
}