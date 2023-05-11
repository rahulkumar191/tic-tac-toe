const createAllBoxes = (boardSize) =>{
    for(let i=0; i<boardSize**2; i++){
        board.innerHTML += `<div class="box"><span class = "inp-box"></span></div>`;
    }
}

const setWidthAndHeightOfBoard = () =>{
    const boardWidth = board.offsetWidth;
    board.style.height = boardWidth + 'px';
}

const setWidthAndHeightOfBox = () =>{
    for(let box of boxes){
        box.style.width = 100 / boardSize + '%';
        box.style.height = 100 / boardSize + '%';
    }
    let boxWidth = boxes[0].offsetWidth;
    board.style.fontSize = (boxWidth * 65) / 100 + 'px';
}

const divideBoard = () =>{
    for(let box of boxes){
        box.style.border = '0px';
    }
    for(let i=0; i<(boardSize/2-1); i++){
        let row = boardSize * (2*i+1);
        let coloumn = (2*i)+1;
        for(let j=0; j<boardSize; j++){
            boxes[row + j].style.borderTop = `1.5px solid var(--boarder-color)`;
            boxes[row + j].style.borderBottom = `1.5px solid var(--boarder-color)`;
            boxes[coloumn + (j*boardSize)].style.borderLeft = `1.5px solid var(--boarder-color)`;
            boxes[coloumn + (j*boardSize)].style.borderRight = `1.5px solid var(--boarder-color)`;
        }
    }

    if(boardSize%2 == 0){
        let row = boardSize*(boardSize-1);
        let coloumn = boardSize-1;
        for(let i=0; i<boardSize; i++){
            boxes[row + i].style.borderTop = `1.5px solid var(--boarder-color)`;
            boxes[coloumn + (i*boardSize)].style.borderLeft = `1.5px solid var(--boarder-color)`;
        }
    }
}

const createGrid = (boardSize) =>{
    let grid = new Array(boardSize);
    for (let i = 0; i < grid.length; i++) {
    grid[i] = new Array(boardSize);
    }
    return grid;
}

const styleZeroBox = (box) => {
    box.style.color = 'var(--secondary)';
    box.style.textShadow = '0px 0px 5px var(--secondary)';
}

const styleCrosBox = (box) => {
    box.style.color = 'var(--ternary)';
    box.style.textShadow = '0px 0px 5px var(--ternary)';
}

const checkWinner = ()=>{
    let totalCross = rightCount;

    //row checking for winner
    // for(let i=0; i<boardSize; i++){
    //     for(let j=0; j<=boardSize-rightCount; j++){

    //     }
    // }

    //row checking for winner
    for(let i=0; i<boardSize; i++){
        for(let j=0; j<=boardSize-rightCount; j++){
            let sumOfinp = 0;
            for(let k =0; k<rightCount; k++){
                sumOfinp += gridData[i][j+k];
            }
            if(sumOfinp === 0 || sumOfinp == totalCross){
                let winnerDetails ={
                    player : currentPlayer,
                    i : i,
                    j : j,
                    increment : 'j'
                }
                return winnerDetails;
            }
        }
        
        //coloumn checking for winner
        for(let j=0; j<=boardSize-rightCount; j++){
            let sumOfinp = 0;
            for(let k =0; k<rightCount; k++){
                sumOfinp += gridData[j+k][i];
            }
            if(sumOfinp === 0 || sumOfinp == totalCross){
                let winnerDetails ={
                    player : currentPlayer,
                    i : j,
                    j : i,
                    increment : 'i'
                }
                return winnerDetails;
            }
        }
    } 

    //left to right diagonal winner checking
    let x = boardSize-rightCount;
    let y = 0;
    let greatest = 1;
    for(let i=0; i<= (boardSize - rightCount)*2; i++){
        for(let j=0; j<greatest; j++){
            let sumOfinp = 0;
            for(let k =0; k<rightCount; k++){
                sumOfinp += gridData[x+j+k][y+j+k];
            }
            if(sumOfinp === 0 || sumOfinp == totalCross){
                if(sumOfinp == totalCross) sumOfinp = 'X';
                else sumOfinp = 'O';
                let winnerDetails ={
                    player : sumOfinp,
                    i : x+j,
                    j : y+j,
                    increment : 'ij',
                    angle : 45,
                    lft : y+j
                }
                return winnerDetails;
            }
        }
        if(x>0){
            x--;
            greatest++;
        }
        else{
            y++;
            greatest--;
        }
    }

    // right to left winner checking
    x = boardSize-rightCount;
    y = boardSize - 1;
    greatest = 1;
    for(let i=0; i<= (boardSize - rightCount)*2; i++){
        for(let j=0; j<greatest; j++){
            let sumOfinp = 0;
            for(let k =0; k<rightCount; k++){
                sumOfinp += gridData[x+j+k][y-j-k];
            }
            if(sumOfinp === 0 || sumOfinp == totalCross){
                if(sumOfinp == totalCross) sumOfinp = 'X';
                else sumOfinp = 'O';
                let winnerDetails ={
                    player : sumOfinp,
                    i : x+j,
                    j : y-j,
                    increment : 'ij',
                    angle : 135,
                    lft : (y-j)+1
                }
                return winnerDetails;
            }
        }
        if(x>0){
            x--;
            greatest++;
        }
        else{
            y--;
            greatest--;
        }
    }
}

