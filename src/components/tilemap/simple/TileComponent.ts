import {Component} from "../../../Component";
import {
    BoxGeometry, BufferAttribute,
    BufferGeometry,
    Mesh,
    MeshBasicMaterial,
    MeshStandardMaterial,
    PlaneBufferGeometry,
    Texture
} from "three";
import {Geometry} from "three/examples/jsm/deprecated/Geometry";
import {BehaviorSubject, IDisposable} from "rx";
import {ITextureAtlas, TilemapState} from "./TilemapComponent";
import {Vector2D} from "../../../util/Vector";


const TILE_TEXTURE_MATERIAL = (texture: Texture) => new MeshBasicMaterial({
    color: 0xffffff,
    map: texture,
})

const TILE_FILL_MATERIAL = new MeshBasicMaterial({
    color: 0xff0000,
})

export class TileComponent extends Component {


    private readonly geometry: BufferGeometry
    private readonly mesh: Mesh
    private readonly subscription: IDisposable

    private currentTextureAtlas?: ITextureAtlas
    private currentIndex?: number

    constructor (   private readonly state: BehaviorSubject<TilemapState>,
                    private readonly positionX: number,
                    private readonly positionY: number,
                    private readonly tileSizeX: number = 50,
                    private readonly tileSizeY: number = 50) {
        super("TileComponent");

        // use one width and height segment so its easier overwriting the uvs
        this.geometry = new PlaneBufferGeometry(tileSizeX, tileSizeY, 1, 1);

        this.mesh = new Mesh(this.geometry, TILE_FILL_MATERIAL)
        this.updateTexture(state.getValue())
        this.subscription = state.subscribe(this.updateTexture)
    }


    start() {
        super.start();
        this.getGameObject().group.add(this.mesh)
        this.getGameObject().setMouseHandlerNeedsUpdate(true)
    }

    stop() {
        super.stop()


    }


    private updateTexture(newState: TilemapState) {
        let textureAtlas;
        let index;
        if(newState[this.positionX] && newState[this.positionX][this.positionY]) {
            textureAtlas = newState[this.positionX][this.positionY].textureAtlas
            index = newState[this.positionX][this.positionY].index
        } else {
            textureAtlas = undefined
            index = undefined
        }

        if(this.currentTextureAtlas !== textureAtlas || this.currentIndex !== index) {
            if(textureAtlas && index !== undefined) {
                this.mesh.material = TILE_TEXTURE_MATERIAL(textureAtlas.getTexture())

                const tile = textureAtlas.getTilePos(index)

                const uv0 = textureAtlas.getUVCoords(tile, new Vector2D(0, 1))
                const uv1 = textureAtlas.getUVCoords(tile, new Vector2D(1, 1))
                const uv2 = textureAtlas.getUVCoords(tile, new Vector2D(0, 0))
                const uv3 = textureAtlas.getUVCoords(tile, new Vector2D(1, 0))

                const quad_uvs =
                    [
                        uv0.getX, uv0.getY,
                        uv1.getX, uv1.getY,
                        uv2.getX, uv2.getY,
                        uv3.getX, uv3.getY
                    ];
                const uvs = new Float32Array( quad_uvs);
                this.geometry.setAttribute( 'uv', new BufferAttribute( uvs, 2 ) );
            } else {
                this.mesh.material = TILE_FILL_MATERIAL
            }

            this.currentIndex = index
            this.currentTextureAtlas = textureAtlas
        }
    }

}
