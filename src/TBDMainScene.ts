import Phaser = require("phaser");
import { KHAnimatedText, KHAnimatedTextConfig, TIMING_ITERATION_1, TIMING_ITERATION_2, TIMING_ITERATION_3, TIMING_NAIVE, TIMING_NAIVE_SLOW } from "./KHTextAnimator";

enum ExampleType {
    Wrap,
    Timing
}

export class TBDMainScene extends Phaser.Scene {

    private wrapTypeText: Phaser.GameObjects.BitmapText;
    private demoString: string;
    private demoType: ExampleType;
    private config: KHAnimatedTextConfig;

    private readonly TIMING_ORDER = [
        TIMING_NAIVE_SLOW,
        TIMING_ITERATION_1,
        TIMING_ITERATION_2,
        TIMING_ITERATION_3
    ]

    constructor() {
        super("TBDMainScene");
    }

    preload() {
        this.load.bitmapFont('LegacYs', '/img/better-text-boxes/LegacYs.png', '/img/better-text-boxes/LegacYs.fnt');
        this.load.audio('blip', '/img/better-text-boxes/text-noise.mp3');
    }

    private refreshText() {
        switch (this.demoType) {
            case ExampleType.Wrap:
                this.wrapTypeText.setText(this.config.naiveWrap ? "Naive word wrapping." : "Wrap-aware word wrapping.")
                break;
            case ExampleType.Timing: 
            default: {
                let text;
                switch (this.config.timing) {
                    case TIMING_NAIVE_SLOW:
                    default:
                        text = "Naive timing";
                        break;
                    case TIMING_ITERATION_1:
                        text = "Timing Mk. 1"
                        break;
                    case TIMING_ITERATION_2:
                        text = "Timing Mk. 2"
                        break;
                    case TIMING_ITERATION_3:
                        text = "Timing Mk. 3"
                        break;
                }
                this.wrapTypeText.setText(text)
                break;
            }
        }
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
        this.game.sound.mute = true;
        const width = this.sys.game.scale.gameSize.width;
        const height = this.sys.game.scale.gameSize.height;

        this.demoString = (this.game as any).demoType;
        let scale = 2;
        let text;
        if (this.demoString.startsWith("wrap")) {
            scale = 3;
            text = "This is a very carefully crafted test string.";
            this.demoType = ExampleType.Wrap;
        } else {
            this.demoType = ExampleType.Timing;
            text = '"Hey," she said. "Be careful: green ideas sleep furiously!" I don\'t know what she\'s talking about... do you?';
        }

        console.log(this.demoString);
        switch (this.demoString) {
            case "wrap":
            default:
                this.config = { naiveWrap: true, timing: TIMING_NAIVE_SLOW };
                break;
            case "timing-1":
                this.config = { naiveWrap: false, timing: TIMING_NAIVE };
                break;
            case "timing-2":
                this.config = { naiveWrap: false, timing: TIMING_ITERATION_1 };
                break;
            case "timing-3":
                this.config = { naiveWrap: false, timing: TIMING_ITERATION_2 };
                break;
            case "timing-4":
            case "timing-all":
                this.config = { naiveWrap: false, timing: TIMING_ITERATION_3 };
                break;
        }

        this.config.textSound = this.sound.add('blip');

        const inset = 10;
        // this.add.rectangle(10, 35, width - inset * 2, height - 45, 0x000088).setOrigin(0);
        this.drawTextBoxBackground(10, 35, width - inset * 2, height - 45);
        this.add.bitmapText(inset, inset, 'LegacYs', "Click to animate text.").setOrigin(0).setTint(0xffff00);
        this.wrapTypeText = this.add.bitmapText(width - inset, inset, 'LegacYs', "Naive word wrapping.").setOrigin(1, 0).setTint(0xffff00);
        this.refreshText();

        const animTextObj = new KHAnimatedText(this, inset * 2, 45, 'LegacYs', this.config).setScale(scale).setMaxWidth(width - inset * 4);
        animTextObj.setDropShadow(1, 1, 0x0, 1);

        this.input.mouse.disableContextMenu();

        if (this.demoType != ExampleType.Wrap) {
            this.input.keyboard.on('keydown-M', () => {
                this.game.sound.mute = !this.game.sound.mute;
            })
        }
        
        this.input.on('pointerdown', (pointer) => {
            // Toggle wrap mode.
            if (pointer.rightButtonDown()) {
                if (this.demoType == ExampleType.Wrap) {
                    this.config.naiveWrap = !this.config.naiveWrap;
                } else if (this.demoString == "timing-all") {
                    this.config.timing = this.TIMING_ORDER[(this.TIMING_ORDER.indexOf(this.config.timing) + 1) % this.TIMING_ORDER.length];
                }
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