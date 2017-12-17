import { BodyEntity, WorldEntity } from "../world/entities";
import { adjust } from "../utils/misc";

export interface IBodyView {
    entity: BodyEntity;
    mesh: BABYLON.Mesh;
    outlineMaterial: BABYLON.StandardMaterial;
    outline: BABYLON.Mesh;
    actionManager: BABYLON.ActionManager;
    refresh(): void;
}

export type BodyViewCtor = new (entity: BodyEntity, worldEntity: WorldEntity) => IBodyView;

export function createBodyViewClass(env: {
    scene: BABYLON.Scene;
}): BodyViewCtor {
    return class implements IBodyView {
        constructor(
            public entity: BodyEntity,
            public worldEntity: WorldEntity,
        ) {
        }

        outlineMaterial = adjust(new BABYLON.StandardMaterial("", env.scene), material => {
            material.diffuseColor = BABYLON.Color3.FromHexString("#000000");
        });

        outline = adjust(BABYLON.MeshBuilder.CreateDisc("", {
            radius: this.entity.radius + 1,
        }, env.scene), mesh => {
            mesh.position.set(this.entity.position.x, this.entity.position.y, .1);
            mesh.material = this.outlineMaterial;
        });

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

        connections = [...this.entity.neighbours].map(n => BABYLON.MeshBuilder.CreateLines("", {
            points: [
                new BABYLON.Vector3(this.entity.position.x, this.entity.position.y, 1),
                new BABYLON.Vector3(n.position.x, n.position.y, 1),
            ],
            updatable: false,
            instance: null,
            colors: [
                new BABYLON.Color4(0, 0, 0),
                new BABYLON.Color4(0, 0, 0),
            ],
        }, env.scene));

        actionManager = this.mesh.actionManager = new BABYLON.ActionManager(env.scene);

        refresh(): void {
            const color = this.entity.owner
                ? this.entity.owner.color
                : this.entity.previewOwner
                    ? this.entity.previewOwner.color
                    : this.entity.originalColor.color;
            this.material.diffuseColor = BABYLON.Color3.FromHexString(color);

            const outlineColor = this.entity.highlighted
                ? this.worldEntity.players[this.worldEntity.currentPlayerIndex].color
                : "#000000";
            this.outlineMaterial.diffuseColor = BABYLON.Color3.FromHexString(outlineColor);
        }
    };
}
