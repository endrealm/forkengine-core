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
    public group = new Group;
    public readonly transform: TransformComponent;

    constructor() {
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
            component.start()
        }
        return this;
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
                console.error(error.message)
            }
        })
    }
}