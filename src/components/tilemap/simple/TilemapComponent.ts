import {Component} from "../../../Component";
import {TileComponent} from "./TileComponent";
import {GameObject} from "../../../GameObject";

export class TilemapComponent extends Component {

    public readonly tileMatrix: TileComponent[][] = [];

    constructor (
        private readonly width: number,
        private readonly height: number,
    ) {
        super("TilemapComponent");
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
                const tile = new TileComponent();
                this.getGameObject().getScene().addGameObject(new GameObject())
                    .addComponent(tile)
                row.push(tile)
            }
        }
    }

}
