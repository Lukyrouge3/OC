import Piece, {PieceColor, PieceType} from "./piece";
import {
    AmbientLight,
    Color,
    DirectionalLight,
    DoubleSide, Light,
    Mesh,
    MeshBasicMaterial, MeshStandardMaterial,
    PerspectiveCamera,
    PlaneGeometry, PointLight, Raycaster,
    Scene,
    sRGBEncoding, Vector2, Vector3,
    WebGLRenderer
} from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import CustomLoader from "./customLoader";

export default class Board {
    pieces: Piece[];
    scene: Scene;
    camera: PerspectiveCamera;
    renderer: WebGLRenderer;
    light: Light;
    stats: Stats;
    rayCaster = new Raycaster();

    board: string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    mouse = new Vector2();

    init() {
        this.scene = new Scene();
        this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, .1, 10000);
        this.camera.position.z = 12;
        this.camera.position.y = -10;
        this.camera.rotateX(.5);

        this.renderer = new WebGLRenderer();
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

        this.scene.background = new Color(0x404040);
        this.scene.add(this.light);
    }

    async initBoard() {
        let white = false;
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let geometry = new PlaneGeometry(2, 2);
                let color = new MeshBasicMaterial({color: white ? 0xf0f0f0 : 0x0, side: DoubleSide})
                white = !white;
                let plane = new Mesh(geometry, color);
                plane.position.set(i * 2 - 8, j * 2 - 8, plane.position.z);
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
                let posCorrect = new Vector3();
                switch (seg1[i][j].toLowerCase()) {
                    case "r":
                        mesh = loader.get(5);
                        type = PieceType.ROOK;
                        posCorrect.set(-.05, 0, 0);
                        break;
                    case "n":
                        mesh = loader.get(2);
                        type = PieceType.KNIGHT;
                        posCorrect.set(-.05, 0, 0);
                        break;
                    case "b":
                        mesh = loader.get(0);
                        type = PieceType.BISHOP;
                        posCorrect.set(-.05, 0, 0);
                        break;
                    case "q":
                        mesh = loader.get(4);
                        type = PieceType.QUEEN;
                        posCorrect.set(-3.5, 0, 0);
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
                if (mesh) {
                    let m: Mesh = (await mesh).clone();
                    m.position.set(col * 2 - 8.5, i * 2 - 7.5, m.position.z);
                    m.position.add(posCorrect);
                    m.scale.set(.05, .05, .05);
                    m.rotateX(Math.PI / 2);
                    let color = seg1[i][j].toLowerCase() == seg1[i][j];
                    console.log(color, seg1[i][j]);
                    m.material = <MeshStandardMaterial>(<MeshStandardMaterial>m.material).clone();
                    (<MeshStandardMaterial>m.material).color = color ? new Color(0xffffff) : new Color(0x0);
                    this.pieces.push(new Piece(
                        type,
                        color ? PieceColor.WHITE : PieceColor.BLACK,
                        m
                    ));
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
        if (!this.mouse) this.mouse = new Vector2();
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    onMouseClick() {
        if (!this.rayCaster) this.rayCaster = new Raycaster();
        this.rayCaster.setFromCamera(this.mouse, this.camera)
        let intersects = this.rayCaster.intersectObjects(this.scene.children);
        // @ts-ignore
        intersects[0].object.material.color.set(0xff0000);
    }

    move(piece
             :
             Piece, position
             :
             string
    ):
        void {
        //TODO
    }

    isWin()
        :
        boolean {
        return false; //TODO
    }

    isDraw()
        :
        boolean {
        return false; //TODO
    }

    listMoves(piece
                  :
                  Piece
    ):
        string[] {
        return piece.normalMoves; // TODO
    }

    get state()
        :
        string {
        return ""; // TODO
    }
}