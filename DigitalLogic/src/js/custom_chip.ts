import Chip from "./chip";
import List from "./util/list";
import Pin from "./pin";

export default class CustomChip extends Chip{
    static chipName;
    static chipColor;
    process: () => void;

    processOutput(): void {
    }

    protected constructor(x: number, y: number, color?: string, name?: string, inputs?: List<Pin> | Pin[], outputs?: List<Pin> | Pin[]) {
        super(color, name, x, y, inputs, outputs);
    }
}