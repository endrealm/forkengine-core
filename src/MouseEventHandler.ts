import {
    Camera,
    Color,
    Group,
    Material,
    Mesh,
    MeshPhongMaterial,
    NoBlending, Object3D,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
    WebGLRenderTarget
} from "three";
import {MouseInteractableComponent} from "./components/MouseInteractableComponent";
import {GameObject} from "./GameObject";
import {SceneConfig} from "./Config";


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
    private camera: Camera

    private readonly objectStore: ObjectStore = {}

    // used to track which events need to be called
    private latestInteractableComponent: MouseInteractableComponent | undefined


    constructor(private readonly mainCamera: {cameraRef?: Camera},
                private readonly createCamera: () => Camera,
                private readonly config: SceneConfig) {
        this.mouseDetectionScene.background = new Color(0, 0, 0)

        this.camera = createCamera()
    }


    public registerGameObject(component: MouseInteractableComponent): number {
        const id = this.idCounter++

        // TODO subscribe to game object group changes!
        const group = this.createGroup(component.getGameObject(), id)
        component.getGameObject().setMouseHandlerNeedsUpdate(false)
        this.updateObjectTransform(group, component.getGameObject().group)
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
        this.updateObjectTransform(group, gameObject.group)
        return group
    }

    private updateObjectTransform(to: Object3D, from: Object3D) {
        to.position.x = from.position.x
        to.position.y = from.position.y
        to.position.z = from.position.z

        to.rotation.x = from.rotation.x
        to.rotation.y = from.rotation.y
        to.rotation.z = from.rotation.z

        to.scale.x = from.scale.x
        to.scale.y = from.scale.y
        to.scale.z = from.scale.z
    }

    private updateCameraTransform() {
        if(!this.mainCamera.cameraRef) throw new Error("Main camera not initialized")
        this.updateObjectTransform(this.camera, this.mainCamera.cameraRef)
    }

    private updateAllObjectsTransformations() {
        for (let objectStoreKey in this.objectStore) {
            if(!this.objectStore.hasOwnProperty(objectStoreKey)) continue

            const entry = this.objectStore[objectStoreKey]
            if(entry.component.getGameObject().mouseHandlerUpdateNeeded()) {
                this.mouseDetectionScene.remove(entry.object)
                entry.object = this.createGroup(entry.component.getGameObject(), Number.parseInt(objectStoreKey))
                entry.component.getGameObject().setMouseHandlerNeedsUpdate(false)
                this.mouseDetectionScene.add(entry.object)
            }
        }
    }

    clear() {
        this.latest = false

        this.latestInteractableComponent?.onHoverEnd()
        this.latestInteractableComponent = undefined
    }

    isRendered(): boolean {
        return this.latest
    }



    // RENDERING --------------------------------------

    private prepareCamera(renderer: WebGLRenderer, mousePosition: {x: number, y: number}) {
        const dimensions = this.config.getDimensions()
        if(!dimensions) throw new Error("Cannot read dimensions")

        if(this.camera instanceof PerspectiveCamera) {
            this.camera.setViewOffset(
                dimensions.width,   // full width
                dimensions.height,  // full top
                mousePosition.x | 0,             // rect x
                mousePosition.y | 0,             // rect y
                1,                                          // rect width
                1,                                          // rect height
            );
        } else {
            throw new Error("This camera type is not supported yet")
        }
    }

    private clearCamera() {
        if(this.camera instanceof PerspectiveCamera) {
            this.camera.clearViewOffset()
        } else {
            throw new Error("This camera type is not supported yet")
        }
    }

    render(renderer: WebGLRenderer, mousePosition: {x: number, y: number}) {
        this.updateCameraTransform()
        this.updateAllObjectsTransformations()

        this.prepareCamera(renderer, mousePosition)

        renderer.setRenderTarget(this.renderTarget)
        renderer.render(this.mouseDetectionScene, this.camera)
        renderer.setRenderTarget(null)

        renderer.readRenderTargetPixels(this.renderTarget, 0, 0, 1, 1, this.pixelBuffer)

        this.clearCamera()

        this.latest = true
    }

    // END RENDERING ----------------------------------------------------

    private pickIdAt(position: {x: number, y: number}): number {
        if(!this.latest) return -1

        return (this.pixelBuffer[0] << 16) |
            (this.pixelBuffer[1] << 8) |
            (this.pixelBuffer[2]);
    }

    pickAt(position: {x: number, y: number}): MouseInteractableComponent | undefined{
        const id = this.pickIdAt(position)
        const entry = this.objectStore[id]
        if(entry) return entry.component
    }

    updateHoverEvents(mousePosition: {x: number, y: number}) {
        const hovering = this.pickAt(mousePosition)
        if(hovering !== this.latestInteractableComponent) {
            this.latestInteractableComponent?.onHoverEnd()
            this.latestInteractableComponent = hovering
            this.latestInteractableComponent?.onHoverStart()
        }
    }

    onClick(position: {x: number, y: number}) {
        if(!this.latest) return

        const obj = this.pickAt(position)
        if(obj) obj.onClick()
    }

}