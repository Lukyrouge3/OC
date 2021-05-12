import Chip from "./chip";
import Pin, {PinType} from "./pin";
import CustomChip from "./custom_chip";
import List from "./util/list";
import TruthTable from "./util/truth_table";
import {ChipHolder} from "./board";

const ANDTruthTable = new TruthTable([[0, 1, 0, 1], [0, 0, 1, 1]], [[0, 0, 0, 1]]);
const NOTTruthTable = new TruthTable([[0, 1]], [[1, 0]]);


export const AndChip: ChipHolder = {
    truthTable: ANDTruthTable, name: "AND", color: "rgb(204, 0, 23)",
    inputs: ["A", "B"],
    outputs: ["Out"]
}
export const NotChip: ChipHolder = {
    truthTable: NOTTruthTable,
    name: "NOT",
    color: "rgb(0, 204, 23)",
    inputs: ["A"],
    outputs: ["Out"]
}