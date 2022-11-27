export interface KHAnimatedTextConfig {
    naiveWrap ?: boolean;
    delay ?: number;
}

enum AnimState {
    NotStarted,
    Animating,
    DoneAnimating
};

export class KHAnimatedText extends Phaser.GameObjects.BitmapText {

    private fullText: string;
    private animState: AnimState;
    private animIdx: number;
    private animEvent: Phaser.Time.TimerEvent;
    config: KHAnimatedTextConfig;

    constructor(scene: Phaser.Scene, x: number, y: number, font: string, config: KHAnimatedTextConfig = {}) {
        super(scene, x, y, font, "");
        this.config = config;
        this.config.delay = this.config.delay || 100;
        this.scene.add.existing(this);
    }

    private nextLetter() {
        this.animIdx++;
        if (this.animIdx <= this.fullText.length) {
            const newText = this.fullText.substring(0, this.animIdx);
            this.setText(newText);
            this.addTextCallback(this.getAnimDelay());
        }
        else {
            this.doneAnimating();
        }
    }

    private doneAnimating() {
        if (this.state == AnimState.DoneAnimating) return;
        this.animState = AnimState.DoneAnimating;
        this.setText(this.fullText);
        this.animIdx = this.fullText.length;
        if (this.animEvent) this.animEvent.remove(false);
    }

    private getAnimDelay(): number {
        return this.config.delay || 100;
    }

    private startAnimating() {
        if (this.state == AnimState.Animating) return;
        this.animState = AnimState.Animating;
        this.setText("");
        this.animIdx = 0;
        this.addTextCallback(this.getAnimDelay());
    }

    private addTextCallback(delay: number) {
        if (delay > 0) {
            this.animEvent = this.scene.time.addEvent({
                delay: delay,
                callback: () => this.nextLetter(),
            });
        } else {
            this.nextLetter();
        }
    }

    animateText(text: string) {
        this.fullText = text;
        if (!this.config.naiveWrap) {
            this.setText(this.fullText);
            const bounds = this.getTextBounds(false);
            this.fullText = bounds.wrappedText || this.fullText;
        }
        this.setText("");
        this.startAnimating();
    }

    isAnimating(): boolean {
        return this.animState == AnimState.Animating;
    }

    stopAnimation() {
        if (this.animState != AnimState.Animating) return;
        this.doneAnimating();
    }
}