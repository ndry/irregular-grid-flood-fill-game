import { WorldEntity, ColorEntity } from "./entities";

export class WorldController {
    constructor(
        public worldEntity: WorldEntity,
    ) {
    }

    makeTurn(color: ColorEntity): void {
        // tslint:disable-next-line:no-console
        console.log("makeTurn", color);
    }

    previewTurn(color: ColorEntity): void {
        // tslint:disable-next-line:no-console
        console.log("previewTurn", color);
    }
}
