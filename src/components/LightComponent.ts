import { AmbientLight, ColorRepresentation, HemisphereLight, Light, PointLight } from "three";
import { Component } from "../Component";

export class LightComponent<T extends Light> extends Component {
    
    constructor(typeName: string, protected light: T) {
        super(typeName);
    }


    start() {
        this.getGameObject().group.add(this.light);
        this.getGameObject().setMouseHandlerNeedsUpdate(true)
    }
}

export class HemisphereLightComponent extends LightComponent<HemisphereLight> {

    constructor(skyColor?: ColorRepresentation | undefined, groundColor?: ColorRepresentation | undefined, intensity?: number | undefined) {
        super("HemisphereLightComponent", new HemisphereLight(skyColor, groundColor, intensity));
    }
}
export class AmbientLightComponent extends LightComponent<AmbientLight> {

    constructor(color?: ColorRepresentation | undefined, intensity?: number | undefined) {
        super("AmbientLightComponent", new AmbientLight(color, intensity));
    }
}
export class PointLightComponent extends LightComponent<PointLight> {

    constructor(color?: ColorRepresentation | undefined, intensity?: number | undefined, distance?: number | undefined, decay?: number | undefined) {
        super("PointLightComponent", new PointLight(color, intensity, distance, decay));
    }
}
