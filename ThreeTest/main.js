import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui';

var renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth,window.innerHeight)
document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth/window.innerHeight,
  0.1,
  1000
)
const orbit = new OrbitControls(camera,renderer.domElement)

const axesHelper = new THREE.AxesHelper(3)
scene.add(axesHelper)

camera.position.set(-10,30,30)
orbit.update();

// Box
const boxGeometry = new THREE.BoxGeometry()
const boxMaterial = new THREE.MeshBasicMaterial({
  color:0xeb9b34
})
const box = new THREE.Mesh(boxGeometry,boxMaterial)
box.position.y = 1
scene.add(box)

// Plane
const planeGeometry = new THREE.PlaneGeometry(30,30)
const planeMaterial = new THREE.MeshBasicMaterial({
  color:0x242321,
  side:THREE.DoubleSide
})
const plane = new THREE.Mesh(planeGeometry,planeMaterial)
scene.add(plane)
plane.rotation.x = -0.5 * Math.PI

// Sphere
const sphereGeometry = new THREE.SphereGeometry(4,30,30)
const sphereMaterial = new THREE.MeshBasicMaterial({
  color:0xFFC158,
  wireframe:false
})
const sphere = new THREE.Mesh(sphereGeometry,sphereMaterial)
scene.add(sphere)
sphere.position.set(-5,-5,0)

// GUI
const gui = new dat.GUI()
const options = {
  sphereColor: '#FFC158',
  wireframe:false,
  speed:0.01,
  widthSegments: 30
}

gui.addColor(options,'sphereColor').onChange((e)=>{
  sphere.material.color.set(e)
})

gui.add(options,'wireframe').onChange((e)=>{
  sphere.material.wireframe = e
})

gui.add(options,'speed',0,0.1)
gui.add(options,'widthSegments',1,30).onChange((e)=>{
  sphere.geometry.parameters.widthSegments = e
  sphere.geometry.parameters.heightSegments = e
  sphere.geometry.dispose(); // Dispose old geometry to avoid memory leaks
  const newGeometry = new THREE.SphereGeometry(4,e,e)
  sphere.geometry = newGeometry;
})

const gridHelper = new THREE.GridHelper(30,10)
scene.add(gridHelper)

box.rotation.x = 5
box.rotation.y = 5

// Animation
let stop = 0

var animate = (time)=>{
  box.rotation.x = time/1000
  box.rotation.y = time/1000

  sphere.rotation.x = time/1000
  sphere.rotation.y = time/1000

  stop += options.speed
  sphere.position.y = 10* Math.abs(Math.sin(stop))

  renderer.render(scene,camera)
}
renderer.setAnimationLoop(animate)

renderer.render(scene,camera)