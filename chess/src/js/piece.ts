import {BufferGeometry, Material, Mesh, Vector2} from "three";


export default class Piece {
    static BLACK_COLOR = 0x080808;
    static WHITE_COLOR = 0xffffff;

    type: PieceType; // Le type de piece
    color: PieceColor; // La couleur de la piece
    mesh: Mesh; // L'objet 3d

    pos: Vector2; // E.g A2, B4, ...

    constructor(type: PieceType, color: PieceColor, mesh: Mesh<BufferGeometry, Material | Material[]>, pos: Vector2) {
        this.type = type;
        this.color = color;
        this.mesh = mesh;
        this.pos = pos;
    }

    setDisplayColor(color: number) {
        // @ts-ignore
        this.mesh.material.color.set(color);
    }
}

export class Cell {
    pos: Vector2;
    mesh: Mesh;


    constructor(pos: Vector2, mesh: Mesh<BufferGeometry, Material | Material[]>) {
        this.pos = pos;
        this.mesh = mesh;
    }
}

export enum PieceType {BISHOP, KING, KNIGHT, PAWN, QUEEN, ROOK}

export enum PieceColor {WHITE, BLACK}
