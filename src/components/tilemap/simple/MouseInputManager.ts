
import {IDisposable} from "rx";
import {Component} from "../../../Component";
import {Tile} from "./Tile";
import {Vector2D} from "../../../util/Vector";



export class TilemapMouseInputManager extends Component {


    private clickSubscription?: IDisposable;
    private currentlyHoveredTiles: Tile[] = []

    constructor(private readonly getHitTilesAt: (position: Vector2D) => Tile[],
                private readonly handleClicks: boolean = false) {
        super("MouseInputManagerComponent");
    }


    start() {
        super.start();

        this.setHandleClicks(this.handleClicks)
    }

    stop() {
        super.stop();

        if(this.clickSubscription)
            this.clickSubscription.dispose();
    }

    private setHandleClicks(clicks: boolean) {
        if(this.clickSubscription) this.clickSubscription.dispose();

        if(clicks) {
            this.clickSubscription = this.getGameObject().getScene().getIOAdapter().click.subscribe((event) => {
                if(!(event.type === "LEFT" || event.type === "TOUCH")) return;

                this.getHitTilesAt(new Vector2D(event.x, event.y)).forEach(tile => tile.onClick())
            })
        } else {
            this.clickSubscription = undefined;
        }
    }

    update(delta: number) {
        super.update(delta);

        const mousePos = this.getGameObject().getScene().getIOAdapter().getMousePosition();

        let newHoveredTiles: Tile[] = []
        if(mousePos) {
            newHoveredTiles = this.getHitTilesAt(mousePos);
        }

        this.currentlyHoveredTiles.filter(tile => {
            for (const newHoveredTile of newHoveredTiles) {
                if(tile.x === newHoveredTile.x && tile.y === newHoveredTile.y) return false;
            }
            return true;
        }).forEach(tile => tile.onHoverEnd())

        newHoveredTiles.filter(tile => {
            for (const currentHoveredTile of this.currentlyHoveredTiles) {
                if(tile.x === currentHoveredTile.x && tile.y === currentHoveredTile.y) return false;
            }
            return true;
        }).forEach(tile => tile.onHoverStart())

        this.currentlyHoveredTiles = newHoveredTiles;
    }

}