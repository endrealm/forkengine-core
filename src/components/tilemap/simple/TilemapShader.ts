/*

#define MAX_TILESETS 3
#define MAX_TINTS 9
#define TILESET(id, color) if(vTilesetID == id){ color = texture2D(tilesets[id], vTextureCoords); }
#define TINT(id, color) if(vTintID == id){ color = tints[id]; }

uniform sampler2D tilesets[MAX_TILESETS];
uniform vec4 tints[MAX_TINTS];

in vec2 vTextureCoords;
flat in int vTilesetID;
flat in int vTintID;

void main() {
    vec4 textureColor;
    TILESET(0, textureColor)
    TILESET(1, textureColor)
    TILESET(2, textureColor)

    vec4 tintColor;
    TINT(0, tintColor);
    TINT(1, tintColor);
    TINT(2, tintColor);
    TINT(3, tintColor);
    TINT(4, tintColor);
    TINT(5, tintColor);
    TINT(6, tintColor);
    TINT(7, tintColor);
    TINT(8, tintColor);

    gl_FragColor =  vec4(textureColor.x + tintColor.x, textureColor.y + tintColor.y, textureColor.z + tintColor.z, textureColor.a + tintColor.a);
}
 */
export const TilemapFragmentShader =
    "#define MAX_TILESETS 3\n" +
    "#define MAX_TINTS 9\n" +
    "#define TILESET(id, color) if(vTilesetID == id){ color = texture2D(tilesets[id], vTextureCoords); }\n" +
    "#define TINT(id, color) if(vTintID == id){ color = tints[id]; }\n" +
    "\n" +
    "uniform sampler2D tilesets[MAX_TILESETS];\n" +
    "uniform vec4 tints[MAX_TINTS];\n" +
    "\n" +
    "in vec2 vTextureCoords;\n" +
    "flat in int vTilesetID;\n" +
    "flat in int vTintID;\n" +
    "\n" +
    "void main() {\n" +
    "    vec4 textureColor;\n" +
    "    TILESET(0, textureColor)\n" +
    "    TILESET(1, textureColor)\n" +
    "    TILESET(2, textureColor)\n" +
    "\n" +
    "    vec4 tintColor;\n" +
    "    TINT(0, tintColor);\n" +
    "    TINT(1, tintColor);\n" +
    "    TINT(2, tintColor);\n" +
    "    TINT(3, tintColor);\n" +
    "    TINT(4, tintColor);\n" +
    "    TINT(5, tintColor);\n" +
    "    TINT(6, tintColor);\n" +
    "    TINT(7, tintColor);\n" +
    "    TINT(8, tintColor);\n" +
    "\n" +
    "    gl_FragColor =  vec4(textureColor.x + tintColor.x, textureColor.y + tintColor.y, textureColor.z + tintColor.z, textureColor.a + tintColor.a);\n" +
    "}";


/*

attribute int tilesetID;
attribute int tintID;

out vec2 vTextureCoords;
flat out int vTilesetID;
flat out int vTintID;

void main() {
    vTextureCoords = uv;
    vTilesetID = tilesetID;
    vTintID = tintID;
    gl_Position = projectionMatrix * modelViewMatrix  * vec4(position, 1.0);
}

 */
export const TilemapVertexShader =
    "attribute int tilesetID;\n" +
    "attribute int tintID;\n" +
    "\n" +
    "out vec2 vTextureCoords;\n" +
    "flat out int vTilesetID;\n" +
    "flat out int vTintID;\n" +
    "\n" +
    "void main() {\n" +
    "    vTextureCoords = uv;\n" +
    "    vTilesetID = tilesetID;\n" +
    "    vTintID = tintID;\n" +
    "    gl_Position = projectionMatrix * modelViewMatrix  * vec4(position, 1.0);\n" +
    "}";