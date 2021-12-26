import {Vector3, Vector4} from "three";

export namespace TilemapTint {

    export enum Colors {
        Default = 0,
        Grey = 1,
        Red = 2,
        Green = 3,
        Blue = 4
    }

    export const DefaultColorPalette: (Vector3 | Vector4)[] = [
        new Vector3(0, 0, 0), // default
        new Vector3(-0.2, -0.2, -0.2), // grey
        new Vector3(0.2, 0.0, 0.0), // red
        new Vector3(0.0, 0.2, 0.0),
        new Vector3(0.0, 0.0, 0.2),

        // filler
        new Vector3(0, 0, 0),
        new Vector3(0, 0, 0),
        new Vector3(0, 0, 0),
        new Vector3(0, 0, 0)
    ]

}