import Piece, {Cell, PieceColor, PieceType} from "./piece";
import {
    BoxGeometry,
    Color,
    DoubleSide,
    Light,
    Mesh,
    MeshBasicMaterial,
    MeshStandardMaterial,
    Object3D,
    PerspectiveCamera,
    PointLight,
    Raycaster,
    Scene,
    sRGBEncoding,
    Vector2,
    WebGLRenderer
} from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import CustomLoader from "./customLoader";

export default class Board {
    static instance: Board; // Singleton instance

    // --------------------------- THREEJS ----------------------------------
    scene: Scene;
    camera: PerspectiveCamera;
    renderer: WebGLRenderer;
    light: Light;
    stats: Stats;
    rayCaster = new Raycaster();
    mousePos = new Vector2();

    // --------------------------- CHESS ----------------------------------
    pieces: Piece[];
    cells: Cell[];
    selected: Piece; // Contient la pièce qui est selectionnée
    board: string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"; // Représente l'état initial du board, par manque de temps, ne sera jamias modifié
    currentPlayer = PieceColor.WHITE; // Représente le joueur actuel

    static getInstance() {
        return Board.instance ? Board.instance : new Board(); // Singleton
    }

    /**
     * Initialisation de THREEJS
     */
    init() {
        Board.instance = this;
        this.scene = new Scene();
        this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, .1, 10000);
        this.camera.position.z = 12;
        this.camera.position.y = -10;
        this.camera.rotateX(.5);

        this.renderer = new WebGLRenderer({alpha: true});
        this.renderer.outputEncoding = sRGBEncoding;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.append(this.renderer.domElement);

