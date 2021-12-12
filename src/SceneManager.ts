import {
    Camera,
    Scene
} from 'three';
import { GameObject } from './GameObject';
import {IOAdapter} from "./IOAdapter";
import {ISceneController} from "./SceneController";


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

    private readonly ioAdapter: IOAdapter;


    constructor(private readonly sceneController: ISceneController) {
        this.ioAdapter = new IOAdapter(this.camera)
        this.updateSceneRender = this.updateSceneRender.bind(this);
    }

    public initScene() {

        if(this.state === State.PRE_INIT) {
            this.sceneController.initialize(this)

            this.camera.cameraRef = this.sceneController.createCamera()
        }

        this.ioAdapter.update()

        this.runSafeLoop(gameObject => gameObject.prestart())
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
        if(!gameObject.getParent()) {
            this.scene.add(gameObject.group)
        }
        this.gameObjects.push(gameObject);
        if(this.isRunning( )) {
            gameObject.prestart()
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
        gameObject.setParent(null)
        gameObject["scene"] = undefined;
        this.scene.remove(gameObject.group) // remove if present
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

        this.ioAdapter.dispose()
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

    public getIOAdapter() {
        return this.ioAdapter
    }

}
