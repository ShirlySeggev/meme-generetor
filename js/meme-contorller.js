'use strict';


var gCanvas;
var gCtx;
var gText = '';

function onInit() {
    gCanvas = document.querySelector('#meme-canvas');
    gCtx = gCanvas.getContext('2d');
    drawImg(1);
    addEventsListener();
}

function addEventsListener() {
    var elfreeText = document.querySelector('#freeText');
    elfreeText.addEventListener('input', onSetText);

    var elStrokeColor = document.querySelector('#strokeColor');
    elStrokeColor.addEventListener('input', onSetStrokeColor);

    var elFillColor = document.querySelector('#fillColor');
    elFillColor.addEventListener('input', onSetFillColor);

    window.addEventListener('resize', resizeCanvas);
}

function onSetStrokeColor(ev) {
    setStrokeColorToMeme(getSelectedLine(), ev.target.value);
}

function onSetFillColor(ev) {
    setFillColorToMeme(getSelectedLine(), ev.target.value);
}

function onSetSize(size) {
    setSizeToMeme(getSelectedLine(), size);
}

function onSetAlign(alignTo) {
    setAlignToMeme(getSelectedLine(), alignTo);
}

function onSetText(ev) {
    if (!ev.data) {
        gText = gText.substr(0, gText.length - 1);
    } else {
        gText += ev.data;
    }
    setTextToMeme(getSelectedLine(), gText);
    renderText();
}

function renderText() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
    drawImg(1);
    setTimeout(function() {
        drawText();
    }, 1);
    console.log(gMeme);
}

function drawImg(imgId) {
    var img = new Image();
    img.src = getImg(imgId);
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
    }
}

function drawText() {
    const pos = {
        x: gCanvas.width / 2,
        y: getHeightPos()
    };
    gCtx.strokeStyle = getStrokeColorFromMeme();
    gCtx.fillStyle = getFillColorFromMeme();
    gCtx.font = `${getSizeFromMeme()}px Impact`;
    gCtx.textAlign = getAlignFromMeme();
    gCtx.fillText(getTextFromMeme(), pos.x, pos.y);
    gCtx.strokeText(getTextFromMeme(), pos.x, pos.y);
}



function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container');
    gCanvas.width = elContainer.offsetWidth;
    gCanvas.height = elContainer.offsetHeight;
    drawImg(1)
}

function onClearCanvas() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
    drawImg(1);
    setTextToMeme(getSelectedLine(), '');
    gText = '';
    document.querySelector('input[name=freeText]').value = '';
}

function onDownloadImg(elLink) {
    const imgContent = gCanvas.toDataURL();
    elLink.href = imgContent;
}

function onSelectLine(line) {
    setSelectedLine(line);
    gText = getTextFromMeme();
    document.querySelector('input[name=freeText]').value = getTextFromMeme();
}


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