const welcomepage = document.getElementById("welcome");//landing page
const start=document.querySelector(".startgame");//game page

const game = document.getElementById("game");
const gamepage = document.querySelector(".gamepage");
welcomepage.style.visibility="hidden";
game.style.visibility="visible";

function startgamefunc(){
    welcomepage.style.visibility="hidden";
    resetGame(worldmatrix);
    game.style.visibility="visible";
    location.reload();


}
start.addEventListener("click",startgamefunc);



//create matrix

let mapsize=20;
var worldmatrix = new Array(mapsize); 
  
// Loop to create 2D array using 1D array 
for (var i = 0; i < worldmatrix.length; i++) { 
    worldmatrix[i] = new Array(mapsize); 
}

let rowgroundsize=mapsize-(Math.floor(mapsize/3));
//rowgroundsize=> variable that give 1/3 from the map

resetGame(worldmatrix);

function createbluesky(matrix){
    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix.length; col++) {
            matrix[row][col]="bluesky";
        }
    }
}


function createground(matrix) {
    for (let row = rowgroundsize; row < matrix.length; row++) {
        for (let col = 0; col < matrix.length; col++) {
            matrix[row][col]="ground";
        }
    }
}


function createtree(matrix){
    let row;
    let from=mapsize-(Math.floor(mapsize/3));
    for (row = from-3; row < from; row++) {
        matrix[row][from]="treetrank";
    }
    row=row-4;//11
    let widthtree=1;
    for (let rowtree = row-3; rowtree < row+1; rowtree++) {
        for (let col = rowgroundsize-widthtree; col <= rowgroundsize+widthtree; col++) {
            matrix[rowtree][col]="tree";
        }
        widthtree++;
    }

    /*
       my tree 
       ---
      -----
     -------
    ---------
        !
        !
        ! 
    */
    
}


function createstone(matrix){
    let from=mapsize-(Math.floor(mapsize/3));
    var hightwall,count=1;
    hightwall=Math.floor(mapsize/3);
    for (let row = from-hightwall; row < from; row++) {
        for (let col = 0; col < count; col++) {
            matrix[row][col]="stone";
        }
        count++;  
    }

    /*
    my wall
    #
    ##
    ###
    ####
    #####
    ######
    */
}


function createwhitesky(matrix){
    rowskysize=Math.floor(mapsize/3);
    for (let row = 0; row < rowskysize; row++) {
        for (let col = 0; col < matrix.length; col++) {
        }
    }


    matrix[2][7]="white"
    matrix[2][8]="white"

    matrix[3][7]="white"
    matrix[3][8]="white"
    matrix[3][9]="white"
    matrix[3][10]="white"

    matrix[4][6]="white"
    matrix[4][7]="white"
    matrix[4][8]="white"
    matrix[4][9]="white"
    matrix[4][10]="white"
    matrix[4][11]="white"

    matrix[5][7]="white"
    matrix[5][8]="white"
    matrix[5][9]="white"

    /*
    sky
     ##
     #####
    #######
     ### 
    */
}



function createMatrix(matrix) {

    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
          //create an element div for all the pixels in matrix
          let materials = document.createElement('div');
          //class name of this div is 'materials'
          materials.classList.add('materials');
          //add a new data class name materialsType that well be with name 'data-materials-type'
          materials.dataset.materialsType = matrix[row][col];
          //the place of the pixel in the map
          materials.dataset.materialsX = col;
          materials.dataset.materialsY = row;
          //out this div in the html code
          gamepage.appendChild(materials);
        }
    }
}
removeworldmatrix
function removeworldmatrix(matrix) {
    for (let row = 0; row < matrix.length; row++) {
        gamepage.childNodes.forEach(node => {node.remove(node);});
  }
}


//my tails
//all the divs that have an element
const materialsElements = document.querySelectorAll('.materials');


function resetGame(worldmatrix){
    createbluesky(worldmatrix);
    createground(worldmatrix);
    createwhitesky(worldmatrix);
    createtree(worldmatrix);
    createstone(worldmatrix);
    createMatrix(worldmatrix);

}


//----------------------start my game function------------------------------------------

const resetmap = document.querySelector(".resetmap");
const exit = document.querySelector(".exit");

