import Pin, {PinType} from "./pin";
import P5 from "p5";

export class BoardPort {
    public y: number;
    public name: string;
    public pin: Pin;
    public pinType: PinType;
    public x: number;
    private activated: boolean;
    private radius = 20;
    private offsetY: number;
    private dragged: boolean;

    constructor(y: number, x: number, name: string, pinType: PinType) {
        this.x = x;
        this.y = y;
        this.name = name;
        this.pin = new Pin(name, x + (pinType == PinType.ChipOutput ? 1 : -1) * this.radius * 1.8, y, pinType);
        this.pin.currentState = 0;
        this.pinType = pinType;
    }

    mouseClicked(p5): boolean {
        if (this.isInside(p5)) {
            this.activated = !this.activated;
            this.pin.receiveSignal(this.activated ? 1 : 0);
            return true;
        }
        return false;
    }

    isInside(p5): boolean {
        return p5.dist(p5.mouseX, p5.mouseY, this.x, this.y) < this.radius;
    }

    draw(p5: P5): void {
        if (this.dragged) {
            this.y = p5.mouseY - this.offsetY;
            this.pin.y = this.y;
        }
        p5.push();
        p5.stroke(0);
        p5.strokeWeight(5);
        p5.line(this.x, this.y, this.x + (this.pinType == PinType.ChipOutput ? 1 : -1) * this.radius * 1.8, this.y);
        p5.fill(this.pin.currentState ? "rgb(250, 100, 100)" : "rgb(175,175,175)");
        p5.noStroke();
        p5.ellipse(this.x, this.y, 2 * this.radius);
        p5.fill(255);
        p5.textAlign(p5.CENTER);
        p5.text(this.name, this.x, this.y - this.radius - 5);
        if (this.pinType == PinType.ChipInput) p5.text(this.pin.currentState + "", this.x, this.y + this.radius + 10);
        p5.pop();
        this.pin.draw(p5);
    }

    mousePressed(p5: P5) {
        if (p5.dist(p5.mouseX, p5.mouseY, this.x, this.y) < this.radius) {
            this.dragged = true;
            this.offsetY = p5.mouseY - this.y;
        }
    }

    mouseReleased() {
        this.dragged = false;
    }

}