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
        // mainGuiView = new env.MainGuiView(this.worldController.worldEntity);

        bodyViews = [...this.worldController.worldEntity.bodies].map(body => {
            return adjust(new env.BodyView(body, this.worldController.worldEntity), view => {
                view.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
                    BABYLON.ActionManager.OnPointerOverTrigger,
                    evt => {
                        this.worldController.highlightCluster(view.entity);
                        this.refresh();
                        if (!view.entity.owner) {
                            this.worldController.previewTurn(view.entity.originalColor);
                            this.refresh();
                        }
                    }));
                view.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
                    BABYLON.ActionManager.OnPointerOutTrigger,
                    evt => {
                        this.worldController.clearHighlightCluster(view.entity);
                        this.refresh();
                        this.worldController.clearPreviewTurn();
                        this.refresh();
                    }));
                view.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
                    BABYLON.ActionManager.OnPickTrigger,
                    evt => {
                        if (!view.entity.owner) {
                            this.worldController.makeTurn(view.entity.originalColor);
                            this.refresh();
                        }
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
