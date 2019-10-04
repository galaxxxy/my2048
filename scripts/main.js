let board = [],
    score = 0,
    hasConflicted = [];// 记录每个cell是否合并

//用于存储触摸事件的坐标
let startX = 0,
    startY = 0,
    endX = 0,
    endY = 0;

$(function () {
    if(deviceWidth > 500){
        gridContainerWidth = 500;
        cellSpace = 20;
        cellSideLength = 100;
    }
    prepareForMobile();
    $("#newgameButton").click(function () {
        newgame();
        return false;
    });
    newgame();
});

function prepareForMobile(){
    $("#grid-container").css({
        width: gridContainerWidth - 2*cellSpace,
        height: gridContainerWidth - 2*cellSpace,
        padding: cellSpace,
        'border-radius': 0.02*gridContainerWidth,
    });

    $("#grid-cell").css({
        width: cellSideLength,
        height: cellSideLength,
        'border-radius': 0.02*cellSideLength,
    });
}

function newgame() {
    //初始化grid-container
    init();
    //随机生成两个含数字的格子
    generateOneNum();
    generateOneNum();
}

function init() {
    // 分数初始化
    score = 0;
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            let cell = $("#grid-cell-" + i + "-" + j);
            cell.css({
                top: getPosTop(i, j) + 'px',
                left: getPosLeft(i, j) + 'px',
                width: cellSideLength,
                height: cellSideLength
            });
        }
    }
    board = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    hasConflicted = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    updateBoardView();
    updateScore(score);
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
                    top: getPosTop(i, j) + cellSideLength/2 + 'px',
                    left: getPosLeft(i, j) + cellSideLength/2 + 'px'
                });
            } else {
                numberCell.css({
                    width: cellSideLength,
                    height: cellSideLength,
                    top: getPosTop(i, j) + 'px',
                    left: getPosLeft(i, j) + 'px',
                    'background-color': getNumberBackgroundColor(board[i][j]),
                    color: getNumberColor(board[i][j])
                }).text(board[i][j]);//更新面板时也更新非零值的显示
            }
            hasConflicted[i][j] = 0;//initalize
        }
    }
    $(".number-cell").css({
        'line-height': cellSideLength+'px',
        'font-size': 0.6*cellSideLength+'px'
    });
}

function generateOneNum(){
    let x = 0,
        y = 0,
        value = 0,
        times = 1;//循环次数
    if(noSpace(board)){
        return false;
    }
    //生成位置
    x = Math.floor(Math.random()*4);
    y = Math.floor(Math.random()*4);
    for(; times <= 50; times++){
        if(board[x][y] == 0){
            break;
        }
        x = Math.floor(Math.random()*4);
        y = Math.floor(Math.random()*4);
    }
    //人工找寻空位
    if(times > 50){
        for(let i = 0; i < 4; i++){
            let index = board[i].indexOf(0);
            if(index !== -1){
                x = i;
                y = index;
                break;
            }
        }
    }
    //生成值
    value = Math.random() < 0.5 ? 2 : 4;
    //在位置上显示值
    board[x][y] = value;
    showNumber(x,y,value);
    return true;
}

function keydownFunc(e) {
    //防止出现sidebar时方向键带动页面移动
    //e.preventDefault();
    switch (e.keyCode) {
        case 37: //left
            e.preventDefault();
            if (moveLeft()) {
                setTimeout(generateOneNum, 210);
                setTimeout(isGameOver, 250);
            }
            break;
        case 38: //up
            e.preventDefault();
            if (moveUp()) {
                setTimeout(generateOneNum, 210);
                setTimeout(isGameOver, 250);
            }
            break;
        case 39: //right 
            e.preventDefault();
            if (moveRight()) {
                setTimeout(generateOneNum, 210);
                setTimeout(isGameOver, 250);
            }
            break;
        case 40: // down
            e.preventDefault();
            if (moveDown()) {
                setTimeout(generateOneNum, 210);
                setTimeout(isGameOver, 250);
            }
            break;
        default:
            break;
    };
}

$(document).keydown(throttle(keydownFunc, 350));

function touchmoveHandler(e){
    e.preventDefault();
}

// passive event listener
document.addEventListener('touchmove',debounce(touchmoveHandler, 250, true),{
    passive: false,
});

document.addEventListener('touchstart',function(e){
    startX = e.touches[0].pageX;
    startY = e.touches[0].pageY;
});

document.addEventListener('touchend',function(e){
    let deltaX = 0,
        deltaY = 0;

    endX = e.changedTouches[0].pageX;
    endY = e.changedTouches[0].pageY;

    deltaX = startX - endX;
    deltaY = startY - endY;

    //判断水平还是垂直滑动
    if(Math.abs(deltaX) > Math.abs(deltaY)){
        //水平滑动
        //判断方向
        if(deltaX > 0){
            //左滑
            if (moveLeft()) {
                setTimeout(generateOneNum,210);
                setTimeout(isGameOver,250);
            }
        }else if(deltaX < 0){
            //右滑
            if (moveRight()) {
                setTimeout(generateOneNum,210);
                setTimeout(isGameOver,250);
            }
        }
    }else if(Math.abs(deltaX) < Math.abs(deltaY)){
        //垂直滑动
        //判断方向
        if(deltaY > 0){
            //上滑
            if (moveUp()) {
                setTimeout(generateOneNum,210);
                setTimeout(isGameOver,250);
            }
        }else if(deltaY < 0){
            //下滑
            if (moveDown()){
                setTimeout(generateOneNum,210);
                setTimeout(isGameOver,250);
            }
        }
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