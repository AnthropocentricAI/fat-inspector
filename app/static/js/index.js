var cursor = document.getElementById("cursor");
var toanalysis = document.getElementById("analysisbtn");
var screen1 = document.getElementById("right");
var screen2 = document.getElementById("right2");

var data = document.getElementById("data");
var model = document.getElementById("model");
var prediction = document.getElementById("predictions");
var newData = document.getElementById("displaycont__new");
var workflow = document.getElementById("workflow");
var inspector = document.getElementById("inspector");
var uploadname = document.getElementById("name");

var clicked = 0;

window.onload = function() {
  var buttons = document.getElementsByClassName("btn");
  console.log(buttons);
  for (let button of buttons) button.addEventListener("click", movecursor);

  displayLayer("new dataset");

  workflow.addEventListener("click", workflowswitch);
  inspector.addEventListener("click", inspectorswitch);
};

/*
 *  LAYER SWITCHING FUNC.
 */
var layer = "";
var LayerEnum = Object.freeze({
  data: data,
  model: model,
  prediction: prediction,
  "new dataset": newData
});
// hide all layers apart from one w/ id
function displayLayer(id) {
  for (x in LayerEnum)
    LayerEnum[x].style.visibility = x == id ? "visible" : "hidden";
  layer = id;
}
// switch on button press
function movecursor(e) {
  var name = e.target.innerHTML.toLowerCase();
  if (name in LayerEnum) displayLayer(name);
}

function workflowswitch() {
  if (workflow.classList.contains("off")) {
    inspector.classList.remove("on");
    inspector.classList.add("off");
    workflow.classList.remove("off");
    workflow.classList.add("on");
  }
}
function inspectorswitch() {
  if (inspector.classList.contains("off")) {
    workflow.classList.remove("on");
    workflow.classList.add("off");
    inspector.classList.remove("off");
    inspector.classList.add("on");
  }
}

var uploadbtn = document.getElementById("uploadbtn");
uploadbtn.addEventListener("click", upload);

function upload() {
  document.getElementById("setname").innerHTML = uploadname.value;
  displayLayer("data");
}
