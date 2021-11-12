import {
    BoxGeometry,
    Camera,
    HemisphereLight,
    Mesh,
    MeshBasicMaterial,
    MeshStandardMaterial,
    PerspectiveCamera,
    Scene
} from 'three';
import { GameObject } from './GameObject';
import { MeshComponent } from './components/MeshComponent';
import { AmbientLightComponent, HemisphereLightComponent, PointLightComponent } from './components/LightComponent';
import { TestComponent } from './components/TestComponent';

enum State {
    PRE_INIT,
    RUNNING,
    STOPPED
}

export class SceneManager {
    private scene = new Scene();
    private gameObjects: GameObject[] = []
    private state = State.PRE_INIT;

    private camera!: Camera

    constructor() {
        this.updateSceneRender = this.updateSceneRender.bind(this);
    }

    public initScene() {

        if(this.state === State.PRE_INIT) {
            // Sample setup code
            const light = this.addGameObject(new GameObject())
                .addComponent(new HemisphereLightComponent(0xffffbb, 0x080820, .6))
                .addComponent(new AmbientLightComponent(0xffffff, .3))
                .addComponent(new PointLightComponent(0xffffff, 1))
            light.transform.position.y = 3;

            const box2 = this.addGameObject(new GameObject())
                .addComponent(new MeshComponent(new BoxGeometry(1, 1, 1), new MeshStandardMaterial({color: 0x00ff00})))
                .addComponent(new TestComponent())
            // Sample setup code

            // set camera to correct size
            this.camera = new PerspectiveCamera(75, 16/9, 0.1, 1000);

            // assign starting position for camera
            this.camera.position.z = 2;
            this.camera.position.y = .5;
        }


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
        return this.camera
    }
}