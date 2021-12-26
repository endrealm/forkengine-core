import {BufferAttribute, BufferGeometry, Float32BufferAttribute, Int32BufferAttribute} from "three";
import {TilemapState, TintStorage} from "../components/tilemap/simple/TilemapComponent";
import {Vector2D} from "../util/Vector";


export const DEFAULT_TINT = 0;

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
        // const normals: number[] = [];

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

        /*
        // foreach vertex
        for(let i = 0; i < segmentsX * segmentsY * 2 * 3 * 3; i++) {
            normals.push(0);
        }
        */


        this.setAttribute("position", new Float32BufferAttribute(positions, 3, false))
        // this.setAttribute("normal", new BufferAttribute(new Float32Array(normals), 3, false))
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

        this.setAttribute("uv", new Float32BufferAttribute(uvs, 2))
        this.setAttribute("tilesetID", new Int32BufferAttribute(textureIDs, 1))
    }

    applyTint(tint: TintStorage) {
        const tintIDs: number[] = [];

        for(let x = 0; x < this.segmentsX; x++) {
            for(let y = 0; y < this.segmentsY; y++) {
                const tintID = tint[x] && tint[x][y] ? (tint[x][y].tintID|| DEFAULT_TINT) : DEFAULT_TINT;

                tintIDs.push(...[
                    // first face
                    tintID,
                    tintID,
                    tintID,

                    // second face
                    tintID,
                    tintID,
                    tintID,
                ])
            }
        }

        this.setAttribute("tintID", new Int32BufferAttribute(tintIDs, 1))
    }

}