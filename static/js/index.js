var buttons = document.getElementsByClassName("btn");
var cursor = document.getElementById("cursor");
var data = document.getElementById("data");
var model = document.getElementById("model");
var prediction = document.getElementById("predictions");
var toanalysis = document.getElementById("analysisbtn");
var screen1 = document.getElementById("right");
var screen2 = document.getElementById("right2");

var newData = document.getElementById("displaycont__new");

var clicked = 0;
var page = 0;

window.onload = function() {
  displayLayer('data')
}

var LayerEnum = Object.freeze(
  {'data' : data,
   'model' : model,
   'prediction' : prediction,
   'newData' : newData}
)

// hide all layers apart from one w/ id
function displayLayer(id) {
  for (x in LayerEnum) {
    LayerEnum[x].style.visibility = x == id ? 'visible' : 'hidden';
  }
}

for (let button of buttons) {
  button.addEventListener("click", movecursor);
}

function movecursor(e) {
  var name = e.target.innerHTML;
  switch(name) {
    case 'DATA':
      displayLayer('data')
      break;
    case 'MODEL':
      displayLayer('model')
      break;
    case 'PREDICTION':
      displayLayer('prediction')
      break;
    case 'dunno':
      displayLayer('newData')
      break;
  }
}