import {Component} from "../Component";
import {MeshComponent} from "./MeshComponent";
import {BufferGeometry, Material} from "three";

export class TilemapComponent extends MeshComponent {


    constructor(materials: Material[]) {
        super(generateGeometry(), materials);
    }


    private generateGeometry(): BufferGeometry {
        return new BufferGeometry()
    }


}