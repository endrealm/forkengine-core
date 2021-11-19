import {Component} from "../Component";
import {MeshComponent} from "./MeshComponent";
import {BufferGeometry, Material} from "three";

function generateGeometry(): BufferGeometry {
    return new BufferGeometry()
}

export class TilemapComponent extends MeshComponent {


    constructor(materials: Material[]) {
        super(generateGeometry(), materials);
    }

}
