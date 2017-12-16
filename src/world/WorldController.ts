import { WorldEntity, ColorEntity, BodyEntity } from "./entities";
import { floodFill } from "../utils/misc";

export class WorldController {
    constructor(
        public worldEntity: WorldEntity,
    ) {
    }


    makeTurn(color: ColorEntity): void {
        const currentPlayer = this.worldEntity.players[this.worldEntity.currentPlayerIndex];

        for (const { element: tree, wave } of floodFill(
            currentPlayer.base.keys(),
            x => x.neighbours.keys(),
            t => ((t.originalColor === color && !t.owner) || t.owner === currentPlayer)
        )) {  
            if (tree.owner !== currentPlayer) {
                tree.owner = currentPlayer;
            }
        }

        this.worldEntity.currentPlayerIndex = (this.worldEntity.currentPlayerIndex + 1) % this.worldEntity.players.length;
    }

    previewTurn(color: ColorEntity): void {
        const currentPlayer = this.worldEntity.players[this.worldEntity.currentPlayerIndex];

        for (const { element: tree, wave } of floodFill(
            currentPlayer.base.keys(),
            x => x.neighbours.keys(),
            t => ((t.originalColor === color && !t.owner) || t.owner === currentPlayer)
        )) {
            if (tree.owner !== currentPlayer) {
                tree.previewOwner = currentPlayer;
            }
        }
    }

    clearPreviewTurn() {
        for (const body of this.worldEntity.bodies) {
            body.previewOwner = undefined;
        }
    }
}
