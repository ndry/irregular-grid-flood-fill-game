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
    connectionDistanceFactor: number;
    isPopulatable: (position: { x: number, y: number }) => boolean;
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
            x: x(Math.random(), -config.worldWidth / 2, config.worldWidth / 2),
            y: x(Math.random(), -config.worldHeight / 2, config.worldHeight / 2),
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
            neighbours: new Set<BodyEntity>()
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

    for (const body of bodies.enumerateAll()) {
        const closeTrees = [...bodies.enumerateSquare(body.position, config.connectionDistanceFactor * (config.radiusMax + body.radius))]
            .filter(t => body !== t && distCenter(t, body) < config.connectionDistanceFactor * (t.radius + body.radius))
            .sort((at, bt) => distCenter(body, at) - distCenter(body, bt));

        let hiddenTrees = new Set<BodyEntity>();

        for (let i = 0; i < closeTrees.length; i++) {
            const t = closeTrees[i];

            function getMagnitude({x, y}: {x: number, y: number}) {
                return Math.sqrt(x*x + y*y);
            }
            function dot(a: {x: number, y: number}, b: {x: number, y: number}) {
                return a.x*b.x + a.y*b.y;
            }

            const dt = {
                x: t.position.x - body.position.x, 
                y: t.position.y - body.position.y
            };
            const at = Math.asin(t.radius / getMagnitude(dt));

            closeTrees
                .slice(i + 1)
                .filter(t2 => {

                    const dt2 = {
                        x: t2.position.x - body.position.x, 
                        y: t2.position.y - body.position.y
                    };
                    const at2 = Math.asin(t2.radius / getMagnitude(dt2));

                    const minAllowedAngle = at + at2;

                    var a = Math.acos(dot(dt, dt2) / (getMagnitude(dt) * getMagnitude(dt2)));

                    return a < minAllowedAngle;
                })
                .forEach(t2 => hiddenTrees.add(t2));
        }


        closeTrees
            .filter(t => !hiddenTrees.has(t))
            .forEach(t => {
                body.neighbours.add(t);
                t.neighbours.add(body);
            });
    }

    return new Set([...bodies.enumerateAll()]);
}

interface CreateWorldConfig {
    populateBodiesConfig: PopulateBodiesConfig;
}

export function createWorld(config: CreateWorldConfig): WorldEntity {
    const world: WorldEntity = {
        originalColors: new Set<ColorEntity>(),
        players: new Array<PlayerEntity>(),
        bodies: new Set<BodyEntity>(),
        currentPlayerIndex: 0,
        rect: {
            minX: -config.populateBodiesConfig.worldWidth / 2,
            maxX: config.populateBodiesConfig.worldWidth / 2,
            minY: -config.populateBodiesConfig.worldHeight / 2,
            maxY: config.populateBodiesConfig.worldHeight / 2,
        },
    };

    world.originalColors.add({
        color: "#40FFFF",
    });
    world.originalColors.add({
        color: "#FFFF40",
    });
    world.originalColors.add({
        color: "#FF40FF",
    });

    world.bodies = populateBodies(config.populateBodiesConfig, world.originalColors);

    world.players.push({
        name: "Player 1",
        color: "#FF0000",
        base: new Set<BodyEntity>([getRandomElement([...world.bodies].filter(b => !b.owner))]),
    });

    world.players.push({
        name: "Player 2",
        color: "#0000FF",
        base: new Set<BodyEntity>([getRandomElement([...world.bodies].filter(b => !b.owner))]),
    });

    for (const player of world.players) {
        for (const body of player.base) {
            body.owner = player;
        }
    }

    return world;
}
