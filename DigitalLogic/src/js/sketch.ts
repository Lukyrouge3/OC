import P5 from "p5";
import Board from "./board";
import Pin, {PinType} from "./pin";
import Chip from "./chip";
import {AndChip, NotChip} from "./builtin_chips";
import TruthTable from "./util/truth_table";

let sketch = (p5: P5) => {
    // let newInputButton;
    let board: Board;
    let button;

    p5.setup = () => {
        const canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight - 100);
        // @ts-ignore
        for (let element of document.getElementsByClassName("p5Canvas")) {
            element.addEventListener("contextmenu", (e) => e.preventDefault());
        }
        board = new Board(p5.width, p5.height);
        button = p5.createButton("Truth");
        button.position(0, p5.height);
        button.mouseClicked(() => board.pack());

        board.customChips.foreach((c, i) => {
            let button = p5.createButton(c.chipName);
            button.position(100 + i * 100, p5.height);
            button.mouseClicked(() => {
                board.chips.add(new c(p5.width / 2, p5.height / 2));
            })
        });
    };

    p5.draw = () => {
        p5.background(50);
        p5.noFill();
        p5.stroke(255);
        p5.rect(100, 50, p5.width - 200, p5.height - 100);
        board.draw(p5);
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

new P5(sketch);