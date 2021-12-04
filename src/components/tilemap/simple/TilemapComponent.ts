import {Component} from "../../../Component";
import {TileComponent} from "./TileComponent";
import {GameObject} from "../../../GameObject";
import {BufferGeometry, PlaneBufferGeometry, Vector3} from "three";

export class TilemapComponent extends Component {

    public readonly tileMatrix: TileComponent[][] = [];

    private readonly tileGeometry: BufferGeometry


    constructor (
        private readonly width: number,
        private readonly height: number,
        private readonly tileSizeX: number = 100,
        private readonly tileSizeY: number = 100
    ) {
        super("TilemapComponent");

        this.tileGeometry = new PlaneBufferGeometry(tileSizeX, tileSizeY);
    }

    prestart() {
        this.generateTiles()
    }

    start() {

    }

    private generateTiles() {

        for (let x = 0; x < this.width; x++) {
            const row: TileComponent[] = [];
            this.tileMatrix.push(row)

            for (let y = 0; y < this.height; y++) {
                const tile = new TileComponent(this.tileGeometry);
                this.getGameObject().getScene().addGameObject(new GameObject())
                    .addComponent(tile)
                    .transform.position.set(x * this.tileSizeX, -y * this.tileSizeY, 0)
                row.push(tile)
            }
        }
    }

}
