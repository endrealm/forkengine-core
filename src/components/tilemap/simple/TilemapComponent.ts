import {Component} from "../../../Component";
import {TileComponent} from "./TileComponent";
import {GameObject} from "../../../GameObject";
import {BufferGeometry, PlaneBufferGeometry, Texture, Vector3} from "three";
import {BehaviorSubject} from "rx";
import {Vector2D} from "../../../util/Vector";



export interface ITextureAtlas {

    getTexture(): Texture
    getUVCoords(tile: Vector2D, position: Vector2D): Vector2D
    getTilePos(index: number): Vector2D

}


export type TilemapState = {
    [x: number]: {
        [y: number]: {
            textureAtlas: ITextureAtlas,
            index: number
        }
    }
}


export class TilemapComponent extends Component {

    public readonly tileMatrix: TileComponent[][] = [];


    constructor (
        private readonly width: number,
        private readonly height: number,
        private readonly state: BehaviorSubject<TilemapState>,
        private readonly tileSizeX: number = 100,
        private readonly tileSizeY: number = 100,

        private readonly createTileComponents: (x: number, y: number) => Component[] = () => []

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
                const tile = new TileComponent(this.state, x, y, this.tileSizeX, this.tileSizeY);
                const tileObject = this.getGameObject().addChild(new GameObject())
                    .addComponent(tile);
                tileObject.transform.position.set(x * this.tileSizeX, y * this.tileSizeY, 0)
                this.createTileComponents(x, y).forEach(component => tileObject.addComponent(component))
                row.push(tile)
            }
        }
    }

}
