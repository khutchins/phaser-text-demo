import { TBDMainScene } from "./TBDMainScene";

function makeGame(parentDiv: string, type: string = "wrap"): Phaser.Game {
    const config = {
        type: Phaser.AUTO,
        pixelArt: true,
        scale: {
            width: 450,
            height: 200,
            autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
        },
        input: {
            gamepad: true,
        },
        parent: parentDiv,
        transparent: true,
        scene: [ TBDMainScene ],
    };
    const game = new Phaser.Game(config);
    (game as any).demoType = type;
    return game;
}

module.exports = {
    makeGame: makeGame,
};