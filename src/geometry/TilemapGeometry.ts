import {BufferAttribute, BufferGeometry} from "three";
import {TilemapState} from "../components/tilemap/simple/TilemapComponent";
import {Vector2D} from "../util/Vector";

/**
 *  Similar to Three js PlaneBufferGeometry;
 *  The purpose of this class is to simplify the generation of VBO data for tilemap
 */
export class TilemapGeometry extends BufferGeometry {

    constructor(
        private readonly segmentsX: number,
        private readonly segmentsY: number,
        private readonly segmentSizeX: number = 1,
        private readonly segmentSizeY: number = 1) {
        super();

        const positions: number[] = [];

        for(let x = 0; x < segmentsX; x++) {
            for(let y = 0; y < segmentsY; y++) {
                positions.push(...[
                    (1.0 + x) * segmentSizeX, (0.0 + y) * segmentSizeY, 0,
                    (0.0 + x) * segmentSizeX, (1.0 + y) * segmentSizeY, 0,
                    (0.0 + x) * segmentSizeX, (0.0 + y) * segmentSizeY, 0,
                ])

                positions.push(...[
                    (1.0 + x) * segmentSizeX, (1.0 + y) * segmentSizeY, 0,
                    (0.0 + x) * segmentSizeX, (1.0 + y) * segmentSizeY, 0,
                    (1.0 + x) * segmentSizeX, (0.0 + y) * segmentSizeY, 0,
                ])

            }
        }

        this.setAttribute("position", new BufferAttribute(new Float32Array(positions), 3, false))
    }

    applyState(tilemapState: TilemapState) {
        const textureIDs: number[] = [];
        const uvs: number[] = [];

        for(let x = 0; x < this.segmentsX; x++) {
            for(let y = 0; y < this.segmentsY; y++) {
                if(!tilemapState.data[x] || !tilemapState.data[x][y]) continue;

                const tilesetIndex = tilemapState.data[x][y].tilesetIndex;
                const tileIndex = tilemapState.data[x][y].index;

                textureIDs.push(...[
                    // first face
                    tilesetIndex,
                    tilesetIndex,
                    tilesetIndex,

                    // second face
                    tilesetIndex,
                    tilesetIndex,
                    tilesetIndex,
                ])

                const tileset = tilemapState.tilesets[tilesetIndex];
                const tilePosition = tileset.getTilePos(tileIndex);

                const uvCoords00 = tileset.getUVCoords(tilePosition, new Vector2D(0, 0))
                const uvCoords10 = tileset.getUVCoords(tilePosition, new Vector2D(1, 0))
                const uvCoords01 = tileset.getUVCoords(tilePosition, new Vector2D(0, 1))
                const uvCoords11 = tileset.getUVCoords(tilePosition, new Vector2D(1, 1))

                uvs.push(...[
                    // first face
                    uvCoords10.getX, uvCoords10.getY,
                    uvCoords01.getX, uvCoords01.getY,
                    uvCoords00.getX, uvCoords00.getY,

                    // second face
                    uvCoords11.getX, uvCoords11.getY,
                    uvCoords01.getX, uvCoords01.getY,
                    uvCoords10.getX, uvCoords10.getY,
                ])

            }
        }

        this.setAttribute("uv", new BufferAttribute(new Float32Array(uvs), 2, false))
        this.setAttribute("textureIDs", new BufferAttribute(new Uint32Array(textureIDs), 1, false))
    }

}