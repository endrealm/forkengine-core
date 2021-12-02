import { Component } from "../Component";

export class TestComponent extends Component {
    constructor() {
        super("TestComponent");
    }

    update(delta: number) {
        this.transform.rotation.x += 1 * delta;
        this.transform.rotation.y += 1 * delta;
        this.getGameObject().setMouseHandlerNeedsUpdate(true)
    }
}