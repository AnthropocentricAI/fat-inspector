var buttons = document.getElementsByClassName("btn");
var cursor = document.getElementById("cursor");
var data = document.getElementById("data");
var model = document.getElementById("model");
var prediction = document.getElementById("predictions");
var toanalysis = document.getElementById("analysisbtn");
var screen1 = document.getElementById("right");
var screen2 = document.getElementById("right2");
var clicked = 0;
var page = 0;

hidelayer(clicked);


for (let button of buttons){
    button.addEventListener("click", movecursor);
}

toanalysis.addEventListener("click", changescreen);

function changescreen(){
    if(page == 0){
        page = 1
    }
    if(page == 1){
        page = 0
    }
    swap(page);
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

function swap(page){
    screen1.style.visibility = (page == 1)?"hidden": "visible";
    screen2.style.visibility = (page == 0)?"hidden": "visible";
}

function hidelayer(clicked){
    data.style.visibility = (clicked == 1 || clicked == 2)?"hidden": "visible";
    model.style.visibility = (clicked == 0 || clicked == 2)?"hidden": "visible";
    prediction.style.visibility = (clicked == 0 || clicked == 1)?"hidden": "visible";
    
}