import P5 from "p5";
import List from "./util/list";
import Chip from "./chip";
import Board from "./board";
import Wire from "./wire";

export default class Pin {
    // The type of this pin
    public pinType: PinType;
    // The chip that this pin is attached to
    public chip: Chip;
    // The name of the pin
    public pinName: string;
    // The pin where the signal comes from
    public parentPin: Pin;
    // The pins where the signal will go to
    public childPins: List<Pin>;
    // The current state of this pin
    public currentState: number = 0;

    // The position of the pin
    public x: number;
    public y: number;

    // APPEARANCE
    // The color of the pin
    private color: string = "#000";
    // The hover color the of the pin
    private interactColor: string = "#bbb";
    // The radius of the pin
    public radius: number = 10;

    // If the pin is hovered or not
    private hovered: boolean = false;
    // If the pin was clicked or not
    private clicked: boolean = false;

    // Index of this pin in its associated board
    public index: number; // Only for serialization

    // W.I.P
    // public connections: List<Wire>;

    /**
     * @return boolean - The pin has a parent or is an output
     */
    get hasParent(): boolean {
        return this.parentPin != null || this.pinType === PinType.ChipOutput;
    }

    constructor(pinName: string, x?: number, y?: number, type?: PinType) {
        this.pinName = pinName;
        this.x = x;
        this.y = y;
        this.pinType = type;

        this.childPins = new List<Pin>();
        // this.connections = new List<Wire>(); W.I.P
    }

    /**
     * Spreads the signal over all connected pins
     * @param signal
     */
    receiveSignal(signal: number): void {
        this.currentState = signal;
        if (this.pinType == PinType.ChipInput && this.chip) this.chip.receiveInputSignal();
        else if (this.pinType == PinType.ChipOutput && this.childPins && this.childPins.length > 0) {
            for (let i = 0; i < this.childPins.length; i++) {
                this.childPins.get(i).receiveSignal(signal);
            }
        }
    }

    /**
     * Check if the pins have different types
     * @param pinA
     * @param pinB
     */
    static isValidConnection(pinA: Pin, pinB: Pin): boolean {
        return pinA.pinType != pinB.pinType;
    }

    /**
     * Connects 2 pins together
     * @param pinA
     * @param pinB
     * @param points
     */
    static makeConnection(pinA: Pin, pinB: Pin, points?: P5.Vector[]): void {
        if (this.isValidConnection(pinA, pinB)) {
            let parentPin = (pinA.pinType == PinType.ChipOutput) ? pinA : pinB;
            let childPin = (pinA.pinType == PinType.ChipInput) ? pinA : pinB;

            parentPin.childPins.add(childPin);
            if (parentPin != childPin.parentPin && childPin.parentPin) {
                console.log(childPin.parentPin);
                childPin.parentPin.childPins.remove(childPin);
                childPin.parentPin = parentPin;
            }
            childPin.parentPin = parentPin;
            parentPin.receiveSignal(parentPin.currentState);

            // parentPin.connections.add(new Wire(childPin, parentPin, [[250, 250]]));
        }
    }

    /**
     * Removes the connection between 2 pins
     * @param pinA
     * @param pinB
     */
    static removeConnection(pinA: Pin, pinB: Pin): void {
        let parentPin = (pinA.pinType == PinType.ChipOutput) ? pinA : pinB;
        let childPin = (pinA.pinType == PinType.ChipInput) ? pinA : pinB;

        parentPin.childPins.remove(childPin);
        childPin.parentPin = null;
    }

    /**
     * Triggers when the mouse enters the pin
     */
    mouseEnter(): void {
        this.hovered = true;
    }

    /**
     * Triggers when the mouse leaves the pin
     */
    mouseExit(): void {
        this.hovered = false;
    }

    /**
     * Check if the mouse is inside the pin
     * @param p5
     */
    isMouseInside(p5: P5): boolean {
        return p5.dist(this.x, this.y, p5.mouseX, p5.mouseY) < this.radius;
    }

    /**
     * Check if x, y is in the pin
     * @param x
     * @param y
     */
    isInside(x: number, y: number): boolean {
        return Math.abs(Math.sqrt((this.x - x) ** 2 + (this.y - y) ** 2)) < this.radius;
    }

    /**
     * Destroy all the links between this pin and the others
     */
    destroyLinks(): void {
        if (this.childPins.length > 0) this.childPins.foreach(p => Pin.removeConnection(this, p));
        if (this.parentPin) Pin.removeConnection(this.parentPin, this);
        this.currentState = 0;
    }

    /**
     * Triggers on a double click on the pin
     * @param p5
     */
    doubleClick(p5) {
        if (this.isMouseInside(p5)) {
            this.destroyLinks();
        }
    }

    /**
     * Draws the pin
     * @param p5
     */
    draw(p5: P5) {
        p5.push();
        p5.strokeWeight(4);
        p5.stroke(this.currentState ? "rgb(255, 100, 100)" : "rgb(0,0,0)");
        if (this.isMouseInside(p5)) this.mouseEnter();
        else if (this.hovered) this.mouseExit();
        if (this.clicked && p5.mouseIsPressed) p5.line(this.x, this.y, p5.mouseX, p5.mouseY);
        else if (p5.mouseIsPressed && this.isMouseInside(p5)) this.clicked = true;
        else if (this.clicked) {
            let pin = Board.getInstance().findPinAt(p5.mouseX, p5.mouseY);
            if (pin) Pin.makeConnection(this, pin);
            this.clicked = false;
        }
        this.childPins.foreach(c => p5.line(this.x, this.y, c.x, c.y));
        p5.noStroke();
        p5.fill(255);
        p5.textSize(15);
        p5.textAlign(p5.CENTER);
        if (this.hovered) p5.text(this.pinName, this.x, this.y - this.radius - 2);
        p5.fill(this.hovered ? this.interactColor : this.color);
        p5.ellipse(this.x, this.y, 2 * this.radius);
        p5.pop();
    }
}

export enum PinType {ChipInput, ChipOutput}