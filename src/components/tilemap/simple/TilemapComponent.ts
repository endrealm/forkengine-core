import {Component} from "../../../Component";
import {
    Mesh,
    ShaderMaterial,
    Texture, Vector3, Vector4,
} from "three";
import {BehaviorSubject, IDisposable} from "rx";
import {Vector2D} from "../../../util/Vector";
import {TilemapFragmentShader, TilemapVertexShader} from "./TilemapShader";
import {DEFAULT_TINT, TilemapGeometry} from "../../../geometry/TilemapGeometry";
import {Tile} from "./Tile";
import {TilemapTint} from "./TilemapTint";



export interface ITextureAtlas {

    getTexture(): Texture
    getDimension(): Vector2D
    getTilePos(index: number): Vector2D
    getUVCoords(tile: Vector2D, position: Vector2D): Vector2D

}


export type TilemapState = {
    tilesets: ITextureAtlas[],
    data: {
        [x: number]: {
            [y: number]: {
                index: number,
                tilesetIndex: number
            }
        }
    }
}


export type TintStorage = {
    [x: number]: {
        [y: number]: {
            tintID: number
        }
    }
}


export class TilemapComponent extends Component {


    private readonly mesh: Mesh;
    private readonly geometry: TilemapGeometry;
    private readonly material: ShaderMaterial;

    private readonly stateSubscription: IDisposable;

    private readonly tint: TintStorage = {}


    constructor (
        private readonly width: number,
        private readonly height: number,
        private readonly state: BehaviorSubject<TilemapState>,
        private readonly tileSizeX: number = 100,
        private readonly tileSizeY: number = 100,

        private readonly onTileClick: (tile: Tile) => void = () => undefined,
        private readonly onTileHoverStart: (tile: Tile) => void = () => undefined,
        private readonly onTileHoverEnd: (tile: Tile) => void = () => undefined,

        private readonly tints: (Vector3 | Vector4)[] = TilemapTint.DefaultColorPalette
    ) {
        super("TilemapComponent");

        this.geometry = this.generateGeometry(width, height, tileSizeX, tileSizeY);
        this.material = this.generateMaterial();
        this.mesh = new Mesh(this.geometry, this.material);

        this.stateSubscription = state.subscribe(change => {
            this.material.uniforms.tilesets = {value: change.tilesets.map(tileset => tileset.getTexture())}
            this.geometry.applyState(change);
        })
    }

    prestart() {

    }

    start() {
        this.getGameObject().group.add(this.mesh);
    }

    stop() {
        this.stateSubscription.dispose();
    }


    private generateGeometry(width: number, height: number, tileSizeX: number, tileSizeY: number): TilemapGeometry {
        const geometry = new TilemapGeometry(width, height, tileSizeX, tileSizeY)

        geometry.applyState(this.state.getValue());
        geometry.applyTint(this.tint);

        return geometry;
    }

    private generateMaterial(): ShaderMaterial {
        return new ShaderMaterial({
            uniforms: {
                tilesets: {value: this.state.getValue().tilesets.map(tileset => tileset.getTexture())},
                tints: {value: this.tints}
            },
            vertexShader: TilemapVertexShader,
            fragmentShader: TilemapFragmentShader,
            transparent: true
        })
    }


    getTile(x: number, y: number): Tile {
        return new Tile(x, y, this, this.onTileClick, this.onTileHoverStart, this.onTileHoverEnd, this.getTint.bind(this), this.setTint.bind(this));
    }

    /**
     * Takes x, y coordinates and returns the correct tile.
     * Assumes this tilemap is not rotated
     * Assumes this tilemap is only translated by its immediate game object
     * Assumes this tilemap is not scaled
     * @param x x coordinate
     * @param y y coordinate
     */
    getTileByCoordinates(x: number, y: number): Tile | undefined {
        const absolutePosition = new Vector2D(x, y).sub(Vector2D.fromVector3(this.getGameObject().transform.position));
        absolutePosition.div(new Vector2D(this.tileSizeX, this.tileSizeY));

        // out-of-bounds
        if(absolutePosition.getX > this.width || absolutePosition.getY > this.height || absolutePosition.getX < 0 || absolutePosition.getY < 0) return undefined;

        absolutePosition.divWithoutRemainder(new Vector2D(1, 1));

        return this.getTile(absolutePosition.getX, absolutePosition.getY);
    }


    private getTint(x: number, y: number): number {
        return this.tint[x] && this.tint[x][y] ? (this.tint[x][y].tintID|| DEFAULT_TINT) : DEFAULT_TINT
    }

    private setTint(x: number, y: number, tint: number) {
        if(!this.tint[x]) this.tint[x] = [];
        this.tint[x][y] = {tintID: tint}
        this.geometry.applyTint(this.tint);
    }

}
