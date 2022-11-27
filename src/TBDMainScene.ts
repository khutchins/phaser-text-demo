import { KHInputAxis } from "./KH/Input/Axis/KHInputAxis";
import { KHInputKey } from "./KH/Input/Key/KHInputKey";
import { KHPadAxis, KHPadInput } from "./KH/Input/KHInputProviderController";
import { KHInputScene } from "./KH/Input/KHInputScene";
import { KHInputSet } from "./KH/Input/KHInputSet";
import { KHAnimatedText } from "./KHTextAnimator";

enum AnimState {
    NotStarted,
    Animating,
    DoneAnimating
};

const DELAY = 50;

export class TBDMainScene extends Phaser.Scene {
    textObj: Phaser.GameObjects.BitmapText;
    text: string;
    idx: number;
    state: AnimState;
    event: Phaser.Time.TimerEvent;

    constructor() {
        super("TBDMainScene");
    }

    preload() {
        this.load.bitmapFont('LegacYs', 'assets/LegacYs.png', 'assets/LegacYs.fnt');
    }

    private nextLetter() {
        this.idx++;
        if (this.idx < this.text.length) {
            const newText = this.text.substring(0, this.idx);
            this.textObj.setText(newText);
            this.addTextCallback(DELAY);
        }
        else {
            this.doneAnimating();
        }
    }

    private doneAnimating() {
        if (this.state == AnimState.DoneAnimating) return;
        this.state = AnimState.DoneAnimating;
        this.textObj.setText(this.text);
        this.idx = this.text.length;
        if (this.event) this.event.remove(false);
    }

    private startAnimating() {
        if (this.state == AnimState.Animating) return;
        this.state = AnimState.Animating;
        this.textObj.setText("");
        this.idx = 0;
        this.addTextCallback(DELAY);
    }

    addTextCallback(delay: number) {
        if (delay > 0) {
            this.event = this.time.addEvent({
                delay: delay,
                callback: () => this.nextLetter(),
            });
        } else {
            this.nextLetter();
        }
    }

    clicked() {
        switch (this.state) {
            case AnimState.NotStarted:
                this.startAnimating();
                break;
            case AnimState.Animating:
                this.doneAnimating();
                break;
            case AnimState.DoneAnimating:
                this.startAnimating();
                break;
        }
    }

    create() {        
        const width = this.sys.game.scale.gameSize.width;

        const inset = 10;
        this.text = "This is a test of the emergency broadcast network.";
        this.text = "This is a very carefully crafted test string.";
        this.add.bitmapText(inset, inset, 'LegacYs', "Click to animate text.").setOrigin(0).setTint(0xffff00);
        this.add.bitmapText(width - inset, inset, 'LegacYs', "Naive word wrapping.").setOrigin(1, 0).setTint(0xffff00);
        // this.textObj = this.add.bitmapText(inset, 45, 'LegacYs', this.text).setScale(3).setMaxWidth(width - inset * 2);
        // const bounds = this.textObj.getTextBounds(false);
        // this.text = bounds.wrappedText || this.text;
        // this.textObj.setText("");
        this.state = AnimState.NotStarted;

        const animTextObj = new KHAnimatedText(this, inset, 45, 'LegacYs', { naiveWrap: false, delay: 100 }).setScale(3).setMaxWidth(width - inset * 2);
        
        this.input.on('pointerdown', () => {
            // this.clicked();
            if (animTextObj.isAnimating()) animTextObj.stopAnimation();
            else animTextObj.animateText(this.text);
        })
    }
}