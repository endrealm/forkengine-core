/*

uniform sampler2D tilesets[3];

in vec2 vTextureCoords;
flat in int vTilesetID;

void main() {
    if(vTilesetID == 0) {
        gl_FragColor = texture2D(tilesets[0], vTextureCoords);
        return;
    }
    if(vTilesetID == 1) {
        gl_FragColor = texture2D(tilesets[1], vTextureCoords);
        return;
    }
    if(vTilesetID == 2) {
        gl_FragColor = texture2D(tilesets[2], vTextureCoords);
        return;
    }
    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
}
 */
export const TilemapFragmentShader =
    "uniform sampler2D tilesets[3];\n" +
    "\n" +
    "in vec2 vTextureCoords;\n" +
    "flat in int vTilesetID;\n" +
    "\n" +
    "void main() {\n" +
    "    if(vTilesetID == 0) {\n" +
    "        gl_FragColor = texture2D(tilesets[0], vTextureCoords);\n" +
    "        return;\n" +
    "    }\n" +
    "    if(vTilesetID == 1) {\n" +
    "        gl_FragColor = texture2D(tilesets[1], vTextureCoords);\n" +
    "        return;\n" +
    "    }\n" +
    "    if(vTilesetID == 2) {\n" +
    "        gl_FragColor = texture2D(tilesets[2], vTextureCoords);\n" +
    "        return;\n" +
    "    }\n" +
    "    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);\n" +
    "}";


/*

attribute int tilesetID;

out vec2 vTextureCoords;
flat out int vTilesetID;

void main() {
    vTextureCoords = uv;
    vTilesetID = tilesetID;
    gl_Position = projectionMatrix * modelViewMatrix  * vec4(position, 1.0);
}

 */
export const TilemapVertexShader =
    "attribute int tilesetID;\n" +
    "\n" +
    "out vec2 vTextureCoords;\n" +
    "flat out int vTilesetID;\n" +
    "\n" +
    "void main() {\n" +
    "    vTextureCoords = uv;\n" +
    "    vTilesetID = tilesetID;\n" +
    "    gl_Position = projectionMatrix * modelViewMatrix  * vec4(position, 1.0);\n" +
    "}";