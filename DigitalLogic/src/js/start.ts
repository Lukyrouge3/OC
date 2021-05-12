import P5 from "p5";

type text = { text: string, size: number, duration: number };
export default class Start {

    private p5: P5;
    public started = false;
    private texts: text[] = []
    private textIndex = 0;
    private currentDuration = 0;
    private vanishTime = 1;

    constructor(p5: P5) {
        this.p5 = p5;
    }

    private addText(text: string, size: number, duration: number) {
        this.texts.push({text, size, duration});
    }

    setup() {
        this.addText("Bienvenue !", 30, 3);
        this.addText("Ici, vous allez pouvoir découvrir\nLes bases de la logique", 20, 5)
    }


    draw() {
        let currentText = this.texts[this.textIndex];
        this.currentDuration += this.p5.deltaTime / 1000;
        if (this.currentDuration > currentText.duration + 2 * this.vanishTime) {
            this.textIndex++;
            if (this.textIndex < this.texts.length) {
                this.currentDuration = 0;
                currentText = this.texts[this.textIndex];
            } else this.started = true;
        } else if (this.currentDuration < this.vanishTime) {
            this.p5.fill(50 + (this.currentDuration) * 205);
        } else if (this.currentDuration > currentText.duration + this.vanishTime) {
            this.p5.fill(255 - (this.currentDuration - currentText.duration - this.vanishTime) * 205);
        } else this.p5.fill(255);
        // console.log(currentText, this.textIndex, this.currentDuration);
        if (!this.started) {
            this.p5.textSize(currentText.size);
            this.p5.text(currentText.text, this.p5.width / 2 - this.p5.textWidth(currentText.text) / 2,
                this.p5.height / 2 - currentText.size / 2);
        }
    }
}