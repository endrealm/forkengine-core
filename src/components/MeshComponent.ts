import { BufferGeometry, Material, Mesh } from "three";
import { Component } from "../Component";

export class MeshComponent extends Component {
    public readonly mesh: Mesh;

    constructor(geometry?: BufferGeometry, material?: Material | Material[]) {
        super("MeshComponent");
        this.mesh = new Mesh(geometry, material)
    }

    start() {
        this.getGameObject().group.add(this.mesh);
    }
    
}