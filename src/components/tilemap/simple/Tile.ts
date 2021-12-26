import {TilemapComponent} from "./TilemapComponent";
import {Color} from "three";

/**
 *  Wrapper class for tilemap methods
 */
export class Tile {

    private _tint: Color;

    constructor(
        private readonly _x: number,
        private readonly _y: number,
        private readonly tilemap: TilemapComponent,

        private readonly _onClick: (tile: Tile) => void,
        private readonly _onHoverStart: (tile: Tile) => void,
        private readonly _onHoverEnd: (tile: Tile) => void
    ) {
        // TODO call tilemap methods here
        this._tint = new Color("white");
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    get tint() {
        return this._tint;
    }

    set tint(tint: Color) {
        this._tint = tint;
        // TODO call tilemap methods here
    }


    onClick() {
        this._onClick(this);
    }

    onHoverStart() {
        this._onHoverStart(this);
    }

    onHoverEnd() {
        this._onHoverEnd(this);
    }

}