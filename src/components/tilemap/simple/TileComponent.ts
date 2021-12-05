import {Component} from "../../../Component";
import {
    BoxGeometry,
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


const TILE_TEXTURE_MATERIAL = (texture: Texture) => new MeshBasicMaterial({
    color: 0xffffff,
    map: texture,
})

const TILE_FILL_MATERIAL = new MeshBasicMaterial({
    color: 0xff0000,
})

export class TileComponent extends Component {


    private readonly mesh: Mesh
    private readonly subscription: IDisposable

    private currentTextureAtlas?: ITextureAtlas
    private currentIndex?: number

    constructor (  private readonly geometry: BufferGeometry,
                    private readonly state: BehaviorSubject<TilemapState>,
                    private readonly positionX: number,
                    private readonly positionY: number) {
        super("TileComponent");

        this.mesh = new Mesh(geometry, TILE_FILL_MATERIAL)
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
            if(textureAtlas && index !== undefined)
                this.mesh.material = TILE_TEXTURE_MATERIAL(textureAtlas.getTextureById(index))
            else
                this.mesh.material = TILE_FILL_MATERIAL

            this.currentIndex = index
            this.currentTextureAtlas = textureAtlas
        }
    }

}
