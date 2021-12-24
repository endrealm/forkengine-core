/*

uniform sampler2D tileset;

in vec2 vTextureCoords;

void main() {
    gl_FragColor = texture2D(tileset, vTextureCoords);
}
 */
export const TilemapFragmentShader =
    "uniform sampler2D tileset;\n" +
    "\n" +
    "in vec2 vTextureCoords;\n" +
    "\n" +
    "void main() {\n" +
    "    gl_FragColor = texture2D(tileset, vTextureCoords);\n" +
    "}";


/*

out vec2 vTextureCoords;

void main() {
    vTextureCoords = uv;
    gl_Position = projectionMatrix * modelViewMatrix  * vec4(position, 1.0);
}

 */
export const TilemapVertexShader =
    "out vec2 vTextureCoords;\n" +
    "\n" +
    "void main() {\n" +
    "    vTextureCoords = uv;\n" +
    "    gl_Position = projectionMatrix * modelViewMatrix  * vec4(position, 1.0);\n" +
    "}";