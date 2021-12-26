import {TilemapComponent} from "./TilemapComponent";
import {Color} from "three";

/**
 *  Wrapper class for tilemap methods
 */
export class Tile {

    constructor(
        private readonly _x: number,
        private readonly _y: number,
        private readonly tilemap: TilemapComponent,

        private readonly _onClick: (tile: Tile) => void,
        private readonly _onHoverStart: (tile: Tile) => void,
        private readonly _onHoverEnd: (tile: Tile) => void,

        private readonly _getTint: (x: number, y: number) => number,
        private readonly _setTint: (x: number, y: number, tint: number) => void
    ) {

    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    get tint() {
        return this._getTint(this._x, this._y);
    }

    set tint(tint: number) {
        this._setTint(this._x, this._y, tint);
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