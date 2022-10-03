import Phaser from "phaser";
import PhaserNavMeshPlugin from "phaser-navmesh";
import "./styles.css";

class MyClass extends Phaser.Scene {
  constructor() {
    super({
      key: "MatchScene"
    });
  }

  preload() {
    this.load.setPath("src/");
    this.load.tilemapTiledJSON("map", "tilemaps/map.json");
    this.load.image("tiles", "tilemaps/tiles.png");
  }

  create() {
    this.plugins.installScenePlugin(
      "PhaserNavMeshPlugin",
      PhaserNavMeshPlugin,
      "navMeshPlugin",
      this
    );
    // Set up a tilemap with at least one layer
    const tilemap = this.add.tilemap("map");
    const tileset = tilemap.addTilesetImage("tiles", "tiles");
    tilemap.createStaticLayer("bg", tileset);
    const wallLayer = tilemap.createStaticLayer("walls", tileset);

    // Load the navMesh from the tilemap object layer "navmesh" (created in Tiled). The navMesh was
    // created with 12.5 pixels of space around obstacles.
    const objectLayer = tilemap.getObjectLayer("navMesh");
    const navMesh = this.navMeshPlugin.buildMeshFromTiled(
      "mesh",
      objectLayer,
      12.5
    );

    // This is how you can get a path within the mesh
    const path = navMesh.findPath({ x: 0, y: 0 }, { x: 300, y: 400 });
    console.log(path);
    console.log(Phaser.Math);
    // ⮡  path will either be null or an array of Phaser.Geom.Point objects

    const style = {
      font: "22px monospace",
      fill: "#ff0044",
      padding: { x: 20, y: 10 },
      backgroundColor: "#fff"
    };
    const uiText = this.add
      .text(10, 5, "Click to find a path!", style)
      .setAlpha(0.9);

    // Drawing path between the center of the map and wherever you click
    const p1 = { x: 375, y: 375 };
    const debugGraphics = this.add.graphics(0, 0).setAlpha(0.5);
    navMesh.enableDebug(debugGraphics);
    this.input.on("pointerdown", pointer => {
      navMesh.debugDrawClear();
      const p2 = { x: pointer.x, y: pointer.y };
      const path = navMesh.findPath(p1, p2);
      const text = path
        ? `Path found! Length is ${path.length}`
        : "No path found!";
      uiText.setText(text);
      if (path) navMesh.debugDrawPath(path, 0xffd900);
    });
  }
}

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game-container",
  width: 750,
  height: 750,
  // plugins: {
  //   scene: [
  //     {
  //       key: "PhaserNavMeshPlugin", // Key to store the plugin class under in cache
  //       plugin: PhaserNavMeshPlugin, // Class that constructs plugins
  //       mapping: "navMeshPlugin", // Property mapping to use for the scene, e.g. this.navMeshPlugin
  //       start: true
  //     }
  //   ]
  // },
  scene: MyClass
});

function preload() {
  this.load.setPath("src/");
  this.load.tilemapTiledJSON("map", "tilemaps/map.json");
  this.load.image("tiles", "tilemaps/tiles.png");
}

function create() {
  this.plugins.installScenePlugin(
    "PhaserNavMeshPlugin",
    PhaserNavMeshPlugin,
    "navMeshPlugin",
    this
  );
  // Set up a tilemap with at least one layer
  const tilemap = this.add.tilemap("map");
  const tileset = tilemap.addTilesetImage("tiles", "tiles");
  tilemap.createStaticLayer("bg", tileset);
  const wallLayer = tilemap.createStaticLayer("walls", tileset);

  // Load the navMesh from the tilemap object layer "navmesh" (created in Tiled). The navMesh was
  // created with 12.5 pixels of space around obstacles.
  const objectLayer = tilemap.getObjectLayer("navMesh");
  const navMesh = this.navMeshPlugin.buildMeshFromTiled(
    "mesh",
    objectLayer,
    12.5
  );

  // This is how you can get a path within the mesh
  const path = navMesh.findPath({ x: 0, y: 0 }, { x: 300, y: 400 });
  console.log(path);
  console.log(Phaser.Math);
  // ⮡  path will either be null or an array of Phaser.Geom.Point objects

  const style = {
    font: "22px monospace",
    fill: "#ff0044",
    padding: { x: 20, y: 10 },
    backgroundColor: "#fff"
  };
  const uiText = this.add
    .text(10, 5, "Click to find a path!", style)
    .setAlpha(0.9);

  // Drawing path between the center of the map and wherever you click
  const p1 = { x: 375, y: 375 };
  const debugGraphics = this.add.graphics(0, 0).setAlpha(0.5);
  navMesh.enableDebug(debugGraphics);
  this.input.on("pointerdown", pointer => {
    navMesh.debugDrawClear();
    const p2 = { x: pointer.x, y: pointer.y };
    const path = navMesh.findPath(p1, p2);
    const text = path
      ? `Path found! Length is ${path.length}`
      : "No path found!";
    uiText.setText(text);
    if (path) navMesh.debugDrawPath(path, 0xffd900);
  });
}
