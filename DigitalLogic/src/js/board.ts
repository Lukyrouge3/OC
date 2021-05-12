import List from "./util/list";
import Chip from "./chip";
import P5 from "p5";
import Pin, {PinType} from "./pin";
import CustomChip from "./custom_chip";
import {AndChip, NotChip} from "./builtin_chips";
import {BoardPort} from "./board_port";
import TruthTable from "./util/truth_table";
import {createButton} from "./sketch";

export type ChipHolder = { truthTable: TruthTable, name: string, color: string, inputs: string[], outputs: string[] }

export default class Board {
    public chips: List<Chip>;
    public inputs: List<BoardPort>;
    public outputs: List<BoardPort>;
    static instance: Board;

    public width: number;
    public height: number;

    public customChips: List<ChipHolder>;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        Board.instance = this;
        this.init();
    }

    init() {
        this.chips = new List<Chip>();
        this.inputs = new List<BoardPort>();
        this.outputs = new List<BoardPort>();
        this.customChips = new List<ChipHolder>();
        this.customChips.add(AndChip);
        this.customChips.add(NotChip);

        this.createInput(this.height / 2);
        this.createOutput(this.height / 2);
    }

    findPinAt(x: number, y: number): Pin {
        let pin: Pin;
        this.chips.foreach(chip => {
            chip.inputPins.foreach(p => {
                if (p.isInside(x, y)) {
                    pin = p;
                    return;
                }
            });
            chip.outputPins.foreach(p => {
                if (p.isInside(x, y)) {
                    pin = p;
                    return;
                }
            });
        });
        this.inputs.foreach(c => {
            if (c.pin.isInside(x, y)) {
                pin = c.pin;
                return;
            }
        });
        this.outputs.foreach(c => {
            if (c.pin.isInside(x, y)) {
                pin = c.pin;
                return;
            }
        });
        return pin;
    }

    findChipAt(x: number, y: number): Chip {
        return this.chips.find(c => {
            return c.isInside(x, y);
        }, true);
    }

    draw(p5: P5): void {
        this.chips.foreach(c => c.draw(p5));
        this.inputs.foreach(i => i.draw(p5));
        this.outputs.foreach(i => i.draw(p5));

        // p5.push();
        // let dx = 0;
        // p5.textSize(20);
        // p5.textAlign(p5.CENTER, p5.CENTER);
        // p5.fill(c.chipColor);
        // p5.stroke(255);
        // p5.rect(100 + dx, p5.height - 40, p5.textWidth(c.chipName) + 20, 30);
        // p5.noStroke();
        // p5.fill(255);
        // p5.text(c.chipName, 100 + dx, p5.height - 40, p5.textWidth(c.chipName) + 20, 30);
        // dx += p5.textWidth(c.chipName) + 25;

        // p5.pop();
    }

    mousePressed(p5: P5): void {
        if (p5.mouseButton == p5.RIGHT) {
            this.inputs.foreach(i => i.mousePressed(p5));
            this.outputs.foreach(i => i.mousePressed(p5));
        } else {
            let chip = this.findChipAt(p5.mouseX, p5.mouseY);
            if (chip) {
                chip.mousePressed(p5);
                this.chips.bringFirst(chip);
            }

        }
    }

    mouseReleased(p5): void {
        this.chips.foreach(c => c.mouseReleased(p5));
        this.inputs.foreach(i => i.mouseReleased());
        this.outputs.foreach(i => i.mouseReleased());
    }

    doubleClicked(p5) {
        if (Board.getInstance().findPinAt(p5.mouseX, p5.mouseY)) {
            this.chips.foreach(c => c.doubleClicked());
        } else {
            let chip = Board.getInstance().findChipAt(p5.mouseX, p5.mouseY);
            if (chip) {
                chip.doubleClicked();
                this.chips.remove(chip);
            }
        }
        let input;
        this.inputs.foreach(i => {
            if (i.isInside(p5)) input = i;
        });
        if (input) this.inputs.remove(input);
        let output;
        this.outputs.foreach(i => {
            if (i.isInside(p5)) output = i;
        });
        if (output) this.outputs.remove(output);
        if (!input && p5.mouseX > 0 && p5.mouseX <= 100 && p5.mouseY > 100 && p5.mouseY <= p5.height - 100) this.createInput(p5.mouseY);
        if (!output && p5.mouseX > p5.width - 100 && p5.mouseX < p5.width && p5.mouseY > 100 && p5.mouseY < p5.height - 100) this.createOutput(p5.mouseY);

    }

    static getInstance(): Board {
        if (this.instance) return this.instance;
        else return new Board(0, 0);
    }

    mouseClicked(p5: P5) {
        this.inputs.foreach(i => i.mouseClicked(p5));
    }

    createInput(y: number) {
        this.inputs.add(new BoardPort(y, 100, "Input " + (this.inputs.length), PinType.ChipOutput));
    }

    createOutput(y: number) {
        this.outputs.add(new BoardPort(y, this.width - 100, "Output " + this.outputs.length, PinType.ChipInput))
    }

    pack() {
        let truth = TruthTable.fromBoard(this);
        let name = prompt("Please enter the new chip's name");
        this.customChips.add({
            truthTable: truth,
            name,
            color: "rgb(0,0,0)",
            inputs: this.inputs.items.map(p => p.pin.pinName),
            outputs: this.outputs.items.map(p => p.pin.pinName)
        })
        createButton(this.customChips.get(this.customChips.length - 1), this);
        this.clear();
    }

    clear() {
        this.init();
    }
}