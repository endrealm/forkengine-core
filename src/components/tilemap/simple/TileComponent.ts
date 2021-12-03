import {Component} from "../../../Component";
import {BoxGeometry, Mesh, MeshStandardMaterial, PlaneBufferGeometry} from "three";

const TILE_GEOMETRY = new BoxGeometry(300, 300, 300) // new PlaneBufferGeometry(1, 1);
const TILE_MATERIAL = new MeshStandardMaterial({color: 0x0000ff})

export class TileComponent extends Component {


    private mesh: Mesh


    constructor (
    ) {
        super("TileComponent");

        this.mesh = new Mesh(TILE_GEOMETRY, TILE_MATERIAL)
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
