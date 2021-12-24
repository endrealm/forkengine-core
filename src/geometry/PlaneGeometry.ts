import {BufferAttribute, BufferGeometry} from "three";

/**
 *  Similar to Three js PlaneBufferGeometry;
 *  The purpose of this class is to simplify the generation of VBO data
 */
export class PlaneGeometry extends BufferGeometry {

    constructor(segmentsX: number, segmentsY: number, segmentSizeX: number = 1, segmentSizeY: number = 1) {
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

        // this.setIndex([0, 1, 2, 3, 4, 5])

        this.setAttribute("position", new BufferAttribute(new Float32Array(positions), 3, false))
    }

}