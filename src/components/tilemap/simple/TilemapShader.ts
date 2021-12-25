/*

#define MAX_TILESETS 3
#define TILESET(id) if(vTilesetID == id){ gl_FragColor = texture2D(tilesets[id], vTextureCoords); return; }

uniform sampler2D tilesets[MAX_TILESETS];

in vec2 vTextureCoords;
flat in int vTilesetID;

void main() {
    TILESET(0)
    TILESET(1)
    TILESET(2)
    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
}
 */
export const TilemapFragmentShader =
    "#define MAX_TILESETS 3\n" +
    "#define TILESET(id) if(vTilesetID == id){ gl_FragColor = texture2D(tilesets[id], vTextureCoords); return; }\n" +
    "\n" +
    "uniform sampler2D tilesets[MAX_TILESETS];\n" +
    "\n" +
    "in vec2 vTextureCoords;\n" +
    "flat in int vTilesetID;\n" +
    "\n" +
    "void main() {\n" +
    "    TILESET(0)\n" +
    "    TILESET(1)\n" +
    "    TILESET(2)\n" +
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