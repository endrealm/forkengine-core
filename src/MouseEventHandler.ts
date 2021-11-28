import {
    Camera,
    Color,
    Group,
    Material,
    Mesh,
    MeshPhongMaterial,
    NoBlending,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
    WebGLRenderTarget
} from "three";
import {MouseInteractableComponent} from "./components/MouseInteractableComponent";
import {GameObject} from "./GameObject";


type ObjectStore = {
    [id: number]: {
        component: MouseInteractableComponent,
        object: Group
    }
}


export class MouseEventHandler {

    private idCounter: number = 1

    private mouseDetectionScene = new Scene()

    private latest: boolean = false
    private renderTarget = new WebGLRenderTarget(1, 1)
    private pixelBuffer = new Uint8Array(4)

    private readonly objectStore: ObjectStore = {}


    constructor() {
        this.mouseDetectionScene.background = new Color(0, 0, 0)
    }


    public registerGameObject(component: MouseInteractableComponent): number {
        const id = this.idCounter++

        // TODO subscribe to game object group changes!
        const group = this.createGroup(component.getGameObject(), id)
        this.updateObjectTransform(group, component.getGameObject())
        this.mouseDetectionScene.add(group)
        this.objectStore[id] = {
            component,
            object: group
        }

        return id;
    }

    public removeGameObject(id: number): void {
        const entry = this.objectStore[id]
        if(!entry)
            throw new Error("Trying to remove nonexistent object from MouseEventHandler object store")

        this.mouseDetectionScene.remove(entry.object)
        delete this.objectStore[id]
    }


    // TODO use custom shader instead
    private createMaterial(objectId: number): Material {
        return new MeshPhongMaterial({
            emissive: new Color(objectId),
            color: new Color(0, 0, 0),
            specular: new Color(0, 0, 0),
            transparent: true,
            alphaTest: 0.5,
            blending: NoBlending,
        })
    }

    private createMesh(mesh: Mesh, id: number): Mesh {
        const material = this.createMaterial(id)
        const geometry = mesh.geometry
        return new Mesh(geometry, material)
    }

    private createGroup(gameObject: GameObject, id: number): Group {
        const group = new Group()
        gameObject.group.traverse(obj => {
            if(obj instanceof Mesh) {
                group.add(this.createMesh(obj, id))
            }
        })
        return group
    }

    private updateObjectTransform(object: Group, gameObject: GameObject) {
        object.position.x = gameObject.transform.position.x
        object.position.y = gameObject.transform.position.y
        object.position.z = gameObject.transform.position.z

        object.rotation.x = gameObject.transform.rotation.x
        object.rotation.y = gameObject.transform.rotation.y
        object.rotation.z = gameObject.transform.rotation.z
    }

    clear() {
        this.latest = false
    }

    isRendered(): boolean {
        return this.latest
    }



    // RENDERING --------------------------------------

    private prepareCamera(renderer: WebGLRenderer, camera: Camera, mousePosition: {x: number, y: number}) {
        if(camera instanceof PerspectiveCamera) {
            // set the view offset to represent just a single pixel under the mouse
            const pixelRatio = renderer.getPixelRatio();
            camera.setViewOffset(
                renderer.getContext().drawingBufferWidth,   // full width
                renderer.getContext().drawingBufferHeight,  // full top
                mousePosition.x * pixelRatio | 0,             // rect x
                mousePosition.y * pixelRatio | 0,             // rect y
                1,                                          // rect width
                1,                                          // rect height
            );
        } else {
            throw new Error("This camera type is not supported yet")
        }
    }

    private clearCamera(camera: Camera) {
        if(camera instanceof PerspectiveCamera) {
            camera.clearViewOffset()
        } else {
            throw new Error("This camera type is not supported yet")
        }
    }

    render(renderer: WebGLRenderer, camera: Camera, mousePosition: {x: number, y: number}) {
        this.prepareCamera(renderer, camera, mousePosition)

        renderer.setRenderTarget(this.renderTarget)
        renderer.render(this.mouseDetectionScene, camera)
        renderer.setRenderTarget(null)

        renderer.readRenderTargetPixels(this.renderTarget, 0, 0, 1, 1, this.pixelBuffer)

        this.clearCamera(camera)

        this.latest = true
    }

    // END RENDERING ----------------------------------------------------

    pickIdAt(position: {x: number, y: number}): number {
        if(!this.latest) return -1

        return (this.pixelBuffer[0] << 16) |
            (this.pixelBuffer[1] << 8) |
            (this.pixelBuffer[2]);
    }

}