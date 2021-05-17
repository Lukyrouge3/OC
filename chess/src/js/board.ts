import Piece from "./piece";

export default class Board {
    pieces: Piece[];

    move(piece: Piece, position: string): void {
        //TODO
    }

    isWin(): boolean {
        return false; //TODO
    }

    isDraw(): boolean {
        return false; //TODO
    }

    listMoves(piece: Piece): string[] {
        return piece.normalMoves; // TODO
    }

    get state(): string {
        return ""; // TODO
    }
}