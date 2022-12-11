import { TBDMainScene } from "./TBDMainScene";

function makeGame(parentDiv: string, type: string): Phaser.Game {
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
        scene: [ TBDMainScene ],
    };
    const game = new Phaser.Game(config);
    // (game as any).deadZoneType = type;
    return game;
}

module.exports = {
    makeGame: makeGame,
};