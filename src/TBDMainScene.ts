import Phaser = require("phaser");
import { KHAnimatedText } from "./KHTextAnimator";

enum AnimState {
    NotStarted,
    Animating,
    DoneAnimating
};

const DELAY = 50;

export class TBDMainScene extends Phaser.Scene {

    private naiveWrap: boolean = true;
    private wrapTypeText: Phaser.GameObjects.BitmapText;

    constructor() {
        super("TBDMainScene");
    }

    preload() {
        this.load.bitmapFont('LegacYs', '/img/better-text-boxes/LegacYs.png', '/img/better-text-boxes/LegacYs.fnt');
    }

    private refreshText() {
        this.wrapTypeText.setText(this.naiveWrap ? "Naive word wrapping." : "Wrap-aware word wrapping.")
    }

    create() {        
        const width = this.sys.game.scale.gameSize.width;

        const inset = 10;
        const text = "This is a very carefully crafted test string.";
        this.add.bitmapText(inset, inset, 'LegacYs', "Click to animate text.").setOrigin(0).setTint(0xffff00);
        this.wrapTypeText = this.add.bitmapText(width - inset, inset, 'LegacYs', "Naive word wrapping.").setOrigin(1, 0).setTint(0xffff00);
        this.refreshText();

        const animTextObj = new KHAnimatedText(this, inset, 45, 'LegacYs', { naiveWrap: this.naiveWrap, delay: 50 }).setScale(3).setMaxWidth(width - inset * 2);

        this.input.mouse.disableContextMenu();
        
        this.input.on('pointerdown', (pointer) => {
            // Toggle wrap mode.
            if (pointer.rightButtonDown()) {
                this.naiveWrap = !this.naiveWrap;
                animTextObj.config.naiveWrap = this.naiveWrap;
                this.refreshText();
            }
            // Toggle animation.
            else {
                if (animTextObj.isAnimating()) animTextObj.stopAnimation();
                else animTextObj.animateText(text);
            }
        })
    }
}