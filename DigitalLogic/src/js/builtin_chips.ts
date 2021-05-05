import Chip from "./chip";
import Pin, {PinType} from "./pin";
import CustomChip from "./custom_chip";
import List from "./util/list";
import TruthTable from "./util/truth_table";

export class AndChip extends CustomChip {

    static chipName = "AND";
    static chipColor = "rgb(204,0,23)";
    static truthTable = new TruthTable([[0, 1, 0, 1], [0, 0, 1, 1]], [[0, 0, 0, 1]]);

    constructor(x: number, y: number) {
        super(x, y, AndChip.truthTable, AndChip.chipColor, AndChip.chipName, [new Pin("A"), new Pin("B")], [new Pin("Out")]);
    }

    // processOutput(): void {
    //     this.outputPins.get(0).receiveSignal(this.inputPins.get(0).currentState && this.inputPins.get(1).currentState ? 1 : 0);
    // }

}

export class NotChip extends CustomChip {
    static chipName = "NOT";
    static chipColor = "rgb(0, 204, 23)";
    static truthTable = new TruthTable([[0, 1]], [[1, 0]]);

    constructor(x: number, y: number) {
        super(x, y, NotChip.truthTable, NotChip.chipColor, NotChip.chipName, [new Pin("In")], [new Pin("Out")]);
    }
}