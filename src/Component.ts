import { GameObject } from "./GameObject";

export class Component {

    private gameObject!: GameObject;

    constructor(
        public readonly typeName: string
    ) {

    }

    public getGameObject() {
        return this.gameObject;
    }

    public prestart() {

    }

    public start() {
        // Run start in all components
    }

    public stop() {
        // Run stop in all components
    }

    public allowComponentAdd(component: Component): boolean {
        return true;
    }

    public preUpdate(delta: number) {
        // Run pre update in all components
    }

    public update(delta: number) {
        // Run update in all components
    }

    public postUpdate(delta: number) {
        // Run post update in all components
    }

    get transform () {
        return this.getGameObject().transform;
    }

}