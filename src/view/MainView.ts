import { WorldEntity } from "../world/entities";
import { adjust } from "../utils/misc";

export interface IMainView {
    entity: WorldEntity;
    camera: BABYLON.Camera;
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

        camera = adjust(new BABYLON.TargetCamera(
            "",
            new BABYLON.Vector3(
                (this.entity.rect.maxX + this.entity.rect.minX) / 2,
                (this.entity.rect.maxY + this.entity.rect.minY) / 2,
                -1),
            env.scene,
        ), camera => {
            camera.setTarget(new BABYLON.Vector3(camera.position.x, camera.position.y, 0));
            camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;

            const worldWidth = this.entity.rect.maxX - this.entity.rect.minX;
            const worldHeight = this.entity.rect.maxY - this.entity.rect.minY;
            const worldRatio = worldWidth / worldHeight;

            const renderWidth = env.scene.getEngine().getRenderWidth();
            const renderHeight = env.scene.getEngine().getRenderHeight();
            const renderRatio = renderWidth / renderHeight;

            const ratio = renderRatio / worldRatio;
            const scale = Math.max(1 / ratio, 1);

            camera.orthoTop = scale * this.entity.rect.maxY;
            camera.orthoBottom = scale * this.entity.rect.minY;
            camera.orthoLeft = scale * ratio * this.entity.rect.minX;
            camera.orthoRight = scale * ratio * this.entity.rect.maxX;
            env.scene.activeCamera = camera;
        });

        // light1 = new BABYLON.PointLight("", new BABYLON.Vector3(0, 10, 0), env.scene);
        light = new BABYLON.DirectionalLight("", new BABYLON.Vector3(1, 1, 1), env.scene);
    };
}
