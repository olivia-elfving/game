const allNumbers = Array.from({length: 40}, (_, i) => i + 1);

let startGameBtn;
let choosebrickBtn;
let imgElems;
let matrixElems;
let tempList;
let checkBox;
let points = 0;
let emptyUrl = "img/empty.png";
let checkAnswersArray = ["r1","r2","r3","r4","c1","c2","c3","c4"];
let resultObj
let dragNumElem;
let ix;

function init() {
    startGameBtn = document.getElementById("newGameBtn");
    newBricksBtn = document.getElementById("newBricksBtn");
    imgElems = document.getElementById("newBricks").getElementsByTagName("img");
    matrixElems = document.getElementById("board").getElementsByTagName("img");

    startGameBtn.addEventListener("click", startGame);
    newBricksBtn.addEventListener("click", newBricks);

    startGameBtn.disabled = false;
    newBricksBtn.disabled = true;

    // Get user
    resultObj = JSON.parse(localStorage.getItem("oe222fy")) || { points: 0, games: 0 };
    updateShowedValues(); 
} 
window.addEventListener("load",init);

// --------------------------

function clearGame() {
    let marks = document.getElementsByClassName("mark");

    for (let i=0; i < matrixElems.length; i++) {
        matrixElems[i].src = emptyUrl; 
        matrixElems[i].classList.remove("brick");
        matrixElems[i].classList.add("empty");
    }

    for (let i = 0; i < marks.length; i++) {
        marks[i].innerHTML = "";
    }
}

function startGame() {
    tempList = allNumbers.slice(0);
    clearGame(); 
    startGameBtn.disabled = true;
    newBricksBtn.disabled = false;
} 


function newBricks() {
    let numbers = [];

    for (let i = 0; i < 4; i++) {
        let r = Math.floor(Math.random() * tempList.length);
        numbers.push(tempList[r]);
        ix = allNumbers.indexOf(tempList[r]);
        ix += 1;
        tempList.splice(r, 1);
        imgElems[i].src = "img/" + ix + ".png";
        imgElems[i].id = ix;
        imgElems[i].classList.add("brick");
        newBricksBtn.disabled = true;
    }

  for (let i = 0; i < imgElems.length; i++) {
    imgElems[i].draggable = true;
    imgElems[i].addEventListener("dragstart", dragstartNum);
    imgElems[i].addEventListener("dragend", dragendNum);
    }
}

function dragstartNum(e) {
    e.dataTransfer.setData("url", this.src);
    e.dataTransfer.setData("value", this.id);
    dragNumElem = this;
    for (let i = 0; i < matrixElems.length; i++) {
        matrixElems[i].addEventListener("dragover", numOverMatrix);
        matrixElems[i].addEventListener("drop", numOverMatrix);
        matrixElems[i].addEventListener("dragleave", numOverMatrix);
    }
}

function dragendNum(e) {
    for (let i = 0; i < matrixElems.length; i++) {
        matrixElems[i].removeEventListener("dragover", numOverMatrix );
        matrixElems[i].removeEventListener("drop", numOverMatrix);
        matrixElems[i].removeEventListener("dragleave", numOverMatrix);
    }
}

function numOverMatrix(e) {
    let imageUrl = e.dataTransfer.getData("url");
    let numValue =  e.dataTransfer.getData("value");
    e.preventDefault();

    if (e.type == "dragover" && this.src.indexOf(emptyUrl) !== -1) {
        this.style.backgroundColor = "#9C9";
    }

    if (e.type == "dragleave") {
        this.style.backgroundColor = "";
    }

    if (e.type == "drop" && this.src.indexOf(emptyUrl) !== -1) {
        this.src = imageUrl;
        dragNumElem.src = emptyUrl;
        this.style.backgroundColor = "";
        this.classList.remove("empty");
        this.classList.add("brick");
        this.id = numValue;
        let deactivateButton = false;
        for (let i = 0; i < imgElems.length; i++) {
            if (imgElems[i].src.indexOf(emptyUrl) === -1) {
                deactivateButton = true;
            }
            else {
                imgElems[i].removeEventListener("dragstart", dragstartNum);
                imgElems[i].classList.remove("brick");  
            }
        }
        newBricksBtn.disabled = deactivateButton;
    } 
    
    if (document.getElementById("board").getElementsByClassName("brick").length === matrixElems.length) {
        for(let i = 0; i < checkAnswersArray.length; i++) {
            checkAnswers(checkAnswersArray[i]);
        }
        startGameBtn.disabled = false;
        newBricksBtn.disabled = true;
        saveValues();
        updateShowedValues();
    }
}

function saveValues() {
    resultObj.points = resultObj.points + points;
    resultObj.games = resultObj.games + 1;
    localStorage.setItem("oe222fy", JSON.stringify(resultObj));
}

function updateShowedValues() {
    document.getElementById("totPoints").innerHTML = resultObj.points;
    document.getElementById("countGames").innerHTML = resultObj.games;
}

function checkAnswers(name) { 
    let arrayOfImgs = document.getElementById("board").getElementsByClassName(name);
    let arrayValues = [];
    for (let i = 0; i < arrayOfImgs.length; i++) {
       arrayValues.push(Number(arrayOfImgs[i].id));
   }

   let decreasingArray = false;
    for (let i = 0; i < arrayOfImgs.length - 1; i++) {
        if (arrayValues[i] > arrayValues[i+1]) {
            decreasingArray = true;
            break;
        }
    }

    if (decreasingArray) {
        document.getElementById(`${name}mark`).innerHTML = "<span style=color:red>&cross;</span>";
    }
    else {
        document.getElementById(`${name}mark`).innerHTML = "<span style=color:green>&check;</span>";
        points += 1;
    }
}
