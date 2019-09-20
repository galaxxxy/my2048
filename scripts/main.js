let board = [],
    score = 0,
    hasConflicted = [];// 记录每个cell是否合并

$(function () {
    $("#newgameButton").click(function () {
        newgame();
        return false;
    });
    newgame();
});

function newgame() {
    //初始化grid-container
    init();
    //随机生成两个含数字的格子
    generateOneNum();
    generateOneNum();
    // 分数初始化
    score = 0;
}

function init() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            let cell = $("#grid-cell-" + i + "-" + j);
            cell.css({ top: getPosTop(i, j) + 'px', left: getPosLeft(i, j) + 'px' });
        }
    }
    board = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    hasConflicted = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    updateBoardView();
}

function updateBoardView() {
    $(".number-cell").remove();
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            let numberCell = null;
            $("#grid-container").append("<div class='number-cell' id='number-cell-" + i + "-" + j + "'></div>");
            numberCell = $('#number-cell-' + i + '-' + j);
            if (board[i][j] == 0) {
                numberCell.css({
                    width: "0px",
                    height: "0px",
                    top: getPosTop(i, j) + 50 + 'px',
                    left: getPosLeft(i, j) + 50 + 'px'
                });
            } else {
                numberCell.css({
                    width: "100px",
                    height: "100px",
                    top: getPosTop(i, j) + 'px',
                    left: getPosLeft(i, j) + 'px',
                    'background-color': getNumberBackgroundColor(board[i][j]),
                    color: getNumberColor(board[i][j])
                }).text(board[i][j]);//更新面板时也更新非零值的显示
            }
            hasConflicted[i][j] = 0;//initalize
        }
    }
}

function generateOneNum(){
    let x = 0,
        y = 0,
        value = 0;
    if(noSpace(board)){
        return false;
    }
    //生成位置
    x = Math.floor(Math.random()*4);
    y = Math.floor(Math.random()*4);
    while(true){
        if(board[x][y] == 0){
            break;
        }
        x = Math.floor(Math.random()*4);
        y = Math.floor(Math.random()*4);
    }
    //生成值
    value = Math.random() < 0.5 ? 2 : 4;
    //在位置上显示值
    board[x][y] = value;
    showNumber(x,y,value);
    return true;
}

$(document).keydown(function (e) {
    switch (e.keyCode) {
        case 37://left
            if (moveLeft()) {
                setTimeout(generateOneNum,210);
            }
            isGameOver();
            break;
        case 38://up
            if (moveUp()) {
                setTimeout(generateOneNum,210);
            }
            isGameOver();
            break;
        case 39://right 
            if (moveRight()) {
                setTimeout(generateOneNum,210);
            }
            isGameOver();
            break;
        case 40:// down
            if (moveDown()){
                setTimeout(generateOneNum,210);
            }
            isGameOver();
            break;
        default:
            break;
    }
});

function moveLeft(){
    if(!canMoveLeft(board)){
        return false;
    }
    //move left
    for (let i = 0; i < 4; i++) {
        for (let j = 1; j < 4; j++) {
            if(board[i][j] !== 0){
                for(let k = 0; k < j; k++){
                    if(board[i][k] == 0 && noBlockHorizontal(i,k,j,board)){
                        //move
                        showMoveAnimation(i,j,i,k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }else if(board[i][k] == board[i][j] && noBlockHorizontal(i,k,j,board) && !hasConflicted[i][k]){
                        //move
                        showMoveAnimation(i,j,i,k);
                        //add
                        board[i][k] = board[i][j]*2;
                        board[i][j] = 0;
                        // add score
                        score += board[i][k];
                        // show score
                        updateScore(score);
                        // update hasConflicted
                        hasConflicted[i][k] = 1;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout(updateBoardView,200);
    return true;
}

function moveUp(){
    //判断是否能够向上移动
    if(!canMoveUp(board)){
        return false;
    }
    //move up
    for (let i = 1; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if(board[i][j] !== 0){
                for(let k = 0; k < i; k++){
                    if(board[k][j] == 0 && noBlockVertical(j,k,i,board)){
                        //move up
                        showMoveAnimation(i,j,k,j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }else if(board[k][j] == board[i][j] && noBlockVertical(j,k,i,board) && !hasConflicted[k][j]){
                        //move up
                        showMoveAnimation(i,j,k,j);
                        //add
                        board[k][j] = board[i][j]*2;
                        board[i][j] = 0;
                        // add score
                        score += board[k][j];
                        //show score
                        updateScore(score);
                        // update hasConflicted
                        hasConflicted[k][j] = 1;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout(updateBoardView,200);
    return true;
}

function moveRight(){
    // 判断是否能向右移动
    if(!canMoveRight(board)){
        return false;
    }
    // move right
    for (let i = 3; i > -1; i--) {
        for (let j = 2; j > -1; j--) {
            if (board[i][j] !== 0) {
                for(let k = 3; k>j; k--){
                    // 右方为0值
                    if(board[i][k] == 0 && noBlockHorizontal(i,j,k,board)){
                        // move
                        showMoveAnimation(i,j,i,k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }else if(board[i][k] == board[i][j] && noBlockHorizontal(i,j,k,board) && !hasConflicted[i][k]){//右边为可合并值
                        // move
                        showMoveAnimation(i,j,i,k);
                        // add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        // add score
                        score += board[i][k];
                        //show score
                        updateScore(score);
                        // update hasConflicted
                        hasConflicted[i][k] = 1;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout(updateBoardView,200);
    return true;
}

function moveDown(){
    // 是否能下移
    if(!canMoveDown(board)){
        return false;
    }
    for(let i = 2; i > -1; i--){
        for(let j = 3; j > -1; j--){
            if(board[i][j] !== 0){
                for(let k = 3; k > i; k--){
                    if(board[k][j] == 0 && noBlockVertical(j,i,k,board)){
                        // move
                        showMoveAnimation(i,j,k,j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }else if(board[k][j] == board[i][j] && noBlockVertical(j,i,k,board) && !hasConflicted[k][j]){
                        // move
                        showMoveAnimation(i,j,k,j);
                        // add
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        // add score
                        score += board[k][j];
                        //show score
                        updateScore(score);
                        // update hasConflicted
                        hasConflicted[k][j] = 1;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout(updateBoardView,200);
    return true;
}

function isGameOver(){
    // 无格子且不能移动
    if(noSpace(board)&&noMove(board)){
        console.log("dsfds");
        gameOver();
    }
}

function gameOver(){
    alert("game over!");
}