import { WorldEntity, ColorEntity, PlayerEntity, BodyEntity } from "./entities";
import { getRandomElement } from "../utils/misc";
import { ChunkManager } from "../utils/ChunkManager";

interface PopulateBodiesConfig {
    worldWidth: number;
    worldHeight: number;
    chunkSide: number;
    failedMax: number;
    radiusMin: number;
    radiusMax: number;
    isPopulatable: (position: {x: number, y: number}) => boolean;
}

export function populateBodies(
    config: PopulateBodiesConfig,
    originalColors: Set<ColorEntity>,
): Set<BodyEntity> {

    function x(t: number, xa: number, xb: number) {
        return xa + t * (xb - xa);
    }
    function randomPosition() {
        return {
            x: x(Math.random() - .5, 0, config.worldWidth),
            y: x(Math.random() - .5, 0, config.worldHeight),
        };
    }
    function randomRadius() {
        const t = Math.random() * Math.random() * Math.random() * Math.random();
        return x(t, config.radiusMin, config.radiusMax);
    }
    function distCenter(a: BodyEntity, b: BodyEntity) {
        return Math.sqrt(Math.pow(a.position.x - b.position.x, 2) + Math.pow(a.position.y - b.position.y, 2));
    }
    function distBorder(a: BodyEntity, b: BodyEntity) {
        return distCenter(a, b) - a.radius - b.radius;
    }
    function areOverlapped(a: BodyEntity, b: BodyEntity) {
        return distBorder(a, b) < 0;
    }

    const bodies = new ChunkManager<BodyEntity>(config.chunkSide);

    let failedCount = 0;
    while (failedCount < config.failedMax) {
        const body: BodyEntity = {
            position: randomPosition(),
            radius: randomRadius(),
            originalColor: getRandomElement([...originalColors]),
            owner: undefined,
        };

        const freeSpot = [...bodies.enumerateSquare(body.position, config.radiusMax * 2)]
            .every(b => !areOverlapped(body, b));

        if (freeSpot && config.isPopulatable(body.position)) {
            failedCount = 0;
            bodies.put(body.position, body);
        } else {
            failedCount++;
        }
    }

    return new Set([...bodies.enumerateAll()]);
}

interface CreateWorldConfig {
    populateBodiesConfig: PopulateBodiesConfig;
    // balh-blah-blah
}

export function createWorld(config: CreateWorldConfig): WorldEntity {
    const world: WorldEntity = {
        originalColors: new Set<ColorEntity>(),
        players: new Set<PlayerEntity>(),
        bodies: new Set<BodyEntity>(),
        currentPlayerIndex: 0,
    };

    world.originalColors.add({
        color: "#0000FF",
    });
    world.originalColors.add({
        color: "#00FF00",
    });
    world.originalColors.add({
        color: "#FF0000",
    });

    world.players.add({
        name: "Player 1",
        color: "#FF0000",
        base: new Set<BodyEntity>(),
    });

    world.bodies = populateBodies(config.populateBodiesConfig, world.originalColors);

    return world;
}
