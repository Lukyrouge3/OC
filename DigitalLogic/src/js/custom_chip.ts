import Chip from "./chip";
import List from "./util/list";
import Pin from "./pin";
import TruthTable from "./util/truth_table";

export default class CustomChip extends Chip{
    static chipName;
    static chipColor;
    process: () => void;
    truthTable: TruthTable;

    processOutput(): void {
        this.outputPins.foreach((out, i) => {
            out.receiveSignal(this.truthTable.getOutput(this.inputPins.items, i));
        })
    }

    constructor(x: number, y: number, truthTable?: TruthTable, color?: string, name?: string, inputs?: List<Pin> | Pin[], outputs?: List<Pin> | Pin[]) {
        super(color, name, x, y, inputs, outputs);
        this.truthTable = truthTable;
    }
}

export class GeneratedCustomChip extends CustomChip {

    constructor(x: number, y: number, truthTable: TruthTable, color: string, name: string, inputs: List<Pin> | Pin[], outputs: List<Pin> | Pin[]) {
        super(x, y, truthTable, color, name, inputs, outputs);
    }
}