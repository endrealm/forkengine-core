import {Component} from "../Component";

const NOT_REGISTERED = -1



export abstract class MouseInteractableComponent extends Component {

    private id: number = NOT_REGISTERED

    protected constructor() {
        super("MouseInteractableComponent");
    }

    start() {
        this.id = this.getEventHandler().registerGameObject(this)
    }

    stop() {
        this.getEventHandler().removeGameObject(this.id)
        this.id = NOT_REGISTERED
    }

    allowComponentAdd(other: Component) {
        return other.typeName !== this.typeName;
    }

    getId(): number {
        return this.id
    }


    /*
     * overwrite this
     */
    onHoverStart() {

    }

    /*
     * overwrite this
     */
    onHoverEnd() {

    }

    /*
     * overwrite this
     */
    onClick() {

    }


    private getEventHandler() {
        const handler = this.getGameObject().getScene().getMouseEventHandler()
        if(!handler) throw new Error("Mouse interactable component cant find initialized MouseEventHandler")
        return handler
    }

}