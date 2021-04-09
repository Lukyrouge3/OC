import P5 from "p5";
import Pin from "./pin";

export default class Wire {
    input: Pin;
    output: Pin;
    points: number[][];

    constructor(input: Pin, output: Pin, points?: number[][]) {
        this.input = input;
        this.output = output;
        if (points) this.points = points;
        else this.points = [];
    }

    draw(p5: P5): void {
        p5.push();

        p5.smooth();
        p5.strokeCap(p5.ROUND);
        p5.noFill();
        p5.stroke(0);
        p5.beginShape();
        p5.vertex(this.input.x, this.input.y);
        p5.vertex(this.input.x, this.input.y);
        for (let i = 0; i < this.points.length; i++) {
            p5.vertex(this.points[i][0], this.points[i][1]);
        }
        if (this.output) p5.vertex(this.output.x, this.output.y);
        else p5.vertex(p5.mouseX, p5.mouseY);
        if (this.output) p5.vertex(this.output.x, this.output.y);
        else p5.vertex(p5.mouseX, p5.mouseY);
        p5.endShape();
        p5.pop();

    }

    serialize(): string {
        return "";
    }
}