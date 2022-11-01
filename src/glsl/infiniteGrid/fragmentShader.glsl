precision highp float;

const float xzHalfWidth = 0.02;

varying vec2 planeCoord;

uniform vec3 uMajorColor;
uniform vec3 uMinorColor;
uniform vec2 uFadeRange;
uniform vec3 uCameraPosition;
uniform vec2 uSpacing;
uniform vec3 uOriginParams;
uniform vec3 uXAxisColor;
uniform vec3 uYAxisColor;

float getGrid(in vec2 coord, in float spacing) {
    vec2 gridCoord = coord / spacing;
    vec2 grid = abs(fract(gridCoord - 0.5) - 0.5) / fwidth(gridCoord);
    return 1.0 - min(min(grid.x, grid.y), 1.0);
}

void main() {
    float d = length(planeCoord - uCameraPosition.xz);
    if (d > uFadeRange.y) { discard; return; }

    float intensity = smoothstep(uFadeRange.y, uFadeRange.x, d);

    float r = length(planeCoord);
    if (length(planeCoord) < uOriginParams.z) {
        if (r <= uOriginParams.y && r >= uOriginParams.x)
            gl_FragColor = vec4(uMajorColor, intensity);
        else discard;
        return;
    }

    if (abs(planeCoord.x) <= xzHalfWidth) 
        { gl_FragColor = vec4(uYAxisColor, 1.0); return; }
    if (abs(planeCoord.y) <= xzHalfWidth) 
        { gl_FragColor = vec4(uXAxisColor, 1.0); return; }
    
    float minor = getGrid(planeCoord, uSpacing.x);
    float major = getGrid(planeCoord, uSpacing.y);
    float alpha = max(major, minor) * intensity;
    float majorColorWeight = major / (minor + major);
    vec3 color = mix(uMinorColor, uMajorColor, majorColorWeight);
    gl_FragColor = vec4(color, alpha);
}