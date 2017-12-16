System.register("world/entities", [], function (exports_1, context_1) {
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("utils/misc", [], function (exports_2, context_2) {
    var __moduleName = context_2 && context_2.id;
    function isVisible(elt) {
        const style = window.getComputedStyle(elt);
        return (style.width !== null && +style.width !== 0)
            && (style.height !== null && +style.height !== 0)
            && (style.opacity !== null && +style.opacity !== 0)
            && style.display !== "none"
            && style.visibility !== "hidden";
    }
    exports_2("isVisible", isVisible);
    function adjust(x, ...applyAdjustmentList) {
        for (const applyAdjustment of applyAdjustmentList) {
            applyAdjustment(x);
        }
        return x;
    }
    exports_2("adjust", adjust);
    function getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    exports_2("getRandomElement", getRandomElement);
    function* floodFill(base, getNeighbours, neighbourFilter) {
        const queue = new Array();
        const visited = new Set();
        function enqueueUnique(element, wave) {
            if (!visited.has(element)) {
                queue.push({ element, wave });
                visited.add(element);
            }
        }
        for (const element of base) {
            enqueueUnique(element, 0);
        }
        for (let entry = queue.shift(); entry; entry = queue.shift()) {
            yield entry;
            const { element, wave } = entry;
            for (const t of getNeighbours(element)) {
                if (neighbourFilter(t)) {
                    enqueueUnique(t, wave + 1);
                }
            }
        }
    }
    exports_2("floodFill", floodFill);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("world/WorldController", ["utils/misc"], function (exports_3, context_3) {
    var __moduleName = context_3 && context_3.id;
    var misc_1, WorldController;
    return {
        setters: [
            function (misc_1_1) {
                misc_1 = misc_1_1;
            }
        ],
        execute: function () {
            WorldController = class WorldController {
                constructor(worldEntity) {
                    this.worldEntity = worldEntity;
                }
                makeTurn(color) {
                    const currentPlayer = this.worldEntity.players[this.worldEntity.currentPlayerIndex];
                    for (const { element: tree, wave } of misc_1.floodFill(currentPlayer.base.keys(), x => x.neighbours.keys(), t => ((t.originalColor === color && !t.owner) || t.owner === currentPlayer))) {
                        if (tree.owner !== currentPlayer) {
                            tree.owner = currentPlayer;
                        }
                    }
                    this.worldEntity.currentPlayerIndex = (this.worldEntity.currentPlayerIndex + 1) % this.worldEntity.players.length;
                }
                previewTurn(color) {
                    const currentPlayer = this.worldEntity.players[this.worldEntity.currentPlayerIndex];
                    for (const { element: tree, wave } of misc_1.floodFill(currentPlayer.base.keys(), x => x.neighbours.keys(), t => ((t.originalColor === color && !t.owner) || t.owner === currentPlayer))) {
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
            };
            exports_3("WorldController", WorldController);
        }
    };
});
System.register("view/BodyView", ["utils/misc"], function (exports_4, context_4) {
    var __moduleName = context_4 && context_4.id;
    function createBodyViewClass(env) {
        return class {
            constructor(entity) {
                this.entity = entity;
                this.outline = misc_2.adjust(BABYLON.MeshBuilder.CreateDisc("", {
                    radius: this.entity.radius + 1,
                }, env.scene), mesh => {
                    mesh.position.set(this.entity.position.x, this.entity.position.y, .1);
                    mesh.material = misc_2.adjust(new BABYLON.StandardMaterial("", env.scene), material => {
                        material.diffuseColor = BABYLON.Color3.FromHexString("#000000");
                    });
                });
                this.material = misc_2.adjust(new BABYLON.StandardMaterial("", env.scene), material => {
                    const color = this.entity.owner
                        ? this.entity.owner.color
                        : this.entity.originalColor.color;
                    material.diffuseColor = BABYLON.Color3.FromHexString(color);
                });
                this.mesh = misc_2.adjust(BABYLON.MeshBuilder.CreateDisc("", {
                    radius: this.entity.radius,
                }, env.scene), mesh => {
                    mesh.position.set(this.entity.position.x, this.entity.position.y, 0);
                    mesh.material = this.material;
                    mesh.outlineColor = new BABYLON.Color3(0, 0, 1);
                    mesh.outlineWidth = 1;
                });
                this.connections = [...this.entity.neighbours].map(n => BABYLON.MeshBuilder.CreateLines("", {
                    points: [
                        new BABYLON.Vector3(this.entity.position.x, this.entity.position.y, 1),
                        new BABYLON.Vector3(n.position.x, n.position.y, 1),
                    ],
                    updatable: false,
                    instance: null,
                    colors: [
                        new BABYLON.Color4(0, 0, 0),
                        new BABYLON.Color4(0, 0, 0),
                    ],
                }, env.scene));
                this.actionManager = this.mesh.actionManager = new BABYLON.ActionManager(env.scene);
            }
            refresh() {
                const color = this.entity.owner
                    ? this.entity.owner.color
                    : this.entity.previewOwner
                        ? this.entity.previewOwner.color
                        : this.entity.originalColor.color;
                this.material.diffuseColor = BABYLON.Color3.FromHexString(color);
            }
        };
    }
    exports_4("createBodyViewClass", createBodyViewClass);
    var misc_2;
    return {
        setters: [
            function (misc_2_1) {
                misc_2 = misc_2_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("view/MainView", ["utils/misc"], function (exports_5, context_5) {
    var __moduleName = context_5 && context_5.id;
    function createMainViewClass(env) {
        return class {
            constructor(entity) {
                this.entity = entity;
                this.camera = misc_3.adjust(new BABYLON.TargetCamera("", new BABYLON.Vector3((this.entity.rect.maxX + this.entity.rect.minX) / 2, (this.entity.rect.maxY + this.entity.rect.minY) / 2, -1), env.scene), camera => {
                    camera.setTarget(new BABYLON.Vector3(camera.position.x, camera.position.y, 0));
                    camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
                    const worldWidth = this.entity.rect.maxX - this.entity.rect.minX;
                    const worldHeight = this.entity.rect.maxY - this.entity.rect.minY;
                    const worldRatio = worldWidth / worldHeight;
                    const renderWidth = env.scene.getEngine().getRenderWidth();
                    const renderHeight = env.scene.getEngine().getRenderHeight();
                    const renderRatio = renderWidth / renderHeight;
                    const ratio = renderRatio / worldRatio;
                    const scale = Math.max(1 / ratio, 1);
                    camera.orthoTop = scale * this.entity.rect.maxY;
                    camera.orthoBottom = scale * this.entity.rect.minY;
                    camera.orthoLeft = scale * ratio * this.entity.rect.minX;
                    camera.orthoRight = scale * ratio * this.entity.rect.maxX;
                    env.scene.activeCamera = camera;
                });
                // light1 = new BABYLON.PointLight("", new BABYLON.Vector3(0, 10, 0), env.scene);
                // light = new BABYLON.DirectionalLight("", new BABYLON.Vector3(1, 1, 1), env.scene);
                this.light = new BABYLON.HemisphericLight("", new BABYLON.Vector3(0, 0, -1), env.scene);
                env.scene.clearColor = new BABYLON.Color4(1, 1, 1);
            }
        };
    }
    exports_5("createMainViewClass", createMainViewClass);
    var misc_3;
    return {
        setters: [
            function (misc_3_1) {
                misc_3 = misc_3_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("view/MainGuiView", ["utils/misc"], function (exports_6, context_6) {
    var __moduleName = context_6 && context_6.id;
    function createMainGuiViewClass(env) {
        return class {
            constructor(entity) {
                this.entity = entity;
                this.root = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("", true, env.scene);
                this.panel = create(BABYLON.GUI.StackPanel, this.root, el => {
                    el.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                    el.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
                    el.width = "200px";
                });
                this.fpsLabel = create(BABYLON.GUI.TextBlock, this.panel, defaultTextBlockStyle);
                this.bodyCountLabel = create(BABYLON.GUI.TextBlock, this.panel, defaultTextBlockStyle);
                this.populationLabel = create(BABYLON.GUI.TextBlock, this.panel, defaultTextBlockStyle, t => {
                    t.height = "100px";
                    t.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                });
                this.pauseButton = create(BABYLON.GUI.Button, this.panel, defaultButtonStyle, el => {
                    create(BABYLON.GUI.TextBlock, el, el1 => {
                        el1.text = "Pause";
                    });
                });
                this.stepButton = create(BABYLON.GUI.Button, this.panel, defaultButtonStyle, el => {
                    create(BABYLON.GUI.TextBlock, el, el1 => {
                        el1.text = "Step";
                    });
                });
                this.toggleGravityButton = create(BABYLON.GUI.Button, this.panel, defaultButtonStyle, el => {
                    create(BABYLON.GUI.TextBlock, el, el1 => {
                        el1.text = "Toggle Gravity";
                    });
                });
                this.toggleWorldGuiButton = create(BABYLON.GUI.Button, this.panel, defaultButtonStyle, el => {
                    create(BABYLON.GUI.TextBlock, el, el1 => {
                        el1.text = "Toggle World GUI";
                    });
                });
            }
        };
    }
    exports_6("createMainGuiViewClass", createMainGuiViewClass);
    function create(constructor, parent, ...applyStyles) {
        return misc_4.adjust(new constructor(), ...applyStyles, el => parent.addControl(el));
    }
    function defaultButtonStyle(el) {
        el.width = "100%";
        el.height = "20px";
        el.color = "white";
        el.cornerRadius = 20;
        el.background = "green";
    }
    function defaultTextBlockStyle(el) {
        el.width = "100%";
        el.height = "20px";
        el.color = "white";
    }
    var misc_4;
    return {
        setters: [
            function (misc_4_1) {
                misc_4 = misc_4_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("Controller", ["utils/misc"], function (exports_7, context_7) {
    var __moduleName = context_7 && context_7.id;
    function createControllerClass(env) {
        return class {
            constructor(worldController) {
                this.worldController = worldController;
                this.mainView = new env.MainView(this.worldController.worldEntity);
                // mainGuiView = new env.MainGuiView(this.worldController.worldEntity);
                this.bodyViews = [...this.worldController.worldEntity.bodies].map(body => {
                    return misc_5.adjust(new env.BodyView(body), view => {
                        view.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, evt => {
                            view.mesh.renderOutline = true;
                            if (!view.entity.owner) {
                                this.worldController.previewTurn(view.entity.originalColor);
                                this.refresh();
                            }
                        }));
                        view.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, evt => {
                            view.mesh.renderOutline = false;
                            this.worldController.clearPreviewTurn();
                            this.refresh();
                        }));
                        view.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, evt => {
                            if (!view.entity.owner) {
                                this.worldController.makeTurn(view.entity.originalColor);
                                this.refresh();
                            }
                        }));
                    });
                });
            }
            refresh() {
                for (const view of this.bodyViews) {
                    view.refresh();
                }
            }
        };
    }
    exports_7("createControllerClass", createControllerClass);
    var misc_5;
    return {
        setters: [
            function (misc_5_1) {
                misc_5 = misc_5_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("utils/ChunkManager", [], function (exports_8, context_8) {
    var __moduleName = context_8 && context_8.id;
    function Map_getOrCreate(map, key, valueFactory) {
        let value = map.get(key);
        if (!value) {
            value = valueFactory(key);
            map.set(key, value);
        }
        return value;
    }
    var ChunkManager;
    return {
        setters: [],
        execute: function () {
            ChunkManager = class ChunkManager {
                constructor(chunkside) {
                    this.chunks = new Map();
                    this.chunkSide = chunkside;
                }
                cid(p) {
                    return `${Math.round(p.y / this.chunkSide)} @ ${Math.round(p.x / this.chunkSide)}`;
                }
                put(p, entry) {
                    const chunk = Map_getOrCreate(this.chunks, this.cid(p), () => ({
                        position: {
                            x: Math.round(p.x / this.chunkSide) * this.chunkSide,
                            y: Math.round(p.y / this.chunkSide) * this.chunkSide,
                        },
                        entries: [],
                    }));
                    chunk.entries.push(entry);
                }
                getChunk(p) {
                    return this.chunks.get(this.cid(p));
                }
                *enumerateAll() {
                    for (const chunk of this.chunks.values()) {
                        yield* chunk.entries;
                    }
                }
                *enumerateChunk(p) {
                    const chunk = this.getChunk(p);
                    if (!chunk) {
                        return;
                    }
                    yield* chunk.entries;
                }
                *enumerateSquare(p, r) {
                    for (let dx = -r; dx <= r; dx += this.chunkSide) {
                        for (let dy = -r; dy <= r; dy += this.chunkSide) {
                            yield* this.enumerateChunk({ x: p.x + dx, y: p.y + dy });
                        }
                    }
                }
            };
            exports_8("ChunkManager", ChunkManager);
        }
    };
});
System.register("world/createWorld", ["utils/misc", "utils/ChunkManager"], function (exports_9, context_9) {
    var __moduleName = context_9 && context_9.id;
    function populateBodies(config, originalColors) {
        function x(t, xa, xb) {
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
        function distCenter(a, b) {
            return Math.sqrt(Math.pow(a.position.x - b.position.x, 2) + Math.pow(a.position.y - b.position.y, 2));
        }
        function distBorder(a, b) {
            return distCenter(a, b) - a.radius - b.radius;
        }
        function areOverlapped(a, b) {
            return distBorder(a, b) < 0;
        }
        const bodies = new ChunkManager_1.ChunkManager(config.chunkSide);
        let failedCount = 0;
        while (failedCount < config.failedMax) {
            const body = {
                position: randomPosition(),
                radius: randomRadius(),
                originalColor: misc_6.getRandomElement([...originalColors]),
                owner: undefined,
                neighbours: new Set()
            };
            const freeSpot = [...bodies.enumerateSquare(body.position, config.radiusMax * 2)]
                .every(b => !areOverlapped(body, b));
            if (freeSpot && config.isPopulatable(body.position)) {
                failedCount = 0;
                bodies.put(body.position, body);
            }
            else {
                failedCount++;
            }
        }
        for (const body of bodies.enumerateAll()) {
            const closeTrees = [...bodies.enumerateSquare(body.position, config.connectionDistanceFactor * (config.radiusMax + body.radius))]
                .filter(t => body !== t && distCenter(t, body) < config.connectionDistanceFactor * (t.radius + body.radius))
                .sort((at, bt) => distCenter(body, at) - distCenter(body, bt));
            let hiddenTrees = new Set();
            for (let i = 0; i < closeTrees.length; i++) {
                const t = closeTrees[i];
                function getMagnitude({ x, y }) {
                    return Math.sqrt(x * x + y * y);
                }
                function dot(a, b) {
                    return a.x * b.x + a.y * b.y;
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
    exports_9("populateBodies", populateBodies);
    function createWorld(config) {
        const world = {
            originalColors: new Set(),
            players: new Array(),
            bodies: new Set(),
            currentPlayerIndex: 0,
            rect: {
                minX: -config.populateBodiesConfig.worldWidth / 2,
                maxX: config.populateBodiesConfig.worldWidth / 2,
                minY: -config.populateBodiesConfig.worldHeight / 2,
                maxY: config.populateBodiesConfig.worldHeight / 2,
            },
        };
        world.originalColors.add({
            color: "#008000",
        });
        world.originalColors.add({
            color: "#FFFF00",
        });
        world.originalColors.add({
            color: "#FFFFFF",
        });
        world.originalColors.add({
            color: "#FFA500",
        });
        world.originalColors.add({
            color: "#FFC0CB",
        });
        world.bodies = populateBodies(config.populateBodiesConfig, world.originalColors);
        world.players.push({
            name: "Player 1",
            color: "#FF0000",
            base: new Set([misc_6.getRandomElement([...world.bodies].filter(b => !b.owner))]),
        });
        world.players.push({
            name: "Player 2",
            color: "#0000FF",
            base: new Set([misc_6.getRandomElement([...world.bodies].filter(b => !b.owner))]),
        });
        for (const player of world.players) {
            for (const body of player.base) {
                body.owner = player;
            }
        }
        return world;
    }
    exports_9("createWorld", createWorld);
    var misc_6, ChunkManager_1;
    return {
        setters: [
            function (misc_6_1) {
                misc_6 = misc_6_1;
            },
            function (ChunkManager_1_1) {
                ChunkManager_1 = ChunkManager_1_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("utils/Constructor", [], function (exports_10, context_10) {
    var __moduleName = context_10 && context_10.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("main", ["world/WorldController", "world/createWorld", "utils/misc", "view/BodyView", "Controller", "view/MainView", "view/MainGuiView"], function (exports_11, context_11) {
    var __moduleName = context_11 && context_11.id;
    var WorldController_1, createWorld_1, misc_7, BodyView_1, Controller_1, MainView_1, MainGuiView_1, worldController, canvas, engine, scene, MainView, MainGuiView, BodyView, Controller, controller;
    return {
        setters: [
            function (WorldController_1_1) {
                WorldController_1 = WorldController_1_1;
            },
            function (createWorld_1_1) {
                createWorld_1 = createWorld_1_1;
            },
            function (misc_7_1) {
                misc_7 = misc_7_1;
            },
            function (BodyView_1_1) {
                BodyView_1 = BodyView_1_1;
            },
            function (Controller_1_1) {
                Controller_1 = Controller_1_1;
            },
            function (MainView_1_1) {
                MainView_1 = MainView_1_1;
            },
            function (MainGuiView_1_1) {
                MainGuiView_1 = MainGuiView_1_1;
            }
        ],
        execute: function () {
            worldController = new WorldController_1.WorldController(createWorld_1.createWorld({
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
            canvas = misc_7.adjust(document.getElementById("canvas"), c => {
                c.addEventListener("contextmenu", ev => ev.preventDefault());
            });
            engine = new BABYLON.Engine(canvas, true);
            scene = misc_7.adjust(new BABYLON.Scene(engine), s => {
                s.clearColor = new BABYLON.Color4(0.1, 0, 0.1, 1);
            });
            MainView = MainView_1.createMainViewClass({
                scene,
            });
            MainGuiView = MainGuiView_1.createMainGuiViewClass({
                scene,
            });
            BodyView = BodyView_1.createBodyViewClass({
                scene,
            });
            Controller = Controller_1.createControllerClass({
                MainView,
                MainGuiView,
                BodyView,
            });
            controller = new Controller(worldController);
            engine.runRenderLoop(() => scene.render());
        }
    };
});
System.register("utils/IDestructable", [], function (exports_12, context_12) {
    var __moduleName = context_12 && context_12.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
//# sourceMappingURL=app.js.map