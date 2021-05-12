import P5 from "p5";
import Board from "./board";
import Pin, {PinType} from "./pin";
import Chip from "./chip";
import {AndChip, NotChip} from "./builtin_chips";
import TruthTable from "./util/truth_table";
import CustomChip from "./custom_chip";
import Start from "./start";

let cP5: P5;
let buttonIndex = 0;

let sketch = (p5: P5) => {
    // let newInputButton;
    let board: Board;
    let start: Start;
    let button;

    p5.setup = () => {
        cP5 = p5;
        const canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight - 100);
        // @ts-ignore
        for (let element of document.getElementsByClassName("p5Canvas")) {
            element.addEventListener("contextmenu", (e) => e.preventDefault());
        }
        console.log(p5.frameRate())
        start = new Start(p5);
        start.setup();
        board = new Board(p5.width, p5.height);
        button = p5.createButton("PACK");
        button.addClass("button hidden");
        button.position(0, p5.height);
        button.mouseClicked(() => board.pack());

        board.customChips.foreach((c, i) => {
            createButton(c, board);
        });
    };


    p5.draw = () => {
        p5.background(50);
        if (start.started) {
            board.draw(p5);
            p5.noFill();
            p5.stroke(255);
            p5.rect(100, 50, p5.width - 200, p5.height - 100);
        } else start.draw();
    };
    p5.windowResized = () => {
        p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    };

    p5.mousePressed = () => {
        board.mousePressed(p5);
    };

    p5.mouseReleased = () => {
        board.mouseReleased(p5);
    };

    p5.mouseClicked = () => {
        board.mouseClicked(p5);
    };

    p5.doubleClicked = () => {
        board.doubleClicked(p5);
    }
};

export function createButton(c, board) {
    let button = cP5.createButton(c.name);
    button.position(100 + buttonIndex * 100, cP5.height);
    button.mouseClicked(() => {
        board.chips.add(new CustomChip(cP5.width / 2, cP5.height / 2,
            c.truthTable, c.color, c.name, c.inputs.map(p => new Pin(p)),
            c.outputs.map(p => new Pin(p))));
    });
    button.addClass("button hidden");
    buttonIndex++;
}

new P5(sketch);