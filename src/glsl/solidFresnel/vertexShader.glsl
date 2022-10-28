precision highp float;

uniform mat4 worldViewProjection;

attribute vec3 position;
attribute vec3 normal;

varying vec3 vPosition;
varying vec3 vNormal;

void main() {
    vPosition = position;
    vNormal = normal;
    gl_Position = worldViewProjection * vec4(position, 1.0);
}