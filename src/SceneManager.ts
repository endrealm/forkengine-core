import {
    Camera,
    Scene
} from 'three';
import { GameObject } from './GameObject';
import {SceneConfig} from "./Config";
import {ISceneController} from "./SceneController";
import {MouseEventHandler} from "./MouseEventHandler";

enum State {
    PRE_INIT,
    RUNNING,
    STOPPED
}

export class SceneManager {

    private scene = new Scene();
    private gameObjects: GameObject[] = []
    private state = State.PRE_INIT;

    private camera: {cameraRef?: Camera} = {}

    private mouseEventHandler: {mouseHandlerRef?: MouseEventHandler} = {}

    private readonly config: SceneConfig;


    constructor(private readonly sceneController: ISceneController) {
        this.config = new SceneConfig(this.camera, this.mouseEventHandler)
        this.updateSceneRender = this.updateSceneRender.bind(this);
    }

    public initScene() {

        if(this.state === State.PRE_INIT) {
            this.sceneController.initialize(this)

            this.camera.cameraRef = this.sceneController.createCamera()
        }

        this.config.update()

        this.runSafeLoop(gameObject => gameObject.start())
        this.state = State.RUNNING;
        requestAnimationFrame(this.updateSceneRender);
    }

    addGameObject<T extends GameObject>(gameObject: T): T {

        if(this.gameObjects.includes(gameObject)) {
            console.warn("Attempted to add game object that is already in the scene")
            return gameObject;
        }

        if(gameObject["scene"]) {
            throw new Error("Tried adding object that is already in another scene");
        }


        gameObject["scene"] = this;
        this.scene.add(gameObject.group)
        this.gameObjects.push(gameObject);
        if(this.isRunning()) {
            gameObject.start()
        }
        return gameObject;
    }

    removeGameObject(gameObject: GameObject) {
        const index = this.gameObjects.indexOf(gameObject);
        if(index < 0) {
            console.warn("Attempted to remove game object that isnt in the scene")
            return;
        }
        
        this.gameObjects.splice(index, 1)
        if(this.isRunning()) {
            gameObject.stop()
        }
        gameObject["scene"] = undefined;
    }

    private then = 0;

    private updateSceneRender(now: number) {
        if(this.state !== State.RUNNING) return;
        now *= 0.001;  // convert to seconds
        const deltaTime = now - this.then;
        this.then = now;

        // Break render loop if stopped rendering
        requestAnimationFrame(this.updateSceneRender);

        this.runSafeLoop(gameObject => gameObject.preUpdate(deltaTime))
        this.runSafeLoop(gameObject => gameObject.update(deltaTime))
        this.runSafeLoop(gameObject => gameObject.postUpdate(deltaTime))
        
    }

    public shutdown() {
        this.state = State.STOPPED;
        this.runSafeLoop(gameObject => gameObject.stop())

        this.config.dispose()
    }

    private runSafeLoop(callback: (gameObject: GameObject) => any) {
        this.gameObjects.forEach(gameObject => {
            try {
                callback(gameObject);
            } catch (error) {
                // @ts-ignore
                console.error(error.message)
            }
        })
    }

    public isRunning() {
        return this.state === State.RUNNING
    }

    public getActiveScene() {
        return this.scene;
    }

    public getCamera() {
        return this.camera.cameraRef
    }

    public getConfig() {
        return this.config
    }


    public setEnableMouseEvents(mouseEvents: boolean) {
        if(mouseEvents) {
            this.mouseEventHandler.mouseHandlerRef = new MouseEventHandler(this.camera, this.sceneController.createCamera, this.config)
        } else {
            this.mouseEventHandler.mouseHandlerRef = undefined
        }
    }

    public mouseEventsEnabled(): boolean {
        return !!(this.mouseEventHandler.mouseHandlerRef)
    }

    public getMouseEventHandler() {
        return this.mouseEventHandler.mouseHandlerRef
    }

}