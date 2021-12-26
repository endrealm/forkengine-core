import {Vector3} from "three";

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
     * Divides the current vector by v;
     * @return returns itself
     * @param v
     */
    divide(v: Vector2D): Vector2D {
        return this.div(v);
    }

    div(v: Vector2D): Vector2D {
        this.x /= v.x;
        this.y /= v.y;
        return this
    }

    /**
     * Adds v the the current vector;
     * @return returns itself
     * @param v
     */
    add(v: Vector2D): Vector2D {
        this.x += v.x;
        this.y += v.y;
        return this;
    }

    sub(v: Vector2D): Vector2D {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }

    mod(v: Vector2D): Vector2D {
        this.x %= v.x;
        this.y %= v.y;
        return this;
    }

    divWithoutRemainder(v: Vector2D): Vector2D {
        this.x = (this.x - this.x % v.x) / v.x;
        this.y = (this.y - this.y % v.y) / v.y;
        return this;
    }



    public static fromVector3(vector: Vector3): Vector2D {
        return new Vector2D(vector.x, vector.y);
    }

}