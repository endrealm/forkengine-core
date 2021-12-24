import {Component} from "../../../Component";
import {
    BufferGeometry,
    Material,
    Mesh, MeshBasicMaterial,
    PlaneBufferGeometry,
    RawShaderMaterial,
    ShaderMaterial,
    Texture,
    Vector3
} from "three";
import {BehaviorSubject} from "rx";
import {Vector2D} from "../../../util/Vector";
import {TilemapFragmentShader, TilemapVertexShader} from "./TilemapShader";
import {TilemapGeometry} from "../../../geometry/TilemapGeometry";



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

export class TilemapComponent extends Component {


    private readonly mesh: Mesh;

    constructor (
        private readonly width: number,
        private readonly height: number,
        private readonly state: BehaviorSubject<TilemapState>,
        private readonly tileSizeX: number = 100,
        private readonly tileSizeY: number = 100,
    ) {
        super("TilemapComponent");

        this.mesh = new Mesh(this.generateGeometry(width, height, tileSizeX, tileSizeY), this.generateMaterial());
    }

    prestart() {

    }

    start() {
        this.getGameObject().group.add(this.mesh);
    }

    stop() {

    }


    private generateGeometry(width: number, height: number, tileSizeX: number, tileSizeY: number): BufferGeometry {
        const geometry = new TilemapGeometry(width, height, tileSizeX, tileSizeY)

        geometry.applyState(this.state.getValue());

        return geometry;
    }

    private generateMaterial(): Material {
        /* return new MeshBasicMaterial({
            wireframe: true,
            color: 0x000000
        }) */
        return new ShaderMaterial({
            uniforms: {
                tileset: {value: this.state.getValue().tilesets[0].getTexture()}
            },
            vertexShader: TilemapVertexShader,
            fragmentShader: TilemapFragmentShader,
        })
    }

}