resetmap.addEventListener("click",()=>location.reload());
exit.addEventListener("click",()=>{
  game.style.visibility="hidden";
    welcomepage.style.visibility="visible";
    removeworldmatrix(worldmatrix);
    
})


const tools = document.querySelectorAll('.box');//my tools
const elements = document.querySelectorAll('.myelement');//the element that i get from the map

let currentTool = '';
let currentTileType = 0;
let inventoryTileType = -1;

tools.forEach(tool => tool.addEventListener('click', chooseTool));
elements.forEach(inv => inv.addEventListener('click', chooseInvItem));

//choose your tool
function chooseTool(event) {
    currentTool = event.currentTarget.children[0].classList.value;
    notactivetools();
    event.currentTarget.dataset.toolStatus = 'active';
    materialsElements.forEach(matirial => matirial.addEventListener('click', choosematirial));
}

//unactive all the tools
function notactivetools() {
    tools.forEach(tool => {
      tool.dataset.toolStatus = 'not-active';
    });
} 
//choose a tiles that you want to take by the correct tool
function choosematirial(e) {
    currentTileType = e.currentTarget.dataset.materialsType;
    let matchingTool = checkIfToolMatchesTile();
    console.log(matchingTool);
    if(!matchingTool) {
      document.querySelector('.box[data-tool-status="active"]').style.backgroundColor = "red";
      setTimeout(() => {
        document.querySelector('.box[data-tool-status="active"]').style.backgroundColor = "";
      }, 200);
    }
    else {
      let tileboxFull = istileboxFull();
      if(!tileboxFull) {
        removeTileFromWorld(e.currentTarget);
        pushTotilebox(currentTileType);
      }
    }
  }

  function checkIfToolMatchesTile() {
    if (currentTool==='pickaxe') {
      if(currentTileType === 'stone') {
        return true;
      }
    }
    else if (currentTool==='shovel') {
      if(currentTileType === 'ground') {
        return true;
      }
    }
    else if (currentTool==='axe') {
      if(currentTileType === 'tree' || currentTileType === 'treetrank') {
        return true;
      }
    }
    return false;
  }


  function removeTileFromWorld(tileDivToRemove) {
    tileDivToRemove.dataset.materialsType = 'bluesky';
  }



  function pushTotilebox(materialsToPush) {
    let pushedTile = document.createElement('div');
    pushedTile.dataset.materialsType = materialsToPush;
    
    //console.log(pushedTile);
    for (let i = 0; i < elements.length; i++) {
      if(elements[i].hasChildNodes()) {
        const clone = elements[i].firstElementChild.cloneNode(true);
        elements[i-1].appendChild(clone);
        elements[i].removeChild(elements[i].firstElementChild);
        elements[i-1].classList.add('tail');
      }
    }
    elements[4].appendChild(pushedTile);
    elements[4].classList.add('head');
  }


  function istileboxFull() {
    if(elements[0].hasChildNodes()) {
      document.querySelector('.elements').style.boxShadow = "inset 0px 0px 0px 5px rgba(158,45,14,1)"
      setTimeout(() => {
        document.querySelector('.elements').style.boxShadow = "";
      }, 200);
      return true;
    }
    else return false;
  }


  function chooseInvItem(e) {
    inventoryTileType = e.currentTarget.children[0].dataset.materialsType;
    e.currentTarget.dataset.invItem = 'clicked';
    notactivetools();
    materialsElements.forEach(tile => tile.addEventListener('click', placeInvItem));
  }

  function placeInvItem(e) {
    currentTileType = e.currentTarget.dataset.materialsType;
    // can be placed only on empty space
    if(currentTileType === 'bluesky') {
      e.currentTarget.dataset.materialsType = inventoryTileType;
    }
    removeFromtilebox();
  }


  function removeFromtilebox() {
    elements[4].firstChild.remove();
    inventoryTileType = 0;
    currentTileType = 0;
    currentTool = '';
    for (let i = elements.length-1; i > 0; i--) {
        const clone = elements[i-1].firstElementChild.cloneNode(true);
        elements[i].appendChild(clone);
        elements[i-1].removeChild(elements[i-1].firstElementChild);
    }
  }
  





