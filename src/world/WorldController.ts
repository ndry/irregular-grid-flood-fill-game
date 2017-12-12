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
        const currentPlayer = this.worldEntity.players[this.worldEntity.currentPlayerIndex];
        for (const body of currentPlayer.base) {
            for (const neighbour of body.neighbours) {
                if (color !== neighbour.originalColor) { continue; }
                neighbour.previewOwner = currentPlayer;
            }
        }
    }

    clearPreviewTurn() {
        for (const body of this.worldEntity.bodies) {
            body.previewOwner = undefined;
        }
    }
}
