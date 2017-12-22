import { WorldEntity, ColorEntity, BodyEntity, PlayerEntity } from "./entities";
import { floodFill } from "../utils/misc";
import Rx from "rxjs";

export class WorldController {
    constructor(
        public worldEntity: WorldEntity,
    ) {
    }

    changedSubject = new Rx.Subject<null>();
    changedObservable = Rx.Observable.from(this.changedSubject);

    highlightCluster(body: BodyEntity): void {
        for (const { element: b, wave } of floodFill<BodyEntity>(
            new Set([body]).keys(),
            x => x.neighbours.keys(),
            t => (t.originalColor === body.originalColor),
        )) {
            b.highlighted.next(true);
        }
        this.changedSubject.next(null);
    }

    clearHighlightCluster(body: BodyEntity): void {
        for (const { element: b, wave } of floodFill<BodyEntity>(
            new Set([body]).keys(),
            x => x.neighbours.keys(),
            t => (t.originalColor === body.originalColor),
        )) {
            b.highlighted.next(false);
        }
        this.changedSubject.next(null);
    }

    makeTurn(color: ColorEntity): void {
        const currentPlayer = this.worldEntity.players[this.worldEntity.currentPlayerIndex.value];

        for (const { element: tree, wave } of floodFill(
            currentPlayer.base.keys(),
            x => x.neighbours.keys(),
            t => ((t.originalColor === color && !t.owner) || t.owner === currentPlayer)
        )) {
            if (tree.owner !== currentPlayer) {
                tree.owner = currentPlayer;
            }
        }

        this.worldEntity.currentPlayerIndex.next(
            (this.worldEntity.currentPlayerIndex.value + 1) % this.worldEntity.players.length);

        this.changedSubject.next(null);
    }

    previewTurn(color: ColorEntity): void {
        const currentPlayer = this.worldEntity.players[this.worldEntity.currentPlayerIndex.value];

        for (const { element: tree, wave } of floodFill(
            currentPlayer.base.keys(),
            x => x.neighbours.keys(),
            t => ((t.originalColor === color && !t.owner) || t.owner === currentPlayer)
        )) {
            if (tree.owner !== currentPlayer) {
                tree.previewOwner = currentPlayer;
            }
        }
        this.changedSubject.next(null);
    }

    clearPreviewTurn() {
        for (const body of this.worldEntity.bodies) {
            body.previewOwner = undefined;
        }
        this.changedSubject.next(null);
    }
}
