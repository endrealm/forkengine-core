import {Component} from "../../../Component";
import {BoxGeometry, BufferGeometry, Mesh, MeshBasicMaterial, MeshStandardMaterial, PlaneBufferGeometry} from "three";
import {Geometry} from "three/examples/jsm/deprecated/Geometry";


const TILE_MATERIAL = new MeshBasicMaterial({
    color: 0x0000ff,
})

export class TileComponent extends Component {


    private readonly mesh: Mesh


    constructor (private readonly geometry: BufferGeometry) {
        super("TileComponent");

        this.mesh = new Mesh(geometry, TILE_MATERIAL)
    }

    public setTile() {

    }

    start() {
        super.start();
        this.getGameObject().group.add(this.mesh)
        this.getGameObject().setMouseHandlerNeedsUpdate(true)
    }

    stop() {
        super.stop()


    }

}
