import {Raycaster, Vector3} from "three";
import {GameObject} from "./GameObject";
import {GameObjectUtils} from "./GameObjectUtils";

export type Hit = {
    gameObject: GameObject;
    point: Vector3;
}

export namespace Physics {

    export function raycastAll(origin: Vector3, direction: Vector3, selection: GameObject[]): Hit[] {
        const raycaster = new Raycaster();

        raycaster.set(origin, direction)
        return raycaster
            .intersectObjects(selection.map(selected => selected.group), true)
            .map(hit => {
                return {
                    gameObject: GameObjectUtils.ThreeToGameObject(hit.object),
                    point: hit.point
                }
            })
    }
}
