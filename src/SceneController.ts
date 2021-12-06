import {Camera} from "three";
import {SceneManager} from "./SceneManager";

export interface ISceneController {

    createCamera(): Camera

    initialize(sceneManager: SceneManager): void

    dispose(): void

}