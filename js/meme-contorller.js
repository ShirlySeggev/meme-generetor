'use strict';


var gCanvas;
var gCtx;
var gText = '';

function onInit() {
    gCanvas = document.querySelector('#meme-canvas');
    gCtx = gCanvas.getContext('2d');
    // onSetCanvas();
    setInitialPositions(gCanvas);
    addEventsListener();

}

function addEventsListener() {
    var elfreeText = document.querySelector('#freeText');
    elfreeText.addEventListener('input', onSetText);

    var elStrokeColor = document.querySelector('#strokeColor');
    elStrokeColor.addEventListener('input', onSetStrokeColor);

    var elFillColor = document.querySelector('#fillColor');
    elFillColor.addEventListener('input', onSetFillColor);

    // window.addEventListener('resize', onResizeCanvas);
}

function drawImg(imgId) {
    var img = new Image();
    img.src = getImg(imgId);
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
    }
}

function onSetText(ev) {
    if (!ev.data) {
        gText = gText.substr(0, gText.length - 1);
    } else {
        gText += ev.data;
    }
    setTextToMeme(getSelectedLine(), gText);
    renderCanvas();
}

function renderCanvas() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
    drawImg(getSelectedImgId());
    setTimeout(function() {
        var lines = getMeme().lines;
        lines.forEach(line => {
            drawText(line);
        });
        console.log(lines);
        // drawText();
    }, 1);
    console.log(gMeme);
}

function drawText(line) {
    // const pos = {
    //     x: gCanvas.width / 2,
    //     y: getHeightPos() + gMove
    // };
    console.log('line', line);
    gCtx.strokeStyle = line.strokeColor;
    gCtx.fillStyle = line.fillColor;
    gCtx.font = `${line.size}px Impact`;
    gCtx.textAlign = line.align;
    gCtx.fillText(line.txt, line.positionX, line.positionY);
    gCtx.strokeText(line.txt, line.positionX, line.positionY);
}

// function drawText() {
//     const pos = {
//         x: gCanvas.width / 2,
//         y: getHeightPos() + gMove
//     };
//     gCtx.strokeStyle = getStrokeColorFromMeme();
//     gCtx.fillStyle = getFillColorFromMeme();
//     gCtx.font = `${getSizeFromMeme()}px Impact`;
//     gCtx.textAlign = getAlignFromMeme();
//     gCtx.fillText(getTextFromMeme(), pos.x, pos.y);
//     gCtx.strokeText(getTextFromMeme(), pos.x, pos.y);
// }

function getHeightPos() {
    var yPos;
    const line = getSelectedLine();
    switch (line) {
        case 0:
            yPos = gCanvas.height * 0.1;
            break;
        case 1:
            yPos = gCanvas.height * 0.9;
            break;
    }
    return yPos;
}

function onSetStrokeColor(ev) {
    setStrokeColorToMeme(getSelectedLine(), ev.target.value);
    renderCanvas();
}

function onSetFillColor(ev) {
    setFillColorToMeme(getSelectedLine(), ev.target.value);
    renderCanvas();
}

function onSetSize(size) {
    setSizeToMeme(getSelectedLine(), size);
    renderCanvas();
}

function onSetAlign(alignTo) {
    setAlignToMeme(getSelectedLine(), alignTo);
    renderCanvas();
}

function onClearCanvas() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
    drawImg(getSelectedImgId());
    setTextToMeme(getSelectedLine(), '');
    gText = '';
    document.querySelector('input[name=freeText]').value = '';
}

function onSelectLine(line) {
    setSelectedLine(line);
    gText = getTextFromMeme();
    document.querySelector('input[name=freeText]').value = getTextFromMeme();
}

function onMoveText(distance) {
    moveText(getSelectedLine(), distance);
    renderCanvas();
}

function onOpenModal(memeId) {
    document.querySelector('.modal').style.display = 'flex';
    setSelectedImgId(memeId);
    drawImg(getSelectedImgId());
}

function onCloseModal() {
    document.querySelector('.modal').style.display = 'none';
}

function onDownloadImg(elLink) {
    const imgContent = gCanvas.toDataURL();
    elLink.href = imgContent;
}

function onResizeCanvas() {
    const elContainer = document.querySelector('.canvas-container');
    gCanvas.width = elContainer.offsetWidth;
    gCanvas.height = elContainer.offsetHeight;
    drawImg(getSelectedImgId());
}