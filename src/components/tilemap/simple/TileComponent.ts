import {Component} from "../../../Component";
import {
    BoxGeometry, BufferAttribute,
    BufferGeometry, Color, Material,
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
import {SkeletonUtils} from "three/examples/jsm/utils/SkeletonUtils";


const TILE_TEXTURE_MATERIAL = (texture: Texture) => new MeshBasicMaterial({
    color: 0xffffff,
    map: texture,
    transparent: true,
})

const TILE_FILL_MATERIAL = new MeshBasicMaterial({
    color: 0xffffff,
    transparent: true
})

export class TileComponent extends Component {


    private mesh: Mesh | undefined;
    private readonly subscription: IDisposable

    private currentTextureAtlas: ITextureAtlas | undefined
    private currentIndex: number | undefined

    constructor (   private readonly state: BehaviorSubject<TilemapState>,
                    private readonly positionX: number,
                    private readonly positionY: number,
                    private readonly tileSizeX: number = 50,
                    private readonly tileSizeY: number = 50) {
        super("TileComponent");

        delete this.mesh;
        delete this.currentTextureAtlas;
        delete this.currentIndex;
        this.subscription = state.subscribe(this.updateTexture)
    }


    start() {
        super.start();
        this.updateTexture(this.state.getValue())
    }

    stop() {
        super.stop()
    }

    private createMeshInstance() {
        if(!this.mesh) {
            // use one width and height segment so its easier overwriting the uvs
            const geometry = new PlaneBufferGeometry(this.tileSizeX, this.tileSizeY, 1, 1);
            this.mesh = new Mesh(geometry)
            this.getGameObject().group.add(this.mesh)
        }
    }

    private deleteMeshInstance() {
        if(this.mesh) {
            this.getGameObject().group.remove(this.mesh);
            delete this.mesh;
        }
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
                this.createMeshInstance();

                this.mesh!.material = TILE_TEXTURE_MATERIAL(textureAtlas.getTexture())

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
                this.mesh!.geometry.setAttribute( 'uv', new BufferAttribute( uvs, 2 ) );

                this.currentIndex = index
                this.currentTextureAtlas = textureAtlas
            } else {
                this.deleteMeshInstance();

                delete this.currentIndex;
                delete this.currentTextureAtlas;
            }
        }
    }


    setColor(color: Color) {
        if(!this.mesh) return;
        (this.mesh.material as MeshBasicMaterial).color = color;
    }

}
