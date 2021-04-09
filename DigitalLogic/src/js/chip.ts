import List from "./util/list";
import P5 from "p5";
import Board from "./board";
import Pin, {PinType} from "./pin";

export default abstract class Chip{
    inputPins: List<Pin>;
    outputPins: List<Pin>;

    public color: string;
    public name: string;
    x: number;
    y: number;
    width: number;
    height: number;

    private offsetX: number;
    private offsetY: number;
    private dragging: boolean;

    protected constructor(color: string, name: string, x: number, y: number,
                          inputs: List<Pin> | Pin[], outputs: List<Pin> | Pin[]) {
        this.color = color;
        this.name = name;
        this.x = x;
        this.y = y;
        this.inputPins = inputs instanceof List ? inputs : new List(inputs);
        this.outputPins = outputs instanceof List ? outputs : new List(outputs);
        this.height = Math.max(inputs.length, outputs.length) * (30);
        this.width = 100;

        this.inputPins.foreach(p => {
            p.pinType = PinType.ChipInput;
            p.chip = this;
        });
        this.outputPins.foreach(p => {
            p.pinType = PinType.ChipOutput;
            p.chip = this;
        });
        this.updateChildrenPosition();
    }

    mousePressed(p5) {
        if (this.isMouseInside(p5) && !Board.getInstance().findPinAt(p5.mouseX, p5.mouseY)) {
            this.offsetX = this.x - p5.mouseX;
            this.offsetY = this.y - p5.mouseY;
            this.dragging = true;
        }
    }

    mouseReleased(p5) {
        this.dragging = false;
    }

    draw(p5: P5) {
        p5.push();
        p5.noStroke();
        if (this.dragging) {
            this.x = p5.mouseX + this.offsetX;
            this.y = p5.mouseY + this.offsetY;
            this.updateChildrenPosition();
        }
        p5.fill(this.color);
        p5.rect(this.x, this.y, this.width, this.height);
        this.inputPins.foreach(p => p.draw(p5));
        this.outputPins.foreach(p => p.draw(p5));
        p5.fill(255);
        p5.textSize(20);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.text(this.name, this.x + this.width / 2, this.y + this.height / 2);
        p5.pop();
    }

    isMouseInside(p5): boolean {
        return this.isInside(p5.mouseX, p5.mouseY);
    }

    isInside(x, y): boolean {
        return x > this.x && x <= this.x + this.width && y > this.y && y < this.y + this.height;
    }

    private updateChildrenPosition() {
        let dy = 0;
        this.inputPins.foreach((p, i) => {
            dy += (this.height - 2 * this.inputPins.length * p.radius) / (this.inputPins.length + 1) + p.radius;
            p.x = this.x;
            p.y = this.y + dy;
            dy += p.radius;
        });

        dy = 0;
        this.outputPins.foreach((p) => {
            dy += (this.height - 2 * this.outputPins.length * p.radius) / (this.outputPins.length + 1) + p.radius;
            p.x = this.x + this.width;
            p.y = this.y + dy;
            dy += p.radius;
        });
    }

    doubleClicked() {
        this.inputPins.foreach(p => p.destroyLinks());
        this.outputPins.foreach(p => p.destroyLinks());
    }

    receiveInputSignal() {
        //TODO Simulate the chip to process the signal
        this.processOutput();
    }

    abstract processOutput() : void;
}
