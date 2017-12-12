import { BodyEntity } from "./world/entities";
import { WorldController } from "./world/WorldController";
import { adjust } from "./utils/misc";
import { BodyViewCtor } from "./view/BodyView";
import { MainViewCtor } from "./view/MainView";
import { MainGuiViewCtor } from "./view/MainGuiView";

export function createControllerClass(env: {
    MainView: MainViewCtor;
    MainGuiView: MainGuiViewCtor;
    BodyView: BodyViewCtor;
}) {
    return class {
        constructor(
            private worldController: WorldController,
        ) {

        }

        mainView = new env.MainView(this.worldController.worldEntity);
        mainGuiView = new env.MainGuiView(this.worldController.worldEntity);

        bodyViews = [...this.worldController.worldEntity.bodies].map(body => {
            return adjust(new env.BodyView(body), view => {
                view.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
                    BABYLON.ActionManager.OnPointerOverTrigger,
                    evt => {
                        view.mesh.renderOutline = true;
                        if (!view.entity.owner) {
                            this.worldController.previewTurn(view.entity.originalColor);
                            this.refresh();
                        }
                    }));
                view.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
                    BABYLON.ActionManager.OnPointerOutTrigger,
                    evt => {
                        view.mesh.renderOutline = false;
                        this.worldController.clearPreviewTurn();
                        this.refresh();
                    }));
                view.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
                    BABYLON.ActionManager.OnPickTrigger,
                    evt => {
                        // todo make turn
                    }));
            });
        });

        refresh() {
            for (const view of this.bodyViews) {
                view.refresh();
            }
        }
    };
}