        this.light = new PointLight(0xffffff);
        this.light.position.set(this.camera.position.x, this.camera.position.y, this.camera.position.z);
        // this.light.castShadow = true;
        // this.light.intensity = .3;

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.render()
        }, false);
        window.addEventListener('mousemove', this.onMouseMove, false);
        window.addEventListener('mousedown', this.onMouseClick, false);

        this.stats = Stats();
        document.body.appendChild(this.stats.dom);

        this.initBoard();

        this.scene.background = null;
        this.scene.add(this.light);
    }

    async initBoard() {
        this.cells = [];
        let white = false;
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let depth = 5;
                let geometry = new BoxGeometry(2, 2, depth);
                let color = new MeshBasicMaterial({color: white ? 0xf0f0f0 : 0x0, side: DoubleSide});
                white = !white;
                let plane = new Mesh(geometry, color);
                plane.position.set(i * 2 - 8, j * 2 - 8, plane.position.z - depth / 2);
                this.cells.push(new Cell(new Vector2(i, j), plane));
                this.scene.add(plane);
            }
            white = !white;
        }

        let loader = new CustomLoader();
        await loader.load();
        let fen = this.board.split(" ");
        // Segment 1
        let seg1 = fen[0].split("/");
        this.pieces = [];
        for (let i = 0; i < seg1.length; i++) {
            let col = 0;
            for (let j = 0; j < seg1[i].length; j++) {
                let mesh: Promise<Mesh>;
                let type;
                switch (seg1[i][j].toLowerCase()) {
                    case "r":
                        mesh = loader.get(5);
                        type = PieceType.ROOK;
                        break;
                    case "n":
                        mesh = loader.get(2);
                        type = PieceType.KNIGHT;
                        break;
                    case "b":
                        mesh = loader.get(0);
                        type = PieceType.BISHOP;
                        break;
                    case "q":
                        mesh = loader.get(4);
                        type = PieceType.QUEEN;
                        break;
                    case "k":
                        mesh = loader.get(1);
                        type = PieceType.KING;
                        break;
                    case "p":
                        mesh = loader.get(3);
                        type = PieceType.PAWN;
                        break;
                }
                if (!isNaN(parseFloat(seg1[i][j])) && isFinite(Number(seg1[i][j]))) {
                    let skip = parseInt(seg1[i][j]);
                    col += skip;
                }
                if (mesh) {
                    let m: Mesh = (await mesh).clone();
                    m.position.set(col * 2 - 8, i * 2 - 8, m.position.z);
                    m.scale.set(.05, .05, .05);
                    m.rotateX(Math.PI / 2);
                    let color = seg1[i][j].toLowerCase() == seg1[i][j];
                    console.log(color, seg1[i][j]);
                    m.material = <MeshStandardMaterial>(<MeshStandardMaterial>m.material).clone();
                    (<MeshStandardMaterial>m.material).color = color ? new Color(Piece.WHITE_COLOR) : new Color(Piece.BLACK_COLOR);
                    this.pieces.push(new Piece(type, color ? PieceColor.WHITE : PieceColor.BLACK, m, new Vector2(col, i)));
                    col++;
                }
            }
        }
        this.pieces.forEach(p => {
            this.scene.add(p.mesh);
        })
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    animate = () => {
        requestAnimationFrame(this.animate);
        this.render();
        this.stats.update();
    };

    onMouseMove(event) {
        let board = Board.getInstance(); // On récupère l'instance du board
        board.mousePos.x = (event.clientX / window.innerWidth) * 2 - 1; // On met a jour la position de la souris.
        board.mousePos.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    onMouseClick() {
        let board = Board.getInstance();
        board.rayCaster.setFromCamera(board.mousePos, board.camera);
        let intersects = board.rayCaster.intersectObjects(board.scene.children);
        if (intersects.length > 0) {
            board.selectPiece(intersects[0].object);
            board.selectCell(intersects[0].object);
        } else
            board.clearSelected();
    }

    move(piece: Piece, position: Vector2): void {
        if (!this.isEmptyCell(position.x, position.y)) this.deletePiece(this.getPieceAt(position));
        piece.mesh.position.set(position.x * 2 - 8, position.y * 2 - 8, piece.mesh.position.z);
        this.currentPlayer = this.currentPlayer == PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE;
        piece.pos = position;
        console.log(this.pieces);
        this.clearSelected();
    }

    tempMove(piece: Piece, position: Vector2) {
        let lastPos = piece.pos.clone();
        piece.pos = position;
        return lastPos;
    }

    listMoves(piece: Piece): Vector2[] {
        let moves = [];
        let x = 0, y = 0;
        if (piece.type === PieceType.BISHOP || piece.type === PieceType.QUEEN) {
            x = piece.pos.x + 1;
            y = piece.pos.y + 1;
            while (this.isEmptyCell(x, y) && x <= 7 && y >= 0) {
                moves.push(new Vector2(x, y));
                x++;
                y++;
            }
            if (this.isEnemyCell(x, y, piece)) moves.push(new Vector2(x, y));
            x = piece.pos.x - 1;
            y = piece.pos.y - 1;
            while (this.isEmptyCell(x, y) && x >= 0 && y <= 7) {
                moves.push(new Vector2(x, y));
                x--;
                y--;
            }
            if (this.isEnemyCell(x, y, piece)) moves.push(new Vector2(x, y));
            x = piece.pos.x + 1;
            y = piece.pos.y - 1;
            while (this.isEmptyCell(x, y) && x <= 7 && y >= 0) {
                moves.push(new Vector2(x, y));
                x++;
                y--;
            }
            if (this.isEnemyCell(x, y, piece)) moves.push(new Vector2(x, y));
            x = piece.pos.x - 1;
            y = piece.pos.y + 1;
            while (this.isEmptyCell(x, y) && x >= 0 && y <= 7) {
                moves.push(new Vector2(x, y));
                x--;
                y++;
            }
            if (this.isEnemyCell(x, y, piece)) moves.push(new Vector2(x, y));
        }
        if (piece.type === PieceType.KING) {
            // ADD ROCK O-O
            x = piece.pos.x;
            y = piece.pos.y;
            if (this.isEmptyOrEnemyCell(x + 1, y, piece)) moves.push(new Vector2(x + 1, y));
            if (this.isEmptyOrEnemyCell(x - 1, y, piece)) moves.push(new Vector2(x - 1, y));
            if (this.isEmptyOrEnemyCell(x - 1, y + 1, piece)) moves.push(new Vector2(x - 1, y + 1));
            if (this.isEmptyOrEnemyCell(x + 1, y + 1, piece)) moves.push(new Vector2(x + 1, y + 1));
            if (this.isEmptyOrEnemyCell(x - 1, y - 1, piece)) moves.push(new Vector2(x - 1, y - 1));
            if (this.isEmptyOrEnemyCell(x + 1, y - 1, piece)) moves.push(new Vector2(x + 1, y - 1));
            if (this.isEmptyOrEnemyCell(x, y + 1, piece)) moves.push(new Vector2(x, y + 1));
            if (this.isEmptyOrEnemyCell(x, y - 1, piece)) moves.push(new Vector2(x, y - 1));

        }
        if (piece.type === PieceType.KNIGHT) {
            x = piece.pos.x;
            y = piece.pos.y;
            if (this.isEmptyOrEnemyCell(x + 2, y + 1, piece)) moves.push(new Vector2(x + 2, y + 1));
            if (this.isEmptyOrEnemyCell(x + 2, y - 1, piece)) moves.push(new Vector2(x + 2, y - 1));
            if (this.isEmptyOrEnemyCell(x - 2, y + 1, piece)) moves.push(new Vector2(x - 2, y + 1));
            if (this.isEmptyOrEnemyCell(x - 2, y - 1, piece)) moves.push(new Vector2(x - 2, y - 1));
            if (this.isEmptyOrEnemyCell(x + 1, y + 2, piece)) moves.push(new Vector2(x + 1, y + 2));
            if (this.isEmptyOrEnemyCell(x - 1, y + 2, piece)) moves.push(new Vector2(x - 1, y + 2));
            if (this.isEmptyOrEnemyCell(x + 1, y - 2, piece)) moves.push(new Vector2(x + 1, y - 2));
            if (this.isEmptyOrEnemyCell(x - 1, y - 2, piece)) moves.push(new Vector2(x - 1, y - 2));
        }
        if (piece.type === PieceType.PAWN) {
            y = piece.pos.y + (piece.color == PieceColor.WHITE ? 1 : -1);
            if (this.isEmptyCell(piece.pos.x, y))
                moves.push(new Vector2(piece.pos.x, y));
            if (this.isEnemyCell(piece.pos.x - 1, y, piece))
                moves.push(new Vector2(piece.pos.x - 1, y));
            if (this.isEnemyCell(piece.pos.x + 1, y, piece))
                moves.push(new Vector2(piece.pos.x + 1, y));
            if (piece.color == PieceColor.WHITE && piece.pos.y == 1 && this.isEmptyCell(piece.pos.x, piece.pos.y + 2))
                moves.push(new Vector2(piece.pos.x, piece.pos.y + 2));
            else if (piece.color == PieceColor.BLACK && piece.pos.y == 6 && this.isEmptyCell(piece.pos.x, piece.pos.y - 2))
                moves.push(new Vector2(piece.pos.x, piece.pos.y - 2));
        }
        if (piece.type === PieceType.ROOK || piece.type === PieceType.QUEEN) {
            x = piece.pos.x + 1;
            y = piece.pos.y;
            while (this.isEmptyCell(x, y) && x <= 7) {
                moves.push(new Vector2(x, y));
                x++;
            }
            if (this.isEnemyCell(x, y, piece)) moves.push(new Vector2(x, y));
            x = piece.pos.x - 1;
            y = piece.pos.y;
            while (this.isEmptyCell(x, y) && x >= 0) {
                moves.push(new Vector2(x, y));
                x--;
            }
            if (this.isEnemyCell(x, y, piece)) moves.push(new Vector2(x, y));
            x = piece.pos.x;
            y = piece.pos.y + 1;
            while (this.isEmptyCell(x, y) && y <= 7) {
                moves.push(new Vector2(x, y));
                y++;
            }
            if (this.isEnemyCell(x, y, piece)) moves.push(new Vector2(x, y));
            x = piece.pos.x;
            y = piece.pos.y - 1;
            while (this.isEmptyCell(x, y) && y >= 0) {
                moves.push(new Vector2(x, y));
                y--;
            }
            if (this.isEnemyCell(x, y, piece)) moves.push(new Vector2(x, y));
        }
        return moves;
    }

    isEmptyOrEnemyCell(x: number, y: number, piece: Piece) {
        return this.isEmptyCell(x, y) || this.isEnemyCell(x, y, piece);
    }

    isEnemyCell(x: number, y: number, piece: Piece) {
        return !this.isEmptyCell(x, y) && this.getPieceAt(new Vector2(x, y)).color != piece.color;
    }

    isEmptyCell(x: number, y: number): boolean {
        return this.getPieceAt(new Vector2(x, y)) == undefined;
    }

    selectPiece(object: Object3D): void {
        // On veut trouver la piece représentée par cet objet
        for (let p of this.pieces) {
            if (p.mesh.uuid == object.uuid) {
                if (this.selected && this.selected.color != p.color) {
                    if (this.isValidMove(p.pos, this.selected)) this.move(this.selected, p.pos.clone());
                } else {
                    if (p.color == this.currentPlayer) {
                        this.clearSelected();
                        this.selected = p;
                    }
                }
                break;
            }
        }
        if (!this.selected) return;
        if (this.selected.color == PieceColor.BLACK) this.selected.setDisplayColor(0x070b12);
        else this.selected.setDisplayColor(0xbad3ff);
    }

    selectCell(object: Object3D) {
        let selectedCell;
        for (let c of this.cells) {
            if (c.mesh.uuid == object.uuid) {
                selectedCell = c;
                break;
            }
        }
        if (!selectedCell || !this.selected) return;
        if (this.isValidMove(selectedCell.pos, this.selected)) this.move(this.selected, selectedCell.pos);
    }

    clearSelected(): void {
        if (this.selected) {
            if (this.selected.color == PieceColor.BLACK) this.selected.setDisplayColor(Piece.BLACK_COLOR);
            else this.selected.setDisplayColor(Piece.WHITE_COLOR);
            this.selected = undefined;
        }
    }

    getPieceAt(pos: Vector2) {
        return this.pieces.filter(p => p.pos.x == pos.x && p.pos.y == pos.y)[0];
    }

    isValidMove(pos: Vector2, piece: Piece): boolean {
        // if part of possible moves
        if (this.listMoves(piece).filter(v => v.x == pos.x && v.y == pos.y).length == 0) return false;

        let lastPos = this.tempMove(piece, pos);
        if (this.isInCheck(this.getKing(piece.color))) return false;
        this.tempMove(piece, lastPos);

        // if cell is not empty and occupant is not same color
        if (!this.isEmptyCell(pos.x, pos.y)) {
            return this.getPieceAt(pos).color != piece.color;
        }
        return true;
    }

    getKing(color: PieceColor) {
        return this.pieces.filter(p => p.type == PieceType.KING && p.color == color)[0];
    }

    isInCheck(king: Piece) {
        for (let p of this.pieces.filter(piece => piece.color != king.color)) {
            for (let m of this.listMoves(p)) {
                if (m.x == king.pos.x && m.y == king.pos.y) return true;
            }
        }
        return false;
    }

    deletePiece(piece: Piece): void {
        console.log("DELETING", piece);
        this.scene.remove(piece.mesh);
        piece.pos = new Vector2(-99, -99);
    }
}