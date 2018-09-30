import { WorldEntity } from "../world/entities";
import { adjust } from "../utils/misc";

export interface IMainGuiView {
    entity: WorldEntity;
    root: BABYLON.GUI.AdvancedDynamicTexture;
    panel: BABYLON.GUI.StackPanel;
    fpsLabel: BABYLON.GUI.TextBlock;
    bodyCountLabel: BABYLON.GUI.TextBlock;
    populationLabel: BABYLON.GUI.TextBlock;
    pauseButton: BABYLON.GUI.Button;
    toggleGravityButton: BABYLON.GUI.Button;
    toggleWorldGuiButton: BABYLON.GUI.Button;
}

export type MainGuiViewCtor = new (entity: WorldEntity) => IMainGuiView;

export function createMainGuiViewClass(env: {
    scene: BABYLON.Scene;
}): MainGuiViewCtor {
    return class implements IMainGuiView {
        constructor(
            public entity: WorldEntity,
        ) {
        }

        root = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("", true, env.scene);

        panel = create(
            BABYLON.GUI.StackPanel,
            this.root,
            el => {
                el.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                el.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
                el.width = "200px";
            },
        );

        fpsLabel = create(
            BABYLON.GUI.TextBlock,
            this.panel,
            defaultTextBlockStyle,
        );

        bodyCountLabel = create(
            BABYLON.GUI.TextBlock,
            this.panel,
            defaultTextBlockStyle,
        );

        populationLabel = create(
            BABYLON.GUI.TextBlock,
            this.panel,
            defaultTextBlockStyle,
            t => {
                t.height = "100px";
                t.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            },
        );

        pauseButton = create(
            BABYLON.GUI.Button,
            this.panel,
            defaultButtonStyle,
            el => {
                create(BABYLON.GUI.TextBlock, el, el1 => {
                    el1.text = "Pause";
                });
            },
        );

        stepButton = create(
            BABYLON.GUI.Button,
            this.panel,
            defaultButtonStyle,
            el => {
                create(BABYLON.GUI.TextBlock, el, el1 => {
                    el1.text = "Step";
                });
            },
        );

        toggleGravityButton = create(
            BABYLON.GUI.Button,
            this.panel,
            defaultButtonStyle,
            el => {
                create(BABYLON.GUI.TextBlock, el, el1 => {
                    el1.text = "Toggle Gravity";
                });
            },
        );

        toggleWorldGuiButton = create(
            BABYLON.GUI.Button,
            this.panel,
            defaultButtonStyle,
            el => {
                create(BABYLON.GUI.TextBlock, el, el1 => {
                    el1.text = "Toggle World GUI";
                });
            },
        );
    };
}

function create<T extends BABYLON.GUI.Control>(
    constructor: new () => T,
    parent: BABYLON.GUI.Container | BABYLON.GUI.AdvancedDynamicTexture,
    ...applyStyles: Array<((el: T) => void)>
): T {
    return adjust(
        new constructor(),
        ...applyStyles,
        el => parent.addControl(el));
}

function defaultButtonStyle(el: BABYLON.GUI.Button) {
    el.width = "100%";
    el.height = "20px";
    el.color = "white";
    el.cornerRadius = 20;
    el.background = "green";
}

function defaultTextBlockStyle(el: BABYLON.GUI.TextBlock) {
    el.width = "100%";
    el.height = "20px";
    el.color = "white";
}
