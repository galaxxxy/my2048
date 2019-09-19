let board = [],
    score = 0;

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
}

function init() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            let cell = $("#grid-cell-" + i + "-" + j);
            cell.css({ top: getPosTop(i, j) + 'px', left: getPosLeft(i, j) + 'px' });
        }
    }
    board = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
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
                });

            }
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