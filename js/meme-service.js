'use strict'

const KEY = 'memes';
var gId = 1;
var gKeywords = { 'happy': 12, 'funny': 1 };

var gImg = [{
        id: 1,
        url: `./img/meme-imgs (square)/1.jpg`,
        keywords: ['happy']
    },
    {
        id: 2,
        url: `./img/meme-imgs (square)/2.jpg`,
        keywords: ['happy']
    }
];

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

function setInitialPositions(canvas) {
    gMeme.lines.forEach((line, idx) => {
        line.positionX = canvas.width / 2;
        if (idx === 0) line.positionY = canvas.height * 0.1;
        else if (idx === 1) line.positionY = canvas.height * 0.9;
        else line.positionY = canvas.height / 2;
    });
}

function moveText(line, distance) {
    if (gMeme.lines[line].positionY >= 380 && distance > 0) return;
    if (gMeme.lines[line].positionY <= 20 && distance < 0) return;
    gMeme.lines[line].positionY += distance;
}

function getMeme() {
    return gMeme;
}

function getImg(id) {
    return gImg[id - 1].url;
}

function setTextToMeme(line, text) {
    gMeme.lines[line].txt = text;
}

function getTextFromMeme() {
    return gMeme.lines[getSelectedLine()].txt;
}

function setStrokeColorToMeme(line, strokeColor) {
    gMeme.lines[line].strokeColor = strokeColor;
}

// function getStrokeColorFromMeme() {
//     return gMeme.lines[getSelectedLine()].strokeColor;
// }

function setFillColorToMeme(line, fillColor) {
    gMeme.lines[line].fillColor = fillColor;
}

// function getFillColorFromMeme() {
//     return gMeme.lines[getSelectedLine()].fillColor;
// }

function setSizeToMeme(line, size) {
    if (gMeme.lines[line].size >= 100 && size > 0) return;
    if (gMeme.lines[line].size <= 20 && size < 0) return;
    gMeme.lines[line].size += size;
}

// function getSizeFromMeme() {
//     return gMeme.lines[getSelectedLine()].size;
// }

function setAlignToMeme(line, alignTo) {
    gMeme.lines[line].align = alignTo;
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

function deleteMeme(line) {
    gMeme.lines.splice(line, 1);
}

// function getMemeById(memeId) {
//     var meme = gMeme.find(function(meme) {
//         return memeId === meme.id
//     });
//     return meme;
// }


// function _createImg() {
//     return {
//         id: gId++,
//         url: `./img/meme-imgs(square)/${gId}.jpg`,
//         keywords: ['happy'] //makeRandKey()
//     };
// }