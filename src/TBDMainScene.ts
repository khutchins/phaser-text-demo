import Phaser = require("phaser");
import { KHAnimatedText, TIMING_NAIVE_SLOW } from "./KHTextAnimator";

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

    drawTextBoxBackground(x: number, y: number, width: number, height: number) {
        const mult = 3;
        const outerColor = 0x666666;
        const innerColor = 0xAAAAAA;
        const bgColor = 0x222222;
        this.add.rectangle(x - 2 * mult, y, width + 4 * mult, height, outerColor).setOrigin(0);
        this.add.rectangle(x, y - 2 * mult, width, height + 4 * mult, outerColor).setOrigin(0);
        this.add.rectangle(x - mult, y - mult, width + 2 * mult, height + 2 * mult, innerColor).setOrigin(0);
        this.add.rectangle(x, y, width, height, bgColor).setOrigin(0);
    }

    create() {        
        const width = this.sys.game.scale.gameSize.width;
        const height = this.sys.game.scale.gameSize.height;

        const inset = 10;
        const text = "This is a very carefully crafted test string.";
        // this.add.rectangle(10, 35, width - inset * 2, height - 45, 0x000088).setOrigin(0);
        this.drawTextBoxBackground(10, 35, width - inset * 2, height - 45);
        this.add.bitmapText(inset, inset, 'LegacYs', "Click to animate text.").setOrigin(0).setTint(0xffff00);
        this.wrapTypeText = this.add.bitmapText(width - inset, inset, 'LegacYs', "Naive word wrapping.").setOrigin(1, 0).setTint(0xffff00);
        this.refreshText();

        const animTextObj = new KHAnimatedText(this, inset * 2, 45, 'LegacYs', { naiveWrap: this.naiveWrap, timing: TIMING_NAIVE_SLOW }).setScale(3).setMaxWidth(width - inset * 4);
        animTextObj.setDropShadow(1, 1, 0x0, 1);

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