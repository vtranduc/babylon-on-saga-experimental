precision highp float;

const float minAlphaLevel = 0.5;

varying vec2 planeCoord;

uniform vec3 uMajorColor;
uniform vec3 uMinorColor;
uniform vec2 uFadeRange;
uniform vec3 uCenter;
uniform vec2 uSpacing;

float getGrid(in vec2 coord, in float spacing) {
    vec2 gridCoord = coord / spacing;
    vec2 grid = abs(fract(gridCoord - 0.5) - 0.5) / fwidth(gridCoord);
    return 1.0 - min(min(grid.x, grid.y), 1.0);
}

void main() {
    float d = length(planeCoord - uCenter.xz);
    if (d > uFadeRange.y) { discard; return; }
    float intensity = smoothstep(uFadeRange.y, uFadeRange.x, d);
    float minor = getGrid(planeCoord, uSpacing.x);
    float major = getGrid(planeCoord, uSpacing.y);
    float alpha = max(major, minor) * intensity;
    if (alpha < minAlphaLevel) { discard; return; }
    float majorColorWeight = major / (minor + major);
    vec3 color = mix(uMinorColor, uMajorColor, majorColorWeight);
    gl_FragColor = vec4(color, alpha);
}