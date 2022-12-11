export interface KHAnimatedTextConfig {
    naiveWrap ?: boolean;
    delay ?: number;
    textSound ?: Phaser.Sound.BaseSound;
    timing : ITiming;
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

    constructor(scene: Phaser.Scene, x: number, y: number, font: string, config: KHAnimatedTextConfig = { timing: TIMING_NAIVE_SLOW }) {
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

            const delay = this.timingFor(this.animIdx);
            if (delay > 0 && this.config.textSound) this.config.textSound.play();
            this.addTextCallback(delay);
        }
        else {
            this.doneAnimating();
        }
    }

    private timingFor(idx: number): number {
        return this.config.timing(
            this.charAt(idx - 2),
            this.charAt(idx - 1),
            this.charAt(idx),
            this.config.timing
        )
    }

    private charAt(idx: number): string {
        if (idx < 0 || idx >= this.fullText.length) {
            return '\0';
        } return this.fullText.charAt(idx);
    }

    private doneAnimating() {
        if (this.state == AnimState.DoneAnimating) return;
        this.animState = AnimState.DoneAnimating;
        this.setText(this.fullText);
        this.animIdx = this.fullText.length;
        if (this.animEvent) this.animEvent.remove(false);
    }

    private startAnimating() {
        if (this.state == AnimState.Animating) return;
        this.animState = AnimState.Animating;
        this.setText("");
        this.animIdx = 0;
        this.addTextCallback(this.timingFor(0));
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

export const TIMING_NAIVE_SLOW: ITiming = function (prev: string, curr: string, next: string, timing: ITiming) {
    return 50;
};

export const TIMING_NAIVE: ITiming = function (prev: string, curr: string, next: string, timing: ITiming) {
    return 50;
};

export const TIMING_ITERATION_1: ITiming = function (prev: string, curr: string, next: string, timing: ITiming) {
    switch (curr) {
        case '\0':
        case ' ':
        case '\n':
            return 0;
        case '.':
        case '!':
        case '?':
        case ';':
            return 400;
        case ':':
        case '-':
        case ',':
            return 200;
        default:
            return 50;
    }
};

export const TIMING_ITERATION_2: ITiming = function (prev: string, curr: string, next: string, timing: ITiming) {
    // It looks odd to have extra time for a closing brace or quote,
    // so apply the previous time (which was skipped) to play them
    // together.
    switch (curr) {
        case ')':
        case '"':
        case ']':
        case '}':
            return timing('\0', prev, ' ', timing);
    }
    
    // If the next character is one that we handled above, immediately move on
    // to the next character. This character's delay will get added on at that
    // phase.
    switch (next) {
        case ')':
        case '"':
        case ']':
        case '}':
        case '\0':
            return 0;
    }
    
    switch (curr) {
        case '\0':
        case ' ':
        case '\n':
            return 0;
        case '.':
        case '!':
        case '?':
        case ';':
            return 400;
        case ':':
        case '—':
        case ',':
            return 200;
        default:
            return 50;
    }
};

export const TIMING_ITERATION_3: ITiming = function (prev: string, curr: string, next: string, timing: ITiming) {
    // It looks odd to have extra time for a closing brace or quote,
    // so apply the previous time (which was skipped) to play them
    // together.
    switch (curr) {
        case ')':
        case '"':
        case ']':
        case '}':
            return timing('\0', prev, ' ', timing);
    }
    
    // If the next character is one that we handled above, immediately move on
    // to the next character. This character's delay will get added on at that
    // phase.
    switch (next) {
        case ')':
        case '"':
        case ']':
        case '}':
        case '\0':
            return 0;
    }
    
    switch (curr) {
        case '\0':
        case ' ':
        case '\n':
            return 0;
        case '.':
            if (prev == '.' || next == '.') return 200;
        case '!':
        case '?':
        case ';':
            return 400;
        case ':':
        case '—':
        case ',':
            return 200;
        default:
            return 50;
    }
};

export interface ITiming {
    (prev: string, curr: string, next: string, timing: ITiming): number;
}