const winningLineAnimation = (winningLineWidth) =>{
    winningSound.currentTime = 0;
    winningSound.play();
    winningLine.style.height = (boxes[0].offsetWidth * 8) / 100 + 'px';
    let lw = 0;
    const interval = setInterval(() => {
        if(lw >= winningLineWidth){
            clearInterval(interval);
            winningLine.style.width = winningLineWidth +'px';
            disableBoard();
        }
        winningLine.style.width = lw +'px';
        lw += 4;
    }, 1);
}

const showWinner = (winnerDetails) =>{
    if(winnerDetails != undefined){
        let winningLine = document.querySelector('.winningLine')
        console.log(winnerDetails.player + ' Won The Match')
        let i = winnerDetails.i;
        let j = winnerDetails.j;
        let winningLineWidth = 0;
        let winningLineHeight = winningLine.offsetHeight;
        let boxWidth = boxes[0].offsetWidth;
        

        if(winnerDetails.increment == 'i'){
            winningLine.style.top = boxWidth*i +'px';
            winningLine.style.left = (boxWidth*j) + (boxWidth/2)  + 'px';
            winningLine.style.transform = 'rotate(90deg)';
            winningLineWidth = boxWidth*rightCount ;
            winningLineAnimation(winningLineWidth);
        }
        else if(winnerDetails.increment == 'j'){
            winningLine.style.top = boxWidth*i + boxWidth/2 - winningLineHeight/2  +'px';
            winningLine.style.left = boxWidth*j + 'px';
            winningLineWidth = boxWidth*rightCount ;
            winningLineAnimation(winningLineWidth);
        }
        else{
            let angle = winnerDetails.angle;
            winningLine.style.top = boxWidth*i +'px';
            winningLine.style.left = boxWidth*winnerDetails.lft + 'px';
            winningLine.style.transform =`rotate(${angle}deg)`;
            winningLineWidth = rightCount*(boxWidth*141.42)/100;
            winningLineAnimation(winningLineWidth);
        }
        displayFlex(lastOptionBox);
    }
    else if(totalFilledBox == boardSize**2){
        displayFlex(lastOptionBox);
        disableBoard();
        console.log('Match Draw');
    }
}

const addClickEventOnBoard = () => {
    const inpBoxes = document.querySelectorAll('.inp-box');
    for(let i=0; i<boxes.length; i++){
        boxes[i].addEventListener('click', function(){
            if(inpBoxes[i].innerText ===''){

                if(currentPlayer == x) currentPlayer = o;
                else currentPlayer = x;

                inpBoxes[i].innerText = currentPlayer;
                totalFilledBox++;

                if(currentPlayer == x){
                    styleCrosBox(inpBoxes[i]);
                    gridData[Math.floor(i/boardSize)][i%boardSize] = 1;
                }
                else{
                    styleZeroBox(inpBoxes[i]);
                    gridData[Math.floor(i/boardSize)][i%boardSize] = 0;
                }

                let winnerDetails = checkWinner();
                showWinner(winnerDetails);
                
                setTimeout(() => {
                    boxClickSound.currentTime = 0;
                    boxClickSound.play();
                }, 0);
            }
        });
    }
}

