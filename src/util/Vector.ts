export class Vector2D {

    constructor(private x: number = 0, private y: number = 0) {
    }

    get getX() {
        return this.x
    }

    set setX(x: number) {
        this.x = x
    }

    get getY() {
        return this.y
    }

    set setY(y: number) {
        this.y = y
    }


    /**
     * divides the current vector by v;
     * ! returns itself
     * @param v
     */
    divide(v: Vector2D): Vector2D {
        this.x /= v.x
        this.y /= v.y
        return this
    }

}