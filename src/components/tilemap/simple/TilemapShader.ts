/*

uniform sampler2D texture;

void main() {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
}
 */
export const TilemapFragmentShader =
    "void main() {\n" +
    "    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n" +
    "}";


/*



void main() {
    gl_Position = projectionMatrix * modelViewMatrix  * vec4(position, 1.0);
}

 */
export const TilemapVertexShader =
    "void main() {\n" +
    "    gl_Position = projectionMatrix * modelViewMatrix  * vec4(position, 1.0);\n" +
    "}";