const playGame = (userInput) =>{
    displayNone(optionBox);
    displayFlex(board);
    oponentPlayer = userInput.oponent;
    boardSize = userInput.boardSize;
    gridData = createGrid(boardSize);
    rightCount = Math.round(boardSize/3)+2;
    createAllBoxes(boardSize);
    setWidthAndHeightOfBoard();
    boxes = document.querySelectorAll('.box');
    winningLine = document.querySelector('.winningLine');
    setWidthAndHeightOfBox();
    divideBoard();
    addClickEventOnBoard();
    addClickEventOnLastOptionBox();

}

const takePlayerInput = () => {
    let boardSize = 3, userInput;
    const increase = document.querySelector('.increase');
    const decrease = document.querySelector('.decrease');
    const boardSizeBox = document.querySelector('.board-size');
    const computer = document.querySelector('.computer');
    const human = document.querySelector('.human');

    increase.addEventListener("click", function(){
        if(boardSize < 15) boardSize++;
        boardSizeBox.innerText = boardSize;
    });
    decrease.addEventListener("click", function(){
        if(boardSize > 3) boardSize--;
        boardSizeBox.innerText = boardSize;
    });
    computer.addEventListener("click", function(){
        userInput = {
            boardSize : boardSize,
            oponent : 'computer'
        }
        playGame(userInput);
    });
    human.addEventListener("click", function(){
        userInput = {
            boardSize : boardSize,
            oponent : 'human'
        }
        playGame(userInput);
    });
}

const restartGame = () => {
    const lastBoxSize = boxSize;
    const lastOponentPlayer = oponentPlayer;
    const lastRightCount = rightCount;
    resetGame();
    boxSize = lastBoxSize;
    rightCount = lastRightCount;
    oponentPlayer = lastOponentPlayer;
    userInput = {
        boardSize : boardSize,
        oponent : oponentPlayer
    }
    playGame(userInput);
}

const resetGame = () => {
    enableBoard();
    displayNone(board, lastOptionBox);
    displayFlex(optionBox);
    board.innerHTML ='<div class="winningLine"></div>';
    optionBox.querySelector('.board-size').innerText = '3';
    totalFilledBox = 0;
    boxSize = 0;
    rightCount = 0;
    oponentPlayer = '';
    gridData = null;
    userInput = {
        boardSize : 0,
        against : ''
    }
}

const startGame = () => {
    resetGame();
    takePlayerInput();
}

const boardHandler = (e) => {
    e.stopPropagation();
    e.preventDefault();
    return false;
}

const disableBoard = () => {
    board.addEventListener("click",boardHandler,true);
    board.classList.add('blur-board');
}

const enableBoard = () => {
    board.classList.remove('blur-board');
    board.removeEventListener("click",boardHandler,true);
}

const addClickEventOnLastOptionBox = () => {
    const home = document.querySelector('.home');
    const restart = document.querySelector('.restart');

    home.addEventListener('click', function(){
        startGame();
    });

    restart.addEventListener('click', function(){
        restartGame();
    });
}

const displayFlex = (...args) => {
    for(let element of args){
        element.style.display = 'flex';
    }
}
const displayNone = (...args) => {
    for(let element of args){
        element.style.display = 'none';
    }
}

const boxClickSound = new Audio();
const winningSound = new Audio();
boxClickSound.src = "media/box-click.wav";
winningSound.src = "media/winning.wav";

const board = document.querySelector('.board');
const optionBox = document.querySelector('.option');
const lastOptionBox = document.querySelector('.last-option');
let winningLine , rightCount, boxSize, oponentPlayer, totalFilledBox;

let x = 'X', o ='O', currentPlayer = x ;
let boxes ;

startGame();


