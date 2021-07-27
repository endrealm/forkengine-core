import { Quaternion, Vector3 } from "three";
import { Component } from "../Component";

export class TransformComponent extends Component {

    private _position = new Vector3();
    private _rotation = new Quaternion();

    get position () {
        return this._position;
    }

    set position (value: Vector3) {
        this._position = value;
    }

    get worldPosition () {
        return this.position.clone();
    }

    set worldPosition (value: Vector3) {
        this.position = value;
    }

    get rotation () {
        return this._rotation;
    }

    set rotation (value: Quaternion) {
        this._rotation = value;
    }

    get worldRotation () {
        return this.rotation.clone();
    }

    set worldRotation (value: Quaternion) {
        this.rotation = value;
    }

    constructor() {
        super("TransformComponent");
    }

    allowComponentAdd(other: Component) {
        return other.typeName !== this.typeName;
    }

    postUpdate(delta: number) {
        let group = this.getGameObject().group;
        group.position.x = this.transform.position.x;
        group.position.y = this.transform.position.y;
        group.position.z = this.transform.position.z;

        group.rotation.x = this.transform.rotation.x;
        group.rotation.y = this.transform.rotation.y;
        group.rotation.z = this.transform.rotation.z;
    }
}