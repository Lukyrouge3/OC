import {BufferGeometry, DoubleSide, Mesh, MeshStandardMaterial} from "three";
import {STLLoader} from "three/examples/jsm/loaders/STLLoader";
import {Geometry} from "three/examples/jsm/deprecated/Geometry";

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
    loaded = false;

    constructor() {
    }

    async get(index): Promise<Mesh> {
        if (!this.loaded) await this.load();
        return this.models.get(index);
    }

    async load() {
        let loader = new STLLoader();
        if (!this.models || this.models.size == 0) {
            this.models = new Map();
            for (const f of fileNames) {
                let i = fileNames.indexOf(f);
                let geometry = await loader.loadAsync("models/" + f + ".STL", () => {
                });
                let mesh = new Mesh(geometry, material);
                mesh.scale.set(.01, .01, .01);
                this.models.set(i, mesh);
            }
        }
        this.loaded = true;
    }
}