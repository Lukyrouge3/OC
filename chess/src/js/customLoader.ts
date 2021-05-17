import {DoubleSide, Mesh, MeshStandardMaterial} from "three";
import {STLLoader} from "three/examples/jsm/loaders/STLLoader";

const fileNames = ["Bishop", "King", "Knight", "Pawn", "Queen", "Rook"];
const material = new MeshStandardMaterial({
    depthTest: true,
    depthWrite: true,
    side: DoubleSide,
    color: 0xffffff,
    roughness: .1,
    emissive: 0x0,
    metalness: 0,
    transparent: true,
    opacity: 0.6
});

export default class CustomLoader {
    models: Map<number, Mesh>;
    ready = false;

    constructor() {
        this.load();
    }

    load() {
        let loader = new STLLoader();
        if (!this.models || this.models.size == 0) {
            this.models = new Map();
            fileNames.forEach((f, i) => {
                loader.load("models/" + f + ".STL", geometry => {
                    let mesh = new Mesh(geometry, material);
                    mesh.scale.set(.01, .01, .01);
                    this.models.set(i, mesh);
                    if (this.models.size == fileNames.length) this.ready = true;
                }, () => {
                }, error => console.log(error));
            });
        }
    }
}