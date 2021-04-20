'use strict'

const KEY = 'memes';
const IMG_COUNT = 18;
var gId = 1;
var gKeywords = { 'happy': 12, 'funny': 1 };
var gImg = [];

var gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,
    lines: [{
            txt: '',
            size: 20,
            align: 'left',
            strokeColor: 'black',
            fillColor: 'black',
        },
        {
            txt: '',
            size: 20,
            align: 'left',
            strokeColor: 'black',
            fillColor: 'black',
        }
    ]
};

function createImages() {
    for (var i = 0; i < IMG_COUNT; i++) {
        _createImg()
    }
}

function _createImg() {
    let img = {
        id: gId,
        url: `./img/meme-imgs (square)/${gId++}.jpg`,
        keywords: [makeRandKey()]
    };
    gImg.push(img);
}

function setInitialPositions(canvas) {
    gMeme.lines.forEach((line, idx) => {
        line.positionX = canvas.width / 2;
        if (idx === 0) line.positionY = canvas.height * 0.1;
        else if (idx === 1) line.positionY = canvas.height * 0.9;
        else line.positionY = canvas.height / 2;
    });
}

function moveText(distance) {
    let currLine = getSelectedLine();
    if (gMeme.lines[currLine].positionY >= 380 && distance > 0) return;
    if (gMeme.lines[currLine].positionY <= 20 && distance < 0) return;
    gMeme.lines[currLine].positionY += distance;
}

function getMeme() {
    return gMeme;
}

function getImages() {
    return gImg;
}

function getImg(id) {
    return gImg[id - 1].url;
}

function setTextToMeme(text) {
    let currLine = getSelectedLine();
    gMeme.lines[currLine].txt = text;
}

function getTextFromMeme() {
    let currLine = getSelectedLine();
    return gMeme.lines[currLine].txt;
}

function setStrokeColorToMeme(strokeColor) {
    let currLine = getSelectedLine();
    gMeme.lines[currLine].strokeColor = strokeColor;
}

// function getStrokeColorFromMeme() {
//     return gMeme.lines[getSelectedLine()].strokeColor;
// }

function setFillColorToMeme(fillColor) {
    let currLine = getSelectedLine();
    gMeme.lines[currLine].fillColor = fillColor;
}

// function getFillColorFromMeme() {
//     return gMeme.lines[getSelectedLine()].fillColor;
// }

function setSizeToMeme(size) {
    let currLine = getSelectedLine();
    if (gMeme.lines[currLine].size >= 100 && size > 0) return;
    if (gMeme.lines[currLine].size <= 20 && size < 0) return;
    gMeme.lines[currLine].size += size;
}

// function getSizeFromMeme() {
//     return gMeme.lines[getSelectedLine()].size;
// }

function setAlignToMeme(alignTo) {
    let currLine = getSelectedLine();
    gMeme.lines[currLine].align = alignTo;
}

// function getAlignFromMeme() {
//     return gMeme.lines[getSelectedLine()].align;
// }

function setSelectedLine(line) {
    gMeme.selectedLineIdx = line;
}

function getSelectedLine() {
    return gMeme.selectedLineIdx;
}

function setSelectedImgId(imgId) {
    gMeme.selectedImgId = imgId;
}

function getSelectedImgId() {
    return gMeme.selectedImgId;
}

function createLine(canvas) {
    var newLine = {
        txt: '',
        size: 20,
        align: 'left',
        strokeColor: 'black',
        fillColor: 'black',
        positionX: canvas.width / 2,
        positionY: canvas.height / 2
    }
    gMeme.lines.push(newLine);
}

function deleteMeme() {
    let currLine = getSelectedLine();
    gMeme.lines.splice(currLine, 1);
}

function getMemePosition() {
    let currLine = getSelectedLine();
    let memePos = {
        x: gMeme.lines[currLine].positionX,
        y: gMeme.lines[currLine].positionY
    }
    return memePos;
}

function setMemePosition(posX, posY) {
    let currLine = getSelectedLine();
    gMeme.lines[currLine].positionX += posX;
    gMeme.lines[currLine].positionY += posY;
}