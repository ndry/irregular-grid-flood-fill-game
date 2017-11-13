import { WorldEntity } from "../world/entities";
import { adjust } from "../utils/misc";

export interface IMainView {
    entity: WorldEntity;
    camera: BABYLON.ArcRotateCamera;
    light: BABYLON.DirectionalLight;
}

export type MainViewCtor = new (entity: WorldEntity) => IMainView;

export function createMainViewClass(env: {
    scene: BABYLON.Scene;
}): MainViewCtor {
    return class implements IMainView {
        constructor(
            public entity: WorldEntity,
        ) {
        }

        camera = adjust(new BABYLON.ArcRotateCamera(
            "",
            -Math.PI / 2, 0, 100,
            new BABYLON.Vector3(0, 0, 0),
            env.scene,
        ), camera => {
            camera.lowerRadiusLimit = 2;
            camera.upperRadiusLimit = 50000;
            camera.attachControl(env.scene.getEngine().getRenderingCanvas()!, false);
        });

        // light1 = new BABYLON.PointLight("", new BABYLON.Vector3(0, 10, 0), env.scene);
        light = new BABYLON.DirectionalLight("", new BABYLON.Vector3(1, 1, 1), env.scene);
    };
}
