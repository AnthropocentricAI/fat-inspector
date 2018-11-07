var buttons = document.getElementsByClassName("btn");
var cursor = document.getElementById("cursor");
var data = document.getElementById("data");
var model = document.getElementById("model");
var prediction = document.getElementById("predictions")
var clicked = 0;
var page = 0;

hidelayer(clicked);


for (let button of buttons){
    button.addEventListener("click", movecursor);
}

function movecursor(e){
    var name = e.target.innerHTML;
    if(name === "DATA"){
        
        cursor.style.top = "0";
        clicked = 0;
    }
    if(name === "MODEL"){
        cursor.style.top = "33%";
        clicked = 1;
    }
    if(name === "PREDICTION"){
        cursor.style.top = "67%";
        clicked = 2;
    }
    
    hidelayer(clicked);
}

function hidelayer(clicked){
    data.style.visibility = (clicked == 1 || clicked == 2)?"hidden": "visible";
    model.style.visibility = (clicked == 0 || clicked == 2)?"hidden": "visible";
    prediction.style.visibility = (clicked == 0 || clicked == 1)?"hidden": "visible";
    
}