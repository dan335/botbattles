// import {
//   Mesh
// } from 'three';
// import GLTFLoader from 'three-gltf-loader'
//
//
// var meshesToLoad = [
//   {
//     name: 'ship',
//     path: '/static/models/ship.gltf'
//   },
//   {
//     name: 'shipEngine',
//     path: '/static/models/shipEngine.gltf'
//   },
// ];
//
//
// export default class Loader {
//   constructor(manager) {
//     this.manager = manager;
//     this.meshes = {}; // loaded meshes
//
//     this.manager.ui.setState({isLoading: true});
//
//     meshesToLoad.forEach((meshToLoad) => {
//
//     })
//
//     var promises = []
//     meshesToLoad.forEach((meshToLoad) => {
//       promises.push(this.load(meshToLoad));
//     })
//
//     Promise.all(promises).then(() => {
//       this.manager.ui.setState({isLoading: false});
//       this.manager.finishedLoading();
//     })
//   }
//
//
//   load(meshToLoad) {
//     return new Promise((resolve) => {
//       const gltfLoader = new GLTFLoader();
//
//       gltfLoader.load(
//         meshToLoad.path,
//         (mesh) => {
//           this.meshes[meshToLoad.name] = mesh;
//           resolve();
//         }
//       )
//     })
//   }
// }
