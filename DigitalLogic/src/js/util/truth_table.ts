import Chip from "../chip";
import Board from "../board";
import Pin from "../pin";

export default class TruthTable {
    tableInputs: number[][];
    tableOutputs: number[][];

    constructor(tableInputs: number[][], tableOutputs: number[][]) {
        this.tableInputs = tableInputs;
        this.tableOutputs = tableOutputs;
    }

    getOutput(inputs: Pin[], output: number): number {
        if (this.tableInputs && this.tableOutputs && output > this.tableOutputs.length - 1) throw new Error();
        let possibleLines: number[] = [];
        for (let i = 0; i < inputs.length; i++) {
            let ti = this.tableInputs[i];
            for (let j = 0; j < ti.length; j++) {
                if (ti[j] === inputs[i].currentState) {
                    if (i > 0 && possibleLines.indexOf(j) !== -1) {
                        possibleLines = possibleLines.splice(possibleLines.indexOf(j), 1);
                    } else if (i === 0) possibleLines.push(j);
                }
            }
        }
        return possibleLines.length === 1 ? this.tableOutputs[output][possibleLines[0]] : 0;
    }

    static dec2bin(dec) {
        return (dec >>> 0).toString(2);
    }

    static dec2binl(dec, length) {
        let a = this.dec2bin(dec);
        if (a.length < length) {
            for (let i = 0; i < length - a.length; i++) {
                a = "0" + a;
            }
        }
        return a;
    }

    static fromBoard(board: Board): TruthTable {
        let inputs: number[][] = [];
        let outputs: number[][] = [];
        for (let i = 0; i < 2 ** board.inputs.length; i++) {
            let b = this.dec2binl(i, board.inputs.length);
            board.inputs.foreach((input, j) => {
                if (!inputs[j]) inputs[j] = [parseInt(b[j])];
                else inputs[j].push(parseInt(b[j]));
                input.pin.receiveSignal(parseInt(b[j]));
            });
            board.outputs.foreach((out, j) => {
                if (!outputs[j]) outputs[j] = [out.pin.currentState];
                else outputs[j].push(out.pin.currentState);
            })
        }
        console.log(inputs, outputs);
        return new TruthTable(inputs, outputs);
    }
}