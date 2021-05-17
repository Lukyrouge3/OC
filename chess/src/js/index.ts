// import * as THREE from "three"
// import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
// import {STLLoader} from "three/examples/jsm/loaders/STLLoader";
// import Stats from "three/examples/jsm/libs/stats.module";
// import {Color} from "three";
//
// const scene: THREE.Scene = new THREE.Scene();
//
// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);
//
// const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100000);
// camera.position.z = 3;
//
// const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
// renderer.outputEncoding = THREE.sRGBEncoding;
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);
//
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;
//
// const envTexture = new THREE.CubeTextureLoader().load(["img/px_25.jpg", "img/nx_25.jpg", "img/py_25.jpg", "img/ny_25.jpg", "img/pz_25.jpg", "img/nz_25.jpg"]);
// envTexture.mapping = THREE.CubeReflectionMapping;
// const light = new THREE.DirectionalLight(0x404040); // soft white light
// light.position.set(100, 300, 100);
// scene.add(light);
// const material = new THREE.MeshStandardMaterial({
//     depthTest: true,
//     depthWrite: true,
//     side: THREE.DoubleSide,
//     color: 0xffffff,
//     roughness: .1,
//     emissive: 0x0,
//     metalness: 0,
//     transparent: true,
//     opacity: 0.6
// });
// light.castShadow = true;
// scene.background = new Color(0x404040);
// const loader = new STLLoader();
// loader.load(
//     'models/Rook.STL',
//     function (geometry) {
//         const mesh = new THREE.Mesh(geometry, material);
//         mesh.castShadow = true;
//         mesh.receiveShadow = true;
//         mesh.scale.set(.01, .01, .01);
//         scene.add(mesh)
//     },
//     (xhr) => {
//         console.log((xhr.loaded / xhr.total * 100) + '% loaded')
//     },
//     (error) => {
//         console.log(error);
//     }
// );
//
// window.addEventListener('resize', onWindowResize, false);
//
// function onWindowResize() {
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     render()
// }
//
// const stats = Stats();
// document.body.appendChild(stats.dom);
//
// var animate = function () {
//     requestAnimationFrame(animate);
//
//     controls.update();
//
//     render();
//
//     stats.update()
// };
//
// function render() {
//     renderer.render(scene, camera)
// }
//
// animate();

import CustomLoader from "./customLoader";
import {PieceType} from "./piece";

let loader = new CustomLoader();
setTimeout(() => console.log(loader), 1000);
