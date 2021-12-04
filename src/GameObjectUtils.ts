import THREE from "three";
import {GameObject} from "./GameObject";

export namespace GameObjectUtils {
    export function ThreeToGameObject(threeObj: THREE.Object3D): GameObject {
        let target: (THREE.Object3D & {gameObject?: GameObject}) | null = threeObj;
        do {
            if(target["gameObject"]) return target["gameObject"]!;
        } while ((target = target.parent) !== null);

        throw new Error("Not a valid game object root")
    }
}
