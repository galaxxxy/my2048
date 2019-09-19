function showNumber(i,j,number){
    let numberCell = $('#number-cell-' + i + '-' + j);
    numberCell.css({
        'background-color': getNumberBackgroundColor(number),
        color: getNumberColor(number),
    }).text(number);

    numberCell.animate({
        width: '100px',
        height: '100px',
        top: getPosTop(i,j),
        left: getPosLeft(i,j)
    },50);
}

function showMoveAnimation(fromX,fromY,toX,toY){
    let numberCell = $('#number-cell-' + fromX + '-' + fromY),
        top = getPosTop(toX,toY),
        left = getPosLeft(toX,toY);
    numberCell.animate({
        top: top+"px",
        left: left+"px"
    },200);
}