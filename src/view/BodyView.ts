import { BodyEntity } from "../world/entities";
import { adjust } from "../utils/misc";

export interface IBodyView {
    entity: BodyEntity;
    mesh: BABYLON.Mesh;
    actionManager: BABYLON.ActionManager;
}

export type BodyViewCtor = new (entity: BodyEntity) => IBodyView;

export function createBodyViewClass(env: {
    scene: BABYLON.Scene;
}): BodyViewCtor {
    return class implements IBodyView {
        constructor(
            public entity: BodyEntity,
        ) {
        }

        mesh = adjust(BABYLON.MeshBuilder.CreateDisc("", {
            radius: this.entity.radius,
        }, env.scene), mesh => {
            mesh.position.set(this.entity.position.x, this.entity.position.y, 0);
            mesh.material = adjust(new BABYLON.StandardMaterial("", env.scene), material => {
                material.diffuseColor = BABYLON.Color3.FromHexString(this.entity.originalColor.color);
            });
            mesh.outlineColor = new BABYLON.Color3(0, 0, 1);
            mesh.outlineWidth = 1;
        });

        actionManager = this.mesh.actionManager = new BABYLON.ActionManager(env.scene);
    };
}
