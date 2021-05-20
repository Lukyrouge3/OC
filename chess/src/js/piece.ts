import {BufferGeometry, Material, Mesh, Vector3} from "three";

export default class Piece {
    type: PieceType; // Le type de piece
    color: PieceColor; // La couleur de la piece
    mesh: Mesh; // L'objet 3d

    // coordinates: string; // E.g A2, B4, ...

    constructor(type: PieceType, color: PieceColor, mesh: Mesh<BufferGeometry, Material | Material[]>) {
        this.type = type;
        this.color = color;
        this.mesh = mesh;
    }

    get normalMoves(): string[] {
        return []; // TODO: implement
    }
}

export enum PieceType {BISHOP, KING, KNIGHT, PAWN, QUEEN, ROOK}

export enum PieceColor {WHITE, BLACK}
