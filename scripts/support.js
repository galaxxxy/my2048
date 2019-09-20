function getPosTop(x,y){
    return 20 + x*120;
}

function getPosLeft(x,y){
    return 20 + y*120;
}

function getNumberBackgroundColor(value){
    switch(value){
        case 2: return "#eee4da";break;
        case 4: return "#ede0c8";break;
        case 8: return "#f2b179";break;
        case 16: return "#f59563";break;
        case 32: return "#f67c5f";break;
        case 64: return "#f65e3b";break;
        case 128: return "#edcf72";break;
        case 256: return "#edcc61";break;
        case 512: return "#9c0";break;
        case 1024: return "#33b5e5";break;
        case 2048: return "#09c";break;
        case 4096: return "#a6c";break;
        case 8192: return "#93c";break;
    }
    return "black";
}

function getNumberColor(value){
    if(value <= 4){
        return "#776e65";
    }
    return "white";
}

function noSpace(board){
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if(board[i][j] == 0) return false;
        }
    }
    return true;
}

function canMoveLeft(board){
    for (let i = 0; i < 4; i++) {
        for (let j = 1; j < 4; j++) {
            if(board[i][j] !== 0) {
                if(board[i][j-1] == 0 || board[i][j-1] == board[i][j]){//左侧无数字或数字可合并
                    return true;
                }
            }
        }
    }
    return false;
}

function canMoveUp(board){
    for (let i = 1; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if(board[i][j] !== 0){
                if(board[i-1][j] == 0 || board[i][j] == board[i-1][j]){//上方无数字或数字可合并
                    return true;
                }
            }
        }
    }
    return false;
}

function canMoveRight(board) {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] !== 0) {
                //右方有零值或可合并数值
                if (board[i][j+1] == 0 || board[i][j] == board[i][j+1]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function canMoveDown(board){
    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 4; j++){
            if(board[i][j] !== 0){
                // 下方有零值或可合并数值
                if(board[i+1][j] == 0 || board[i+1][j] == board[i][j]){
                    return true;
                }
            }
        }
    }
    return false;
}

function noBlockHorizontal(row,left,right,board){
    for(let i = left + 1; i < right; i++){
        if(board[row][i] !== 0){
            return false;
        }
    }
    return true;
}

function noBlockVertical(column,top,bottom,board){
    for(let i = top + 1; i < bottom; i++){
        if(board[i][column] !== 0){
            return false;
        }
    }
    return true;
}

function noMove(board){
    if(canMoveDown(board)||canMoveLeft(board)||canMoveRight(board)||canMoveLeft(board)){
        return false;
    }
    return true;
}