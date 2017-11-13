System.register("world/entities", [], function (exports_1, context_1) {
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("world/WorldController", [], function (exports_2, context_2) {
    var __moduleName = context_2 && context_2.id;
    var WorldController;
    return {
        setters: [],
        execute: function () {
            WorldController = class WorldController {
                constructor(worldEntity) {
                    this.worldEntity = worldEntity;
                }
                makeTurn(color) {
                    // tslint:disable-next-line:no-console
                    console.log("makeTurn", color);
                }
                previewTurn(color) {
                    // tslint:disable-next-line:no-console
                    console.log("previewTurn", color);
                }
            };
            exports_2("WorldController", WorldController);
        }
    };
});
System.register("utils/misc", [], function (exports_3, context_3) {
    var __moduleName = context_3 && context_3.id;
    function isVisible(elt) {
        const style = window.getComputedStyle(elt);
        return (style.width !== null && +style.width !== 0)
            && (style.height !== null && +style.height !== 0)
            && (style.opacity !== null && +style.opacity !== 0)
            && style.display !== "none"
            && style.visibility !== "hidden";
    }
    exports_3("isVisible", isVisible);
    function adjust(x, ...applyAdjustmentList) {
        for (const applyAdjustment of applyAdjustmentList) {
            applyAdjustment(x);
        }
        return x;
    }
    exports_3("adjust", adjust);
    function getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    exports_3("getRandomElement", getRandomElement);
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
    exports_3("floodFill", floodFill);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("view/BodyView", ["utils/misc"], function (exports_4, context_4) {
    var __moduleName = context_4 && context_4.id;
    function createBodyViewClass(env) {
        return class {
            constructor(entity) {
                this.entity = entity;
                this.mesh = misc_1.adjust(BABYLON.MeshBuilder.CreateDisc("", {
                    radius: this.entity.radius,
                }, env.scene), mesh => {
                    mesh.position.set(this.entity.position.x, this.entity.position.y, 0);
                    mesh.material = misc_1.adjust(new BABYLON.StandardMaterial("", env.scene), material => {
                        material.diffuseColor = BABYLON.Color3.FromHexString(this.entity.originalColor.color);
                    });
                    mesh.outlineColor = new BABYLON.Color3(0, 0, 1);
                    mesh.outlineWidth = 1;
                });
                this.actionManager = this.mesh.actionManager = new BABYLON.ActionManager(env.scene);
            }
        };
    }
    exports_4("createBodyViewClass", createBodyViewClass);
    var misc_1;
    return {
        setters: [
            function (misc_1_1) {
                misc_1 = misc_1_1;
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
                this.camera = misc_2.adjust(new BABYLON.ArcRotateCamera("", -Math.PI / 2, 0, 100, new BABYLON.Vector3(0, 0, 0), env.scene), camera => {
                    camera.lowerRadiusLimit = 2;
                    camera.upperRadiusLimit = 50000;
                    camera.attachControl(env.scene.getEngine().getRenderingCanvas(), false);
                });
                // light1 = new BABYLON.PointLight("", new BABYLON.Vector3(0, 10, 0), env.scene);
                this.light = new BABYLON.DirectionalLight("", new BABYLON.Vector3(1, 1, 1), env.scene);
            }
        };
    }
    exports_5("createMainViewClass", createMainViewClass);
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
        return misc_3.adjust(new constructor(), ...applyStyles, el => parent.addControl(el));
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
System.register("Controller", ["utils/misc"], function (exports_7, context_7) {
    var __moduleName = context_7 && context_7.id;
    function createControllerClass(env) {
        return class {
            constructor(worldController) {
                this.worldController = worldController;
                this.mainView = new env.MainView(this.worldController.worldEntity);
                this.mainGuiView = new env.MainGuiView(this.worldController.worldEntity);
                this.bodyViews = [...this.worldController.worldEntity.bodies].map(body => {
                    return misc_4.adjust(new env.BodyView(body), view => {
                        view.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, evt => {
                            view.mesh.renderOutline = true;
                            if (!view.entity.owner) {
                                this.worldController.previewTurn(view.entity.originalColor);
                            }
                        }));
                        view.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, evt => {
                            view.mesh.renderOutline = false;
                        }));
                        view.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, evt => {
                            this.mainView.camera.lockedTarget = view.mesh;
                        }));
                    });
                });
            }
        };
    }
    exports_7("createControllerClass", createControllerClass);
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
                x: x(Math.random() - .5, 0, config.worldWidth),
                y: x(Math.random() - .5, 0, config.worldHeight),
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
                originalColor: misc_5.getRandomElement([...originalColors]),
                owner: undefined,
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
        return new Set([...bodies.enumerateAll()]);
    }
    exports_9("populateBodies", populateBodies);
    function createWorld(config) {
        const world = {
            originalColors: new Set(),
            players: new Set(),
            bodies: new Set(),
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
            base: new Set(),
        });
        world.bodies = populateBodies(config.populateBodiesConfig, world.originalColors);
        return world;
    }
    exports_9("createWorld", createWorld);
    var misc_5, ChunkManager_1;
    return {
        setters: [
            function (misc_5_1) {
                misc_5 = misc_5_1;
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
    var WorldController_1, createWorld_1, misc_6, BodyView_1, Controller_1, MainView_1, MainGuiView_1, worldController, canvas, engine, scene, MainView, MainGuiView, BodyView, Controller, controller;
    return {
        setters: [
            function (WorldController_1_1) {
                WorldController_1 = WorldController_1_1;
            },
            function (createWorld_1_1) {
                createWorld_1 = createWorld_1_1;
            },
            function (misc_6_1) {
                misc_6 = misc_6_1;
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
                    worldWidth: 1000,
                    worldHeight: 1000,
                    isPopulatable: () => true,
                    chunkSide: 100,
                    radiusMin: 8,
                    radiusMax: 38,
                    failedMax: 750,
                },
            }));
            canvas = misc_6.adjust(document.getElementById("canvas"), c => {
                c.addEventListener("contextmenu", ev => ev.preventDefault());
            });
            engine = new BABYLON.Engine(canvas, true);
            scene = misc_6.adjust(new BABYLON.Scene(engine), s => {
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