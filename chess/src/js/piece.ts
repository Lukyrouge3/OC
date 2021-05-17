import {Mesh, Vector3} from "three";

export default class Piece {
    type: PieceType; // Le type de piece
    color: PieceColor; // La couleur de la piece
    mesh: Mesh; // L'objet 3d

    coordinates: string; // E.g A2, B4, ...

    get normalMoves(): string[] {
        return []; // TODO: implement
    }
}

export enum PieceType {BISHOP, KING, KNIGHT, PAWN, QUEEN, ROOK}
export enum PieceColor {WHITE, BLACK}
