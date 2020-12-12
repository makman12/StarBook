import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
let data;

axios.get("/data").then((res) => {
  data = res.data;
  console.log(data);
  for (let i of data) {
    let opt = document.createElement("option");
    opt.value = i.name;
    datalist.appendChild(opt);
  }
});

let datalist = document.getElementById("stars");

let input1 = document.getElementById("input1");
let main = document.getElementById("main");

let inputDiv = document.getElementById("inputs");
input1.addEventListener("change", addInput);

function addInput() {
  let newInput = document.createElement("input");
  newInput.setAttribute("list", "stars");
  newInput.setAttribute("placeholder", "Choose a Star");
  newInput.addEventListener("change", addInput);
  inputDiv.appendChild(newInput);
}

let button = document.getElementById("run");

document.body.addEventListener("keydown", (e) => {
  if (e.code == "Escape") {
    main.hidden = false;
    showdiv.innerHTML = "";
    scene = null;
    renderer.setAnimationLoop(null);
    cancelAnimationFrame(id);
  }
});

let clearButton = document.getElementById("clear");

clearButton.addEventListener("click", (e) => {
  inputDiv.innerHTML = "";
  addInput();
});

button.addEventListener("click", (e) => {
  let allinputs = inputDiv.childNodes;
  let selectedStars = [];
  for (let el of allinputs) {
    if (el.nodeType == 1) {
      if (el.value != "") {
        selectedStars.push(el.value);
      }
    }
  }
  let dataStars = [];
  for (let star of selectedStars) {
    let starData = data.find((e) => e.name == star);
    dataStars.push(starData);
  }
  console.log(dataStars);
  if (dataStars.length > 1) {
    simulate(dataStars);
    main.hidden = true;
  }
});

let showdiv = document.getElementById("show");

showdiv.addEventListener("click", (e) => {});

let scene;
let renderer;
let id;
function simulate(starData) {
  scene = new THREE.Scene();
  let allRad = [];

  for (let rad of starData) {
    allRad.push(rad.radius);
  }
  let max = Math.max(...allRad);
  let oran = 5 / max;
  for (let rad of starData) {
    rad.newRadius = rad.radius * oran;
  }
  showdiv.innerHTML = "";
  let label = document.createElement("ul");
  label.id = "star-label";
  showdiv.append(label);

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  showdiv.appendChild(renderer.domElement);
  renderer.setClearColor(0x000000, 0);

  let starsAnimate = [];
  let firstPosition = -10;
  for (let star of starData) {
    firstPosition = firstPosition + star.newRadius;
    const geometry = new THREE.SphereGeometry(star.newRadius, 30, 30);
    const material = new THREE.MeshLambertMaterial({
      color: findColor(star.tempature),
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    sphere.position.x = firstPosition;
    sphere.position.y = 0;
    sphere.starData = star;
    starsAnimate.push(sphere);
    firstPosition = firstPosition + star.newRadius + 1;
    console.log("arası", firstPosition);
  }

  /* Rotation
  let sphereContainer = new THREE.Object3D();
  sphereContainer.add(sphere2);

  sphereContainer.position.copy(sphere.position); // optional, in case you've set the position of the cube

  scene.add(sphereContainer);
  */

  const pointLight = new THREE.PointLight(0xffffff);

  // Lights
  pointLight.position.x = 0;
  pointLight.position.y = 0;
  pointLight.position.z = 530;

  const pointLight2 = new THREE.PointLight(0xffffff);
  pointLight2.position.x = 0;
  pointLight2.position.y = 0;
  pointLight2.position.z = -530;

  const pointLight3 = new THREE.PointLight(0xffffff);

  pointLight3.position.x = 100;
  pointLight3.position.y = 0;
  pointLight3.position.z = 530;
  scene.add(pointLight);
  scene.add(pointLight2);
  scene.add(pointLight3);

  camera.position.z = 10;
  let controls = new OrbitControls(camera, renderer.domElement);
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  function onMouseMove(event) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  const animate = function () {
    id = requestAnimationFrame(animate);
    for (let ani of starsAnimate) {
      ani.rotation.y += 0.01;
    }
    //sphereContainer.rotation.y += 0.01; // rotate around cube
    raycaster.setFromCamera(mouse, camera);

    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(scene.children);

    for (let i = 0; i < intersects.length; i++) {
      console.log(intersects[i].object);
      if (intersects[i].object.starData) {
        putLabelOnIt(intersects[i].object.starData);
      }
    }
    renderer.render(scene, camera);
  };

  window.addEventListener("mousemove", onMouseMove, false);

  window.addEventListener("touchstart", onMouseMove, false);
  let geometry3 = new THREE.SphereGeometry(500, 60, 40);
  geometry3.scale(-1, 1, 1);
  let material3 = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load(
      "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb"
    ),
  });
  let mesh = new THREE.Mesh(geometry3, material3);
  scene.add(mesh);
  animate();
}

function findColor(Temp) {
  console.log(Temp);
  let Blue = "#88c3f7";
  let White = "#ebf2f7";
  let Orange = "#ffb10a";
  let Yellow = "#fff533";
  let Red = "#db2218";

  let colors = [Blue, White, Yellow, Orange, Red];
  let counts = [25000, 10000, 6000, 4000, 2000],
    goal = Temp;

  let closest = counts.reduce(function (prev, curr) {
    return Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev;
  });

  let i = counts.indexOf(closest);
  return colors[i];
}

function putLabelOnIt(starData) {
  let info = document.getElementById("star-label");
  info.className = "card-panel teal";
  info.innerHTML = `
  <li class="collection-header"><h5>${starData.name}</h5></li>
  <hr>
        <li class="collection-item">Tempature: ${starData.tempature.toFixed(
          0
        )} Kelvin</li>
        <li class="collection-item">Radius: ${starData.radius.toFixed(
          2
        )} Solar Radius</li>
        <li class="collection-item">Mass: Next feature </li>
  
  `;
}
