'use strict'

const STORE_KEY = 'memesDB';
const IMG_COUNT = 18;
var gId = 1;
var gKeywords = { 'happy': 12, 'funny': 1 };
var gImg = [];
var gSavedMemes = [];
var gFilterBy = '';

var gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,
    lines: [{
            txt: '',
            size: 20,
            align: 'left',
            font: 'Impact',
            strokeColor: 'black',
            fillColor: 'black',
        },
        {
            txt: '',
            size: 20,
            align: 'left',
            font: 'Impact',
            strokeColor: 'black',
            fillColor: 'black',
        }
    ],
    selectedStickerIdx: -1,
    stickers: []
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
    const currLine = getSelectedLine();
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

function setTextToMeme(text, canvas) {
    const currLine = getSelectedLine();
    if (gMeme.lines.length === 0) createLine(canvas);
    gMeme.lines[currLine].txt = text;
}

function getTextFromMeme() {
    const currLine = getSelectedLine();
    return gMeme.lines[currLine].txt;
}

function setStrokeColorToMeme(strokeColor) {
    const currLine = getSelectedLine();
    gMeme.lines[currLine].strokeColor = strokeColor;
}


function setFillColorToMeme(fillColor) {
    const currLine = getSelectedLine();
    gMeme.lines[currLine].fillColor = fillColor;
}

function setSizeToMeme(size) {
    const currLine = getSelectedLine();
    if (gMeme.lines[currLine].size >= 100 && size > 0) return;
    if (gMeme.lines[currLine].size <= 20 && size < 0) return;
    gMeme.lines[currLine].size += size;
}

function setAlignToMeme(alignTo) {
    const currLine = getSelectedLine();
    gMeme.lines[currLine].align = alignTo;
    //Need to change also the xy positions!
}

function setFontToMeme(font) {
    const currLine = getSelectedLine();
    gMeme.lines[currLine].font = font;
}

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
        font: 'Impact',
        strokeColor: 'black',
        fillColor: 'black',
        positionX: canvas.width / 2,
        positionY: canvas.height / 2
    }
    gMeme.lines.push(newLine);
}

function deleteLine() {
    const currLine = getSelectedLine();
    gMeme.lines.splice(currLine, 1);
}

function getMemePosition() {
    const currLine = getSelectedLine();
    const memePos = {
        x: gMeme.lines[currLine].positionX,
        y: gMeme.lines[currLine].positionY
    }
    return memePos;
}

function setMemePosition(posX, posY) {
    const currLine = getSelectedLine();
    gMeme.lines[currLine].positionX += posX;
    gMeme.lines[currLine].positionY += posY;
}

function saveMeme(meme) {
    gSavedMemes.push(meme);
    saveToStorage(STORE_KEY, gSavedMemes);
}

function getSavedMemes() {
    var savedMemes = loadFromStorage(STORE_KEY);
    return savedMemes;
}

function findMemeLine(pos) {
    var lineIdx = gMeme.lines.findIndex(line => {
        let width = gCtx.measureText(line.txt).width;
        if (line.positionX >= pos.x && line.positionX - pos.x <= 10) {
            if (line.positionY >= pos.y && line.positionY - pos.y <= line.size + 5) return line;
            else if (line.positionY <= pos.y && line.positionY - pos.y >= -10) return line;

        } else if (line.positionX <= pos.x && line.positionX - pos.x + width >= -10) {
            if (line.positionY >= pos.y && line.positionY - pos.y <= line.size + 5) return line;
            else if (line.positionY <= pos.y && line.positionY - pos.y >= -10) return line;
        }
    });
    return lineIdx;
}

function getFilteredMemes() {
    var filteredMemes = gImg.filter(img => {
        var isFound = (img.keywords).some(key => {
            return key.includes(gFilterBy);
        });
        if (isFound) return img;
    });
    return filteredMemes;
}

function setFilter(filterBy) {
    gFilterBy = filterBy;
}

function setStickerOnMeme(sticker, size) {
    let newSticker = { src: sticker, positionX: 30, positionY: 30, size };
    gMeme.selectedStickerIdx = gMeme.stickers.length;
    gMeme.stickers.push(newSticker);
}

function setStickerPosition(posX, posY) {
    gMeme.stickers[gMeme.selectedStickerIdx].positionX += posX;
    gMeme.stickers[gMeme.selectedStickerIdx].positionY += posY;
}

function resetMeme() {
    gMeme.lines.forEach(line => {
        line.txt = '';
    });
    gMeme.selectedLineIdx = 0;
    gMeme.selectedStickerIdx = 0;
    gMeme.stickers = [];
}

function setSelectedSticker(sticker) {
    gMeme.selectedStickerIdx = sticker;
}

function findStickerIdx(pos) {
    var stickerIdx = gMeme.stickers.findIndex(sticker => {
        const distance = Math.sqrt((pos.x - sticker.positionX) ** 2 + (pos.y - sticker.positionY) ** 2);
        return distance <= sticker.size;
    });
    return stickerIdx;
}

function deleteSticker() {
    const currSticker = gMeme.selectedStickerIdx;
    gMeme.stickers.splice(currSticker, 1);
}