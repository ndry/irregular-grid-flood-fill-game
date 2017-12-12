import { BodyEntity } from "../world/entities";
import { adjust } from "../utils/misc";

export interface IBodyView {
    entity: BodyEntity;
    mesh: BABYLON.Mesh;
    actionManager: BABYLON.ActionManager;
    refresh(): void;
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

        material = adjust(new BABYLON.StandardMaterial("", env.scene), material => {
            const color = this.entity.owner
                ? this.entity.owner.color
                : this.entity.originalColor.color;
            material.diffuseColor = BABYLON.Color3.FromHexString(color);
        });

        mesh = adjust(BABYLON.MeshBuilder.CreateDisc("", {
            radius: this.entity.radius,
        }, env.scene), mesh => {
            mesh.position.set(this.entity.position.x, this.entity.position.y, 0);
            mesh.material = this.material;
            mesh.outlineColor = new BABYLON.Color3(0, 0, 1);
            mesh.outlineWidth = 1;
        });

        actionManager = this.mesh.actionManager = new BABYLON.ActionManager(env.scene);

        refresh(): void {
            const color = this.entity.owner
                ? this.entity.owner.color
                : this.entity.previewOwner
                    ? this.entity.previewOwner.color
                    : this.entity.originalColor.color;
            this.material.diffuseColor = BABYLON.Color3.FromHexString(color);
        }
    };
}
