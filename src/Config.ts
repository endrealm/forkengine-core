import {BehaviorSubject, IDisposable, Observable, Subject } from "rx";
import {Camera, OrthographicCamera, PerspectiveCamera} from "three";


export type DimensionsType = {
    width: number,
    height: number
}


export class SceneConfig {

    // config subscriptions
    private dimensionsSubscription?: IDisposable
    private dimensions?: BehaviorSubject<DimensionsType>

    private clickSubscription?: IDisposable


    constructor(private readonly camera: {cameraRef?: Camera}) {

    }



    update() {
        if(this.dimensions)
            this.setCameraAspectRatio(this.dimensions.getValue())
    }


    setDimensions(dimensions: BehaviorSubject<DimensionsType>) {
        this.dimensions = dimensions
        if(this.dimensionsSubscription) this.dimensionsSubscription.dispose()

        this.dimensionsSubscription = dimensions.subscribe(this.setCameraAspectRatio)
    }

    getDimensions() {
        return this.dimensions?.getValue()
    }

    private setCameraAspectRatio = (dim: DimensionsType) => {
        const camera = this.camera.cameraRef
        if(!camera) return

        // add other camera types??
        if(camera instanceof PerspectiveCamera) {
            camera.aspect = dim.width / dim.height
            camera.updateProjectionMatrix()
        }
        if(camera instanceof OrthographicCamera) {
            camera.left = dim.width / -2
            camera.right = dim.width / 2
            camera.top = dim.height / 2
            camera.bottom = dim.height / -2
            camera.updateProjectionMatrix()
        }
    }



    // TODO inputs...


    dispose() {
        this.dimensionsSubscription?.dispose()
        this.clickSubscription?.dispose()
    }

}
