import * as Rx from "rxjs";

export type Color = string;

export interface ColorEntity {
    color: Color;
}

export interface PlayerEntity {
    name: string;
    color: Color;
    base: Set<BodyEntity>;
}

export interface BodyEntity {
    position: {
        x: number;
        y: number;
    };
    radius: number;
    originalColor: ColorEntity;
    owner?: PlayerEntity;
    previewOwner?: PlayerEntity;
    neighbours: Set<BodyEntity>;
    highlighted: Rx.BehaviorSubject<boolean>;
}

export interface WorldEntity {
    originalColors: Set<ColorEntity>;
    players: Array<PlayerEntity>;
    bodies: Set<BodyEntity>;
    currentPlayerIndex: Rx.BehaviorSubject<number>;
    rect: {
        minX: number;
        maxX: number;
        maxY: number;
        minY: number;
    };
}
