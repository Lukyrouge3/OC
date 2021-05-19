import Piece from "./piece";
import {Camera, Color, DirectionalLight, PerspectiveCamera, Scene, sRGBEncoding, WebGLRenderer} from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import CustomLoader from "./customLoader";

export default class Board {
    pieces: Piece[];
    scene: Scene;
    camera: PerspectiveCamera;
    renderer: WebGLRenderer;
    light: DirectionalLight;
    stats: Stats;

    init() {
        this.scene = new Scene();
        this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, .1, 10000);
        this.camera.position.y = 0;

        this.renderer = new WebGLRenderer();
        this.renderer.outputEncoding = sRGBEncoding;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.append(this.renderer.domElement);

        this.light = new DirectionalLight(0x404040);
        this.light.position.set(100, 300, 100);
        this.light.castShadow = true;

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.render()
        }, false);

        this.stats = Stats();
        document.body.appendChild(this.stats.dom);

        let loader = new CustomLoader();
        loader.get(0).then(model => {
            this.scene.add(model);
        });

        this.scene.background = new Color(0x404040);
        this.scene.add(this.light);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    animate = () => {
        requestAnimationFrame(this.animate);
        this.render();
        this.stats.update();
    };

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