import { WorldController } from "./world/WorldController";
import { createWorld } from "./world/createWorld";
import { BodyEntity } from "./world/entities";
import { adjust } from "./utils/misc";
import { Constructor } from "./utils/Constructor";
import { createBodyViewClass } from "./view/BodyView";
import { createControllerClass } from "./Controller";
import { createMainViewClass } from "./view/MainView";
import { createMainGuiViewClass } from "./view/MainGuiView";

const worldController = new WorldController(createWorld({
    populateBodiesConfig: {
        worldWidth: 500,
        worldHeight: 300,
        isPopulatable: () => true,
        chunkSide: 100,
        radiusMin: 8,
        radiusMax: 38,
        failedMax: 750,
        connectionDistanceFactor: 5
    },
}));

const canvas = adjust(document.getElementById("canvas") as HTMLCanvasElement, c => {
    c.addEventListener("contextmenu", ev => ev.preventDefault());
});

const engine = new BABYLON.Engine(canvas, true);

const scene = adjust(new BABYLON.Scene(engine), s => {
    s.clearColor = new BABYLON.Color4(0.1, 0, 0.1, 1);
});

const MainView = createMainViewClass({
    scene,
});
const MainGuiView = createMainGuiViewClass({
    scene,
});
const BodyView = createBodyViewClass({
    scene,
});

const Controller = createControllerClass({
    MainView,
    MainGuiView,
    BodyView,
});

const controller = new Controller(worldController);

engine.runRenderLoop(() => scene.render());
