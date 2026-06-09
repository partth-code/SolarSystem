import * as THREE from 'three';
import { OrbitControls, plane, Wireframe } from 'three/examples/jsm/Addons.js';
import { distance } from 'three/tsl';
import {Pane} from 'tweakpane'

//Initializing Pane
const pane = new Pane();


//Initializing Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000)

//Initializing Geometry
const sphereGeometry = new THREE.SphereGeometry(1,32,32)

//Texture Loader
const textureLoader = new THREE.TextureLoader()

//Adding Textures
const sunTexture =  textureLoader.load("/IMAGES/2k_sunTexture.jpg")
const mercuryTexture =  textureLoader.load("/IMAGES/2k_mercuryTexture.jpg")
const venusTexture =  textureLoader.load("/IMAGES/2k_venusTexture.jpg")
const earthTexture =  textureLoader.load("/IMAGES/2k_earthTexture.jpg")
const moonTexture =  textureLoader.load("/IMAGES/2k_moonTexture.jpg")
const marsTexture =  textureLoader.load("/IMAGES/2k_marsTexture.jpg")
const phobosTexture =  textureLoader.load("/IMAGES/2k_phobosTexture.jpg")
const deimosTexture =  textureLoader.load("/IMAGES/2k_deimosTexture.jpg")
// const backgroundTexture = textureLoader.load("/IMAGES/spaceBackground.jpg")
 

//Adding Materials
const sunMaterial = new THREE.MeshBasicMaterial(
  {map:sunTexture}

)


//-planets Material

const mercuryMaterial = new THREE.MeshStandardMaterial(
  {map:mercuryTexture}
)

const venusMaterial = new THREE.MeshStandardMaterial(
  {map:venusTexture}
)

const earthMaterial = new THREE.MeshStandardMaterial(
  {map:earthTexture}
)

const moonMaterial = new THREE.MeshStandardMaterial(
  {map:moonTexture}
)
const marsMaterial = new THREE.MeshStandardMaterial(
  {map:marsTexture}
)
const phobosMaterial = new THREE.MeshStandardMaterial(
  {map:phobosTexture}
)
const deimosMaterial = new THREE.MeshStandardMaterial(
  {map:deimosTexture}
)







//Adding Mesh
const sun = new THREE.Mesh(
  sphereGeometry,
  sunMaterial
)
sun.scale.setScalar(10)






//Planet Array
const planets = [
  {
    name:"Mercury",
    radius: 0.3,
    distance:15,
    speed: 0.1,
    material:mercuryMaterial,
    moons: []
  },
  {
    name:"Venus",
    radius:1,
    distance:20,
    speed: 0.08,
    material:venusMaterial,
    moons:[]
  },
  {
    name:"Earth",
    radius:1,
    distance:30,
    speed: 0.05,
    material:earthMaterial,
    moons:[
      {
        name:"Moon",
        radius:0.5,
        distance:7,
        speed: 0.006,
        material:moonMaterial
      }
    ]
  },
  {
    name:"Mars",
    radius:0.6,
    distance:40,
    speed: 0.06,
    material:marsMaterial,
    moons:[
      {
        name:"Phobos",
        radius:0.4,
        distance:7,
        speed: 0.006,
        material:phobosMaterial
      },
       {
        name:"Demos",
        radius:0.3,
        distance:6,
        speed: 0.006,
        material:deimosMaterial
      }
    ]
  }
]

scene.add(sun)

const planetMeshes = planets.map(
  (planet) =>{
    //Creating Mesh
    const planetMesh = new THREE.Mesh(sphereGeometry,planet.material)
  
    planetMesh.scale.setScalar(planet.radius)
    planetMesh.position.x += planet.distance
    //Adding to the scene

    scene.add(planetMesh)

    planet.moons.forEach((moon)=>{
      const moonMesh = new THREE.Mesh(sphereGeometry,moon.material)

      moonMesh.scale.setScalar(moon.radius)
      moonMesh.position.x += moon.distance

      planetMesh.add(moonMesh)

    })
    return planetMesh


  }
)


//Initializing Camera
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth/window.innerHeight,
  0.001,
  800
); 


//Iniitalizing Lighting
const ambinetLighting = new THREE.AmbientLight(0xffffff,0.1)
scene.add(ambinetLighting)

const pointLight = new THREE.PointLight(0xffffff,1000)
scene.add(pointLight)
pointLight.position.y = 20
//Axis Helper
const axisHelper = new THREE.AxesHelper(2);

const timer  = new THREE.Timer()

camera.position.z = 50;


//Setting Up Renderer

const canvas = document.querySelector(".three-js")
const renderer = new THREE.WebGLRenderer({
  
  canvas:canvas,
  antialias:true
})

const controls = new OrbitControls(camera,canvas);


renderer.setSize(window.innerWidth,window.innerHeight)

window.addEventListener('resize',() =>{
  renderer.setSize(window.innerWidth,window.innerHeight)

  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix()
})


function animate(){

  planetMeshes.forEach((planet,index)=>
  {
    planet.rotation.y += planets[index].speed
    planet.position.x = Math.sin(planets[index].speed*planet.rotation.y) * planets[index].distance
    planet.position.z = Math.cos(planets[index].speed*planet.rotation.y) * planets[index].distance
  })

  const delta  = timer.getDelta();



  renderer.render(scene,camera)
  
  controls.autoRotate = true
  timer.update()

  window.requestAnimationFrame(animate);
}
controls.update()


animate();

