import { Group } from "three";
import { Component } from "./Component";
import { TransformComponent } from "./components/TransformComponent";
import { SceneManager } from "./SceneManager";

enum State {
    STOPPED,
    RUNNING
}

export class GameObject {

    private components: Component[] = []
    private state = State.STOPPED;

    private scene?: SceneManager;
    public group: Group & {gameObject?: GameObject} = new Group;
    public readonly transform: TransformComponent;


    private readonly children: GameObject[] = []
    private parent: GameObject | null = null;


    /*
     *  used to track transformation updated by the mouse event handler.
     * if game object is not intendet to interact with mouse, this can be ignored
     */
    private mouseHandlerNeedsUpdate: boolean = true

    constructor() {
        this.group["gameObject"] = this;
        this.transform = new TransformComponent();
        this.addComponent(this.transform)
    }

    public getScene() {
        return this.scene!;
    }

    /**
     * Adds a component to the gameobject if not already added.
     * Will throw an error if component is already attached to another gameobject
     * @param component
     * @returns
     */
    public addComponent(component: Component) {

        if(this.components.includes(component)) {
            console.warn("Attempted to add component that is already attached")
            return this;
        }

        if(component["gameObject"]) {
            throw new Error("Attempted to add component that is already attached to a different gameobject")
        }

        for(const boundComponent of this.components) {
            let result = true;
            try {
                result = boundComponent.allowComponentAdd(component);
            } catch (error) {
                console.error(error)
            }

            if(!result) {
                throw new Error(`Component ${boundComponent.typeName} prevents adding component ${component.typeName}`)
            }
        }

        component["gameObject"] = this;
        this.components.push(component);
        if(this.state === State.RUNNING) {
            component.prestart()
            component.start()
        }
        return this;
    }

    getComponents<ComponentType extends Component>(typeName: string): ComponentType[] {
        return this.components.filter(component => component.typeName === typeName) as ComponentType[]
    }

    public prestart() {
        this.runSafeLoop(component => {
            component.prestart();
        })
    }

    public start() {
        this.state = State.RUNNING;

        // Run start in all components
        this.runSafeLoop(component => {
            component.start();
        })
    }

    public stop() {
        this.state = State.STOPPED;
        // Run stop in all components
        this.runSafeLoop(component => {
            component.stop();
        })
    }

    public preUpdate(delta: number) {
        // Run pre update in all components
        this.runSafeLoop(component => {
            component.preUpdate(delta);
        })
    }

    public update(delta: number) {

        // Run update in all components
        this.runSafeLoop(component => {
            component.update(delta);
        })
    }

    public postUpdate(delta: number) {
        // Run post update in all components
        this.runSafeLoop(component => {
            component.postUpdate(delta);
        })
    }

    private runSafeLoop(callback: (component: Component) => any) {
        this.components.forEach(component => {
            try {
                callback(component);
            } catch (error) {
                // @ts-ignore
                console.error(error.message)
            }
        })
    }

    public setParent(parent: GameObject | null) {
        if(this.parent === parent) return;
        if(this.parent) this.parent._removeChild(this)
        parent?._addChild(this)
        this._setParent(parent)
    }

    public addChild(child: GameObject): GameObject {
        if(child.parent === this) return child;
        if(child.parent) child.parent._removeChild(child)
        this._addChild(child)
        child._setParent(this)
        return child;
    }

    public removeChild(child: GameObject): GameObject {
        if(!this._removeChild(child)) return child; // wasn't a child
        child._setParent(null);
        return child;
    }

    private _setParent(parent: GameObject | null) {
        this.parent = parent;
        if(parent === null) {
            // Re-add to scene
            this.getScene().getActiveScene().add(this.group)
        }
    }
    private _addChild(child: GameObject) {
        const index = this.children.indexOf(child);
        if(index !== -1) return child;

        this.children.push(child)
        console.log("Added child")
        this.group.add(child.group)

        if(child.state === State.STOPPED) {
            child = this.getScene().addGameObject(child)
        }
    }
    private _removeChild(child: GameObject): boolean {
        const index = this.children.indexOf(child);
        if(index === -1) return false;
        this.children.splice(index, 1)
        this.group.remove(child.group)

        return true;
    }

    public getChildren(): GameObject[] {
        return this.children;
    }

    public destroy(): GameObject {
        this.getScene().removeGameObject(this)
        return this;
    }

    public getParent() {
        return this.parent;
    }
}
