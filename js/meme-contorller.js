'use strict';


var gCanvas;
var gCtx;
var gStartPos; //
var gIsDragging = false;
var gDragging;
var gSelected;
const gTouchEvs = ['touchstart', 'touchmove', 'touchend'];

function onInit() {
    createImages();
    renderImages();
    gCanvas = document.querySelector('#meme-canvas');
    gCtx = gCanvas.getContext('2d');
    setEventsListener();
}

function renderImages() {
    var images = getFilteredMemes();
    var imgHtml = images.map(image => {
        return `  
                 <div class="card">
                    <img class="meme-img" src="./img/meme-imgs (square)/${image.id}.jpg" onclick="onOpenModal(${image.id})">
                </div>`;
    });
    var elContainer = document.querySelector('.image-gallery');
    elContainer.innerHTML = imgHtml.join('');
}

function setEventsListener() {
    var elfreeText = document.querySelector('#freeText');
    elfreeText.addEventListener('input', onSetText);

    var elStrokeColor = document.querySelector('#strokeColor');
    elStrokeColor.addEventListener('input', onSetStrokeColor);

    var elFillColor = document.querySelector('#fillColor');
    elFillColor.addEventListener('input', onSetFillColor);

    var elFont = document.querySelector('select[name=font]');
    elFont.addEventListener('change', onSetFont);

    var elSearch = document.querySelector('#searchMeme');
    elSearch.addEventListener('input', onSearchMeme);

    addMouseListeners();
    addTouchListeners();
}

function addMouseListeners() {
    gCanvas.addEventListener('mousemove', onMove);
    gCanvas.addEventListener('mousedown', onDown);
    gCanvas.addEventListener('mouseup', onUp);
    gCanvas.addEventListener('click', onClick);
}

function addTouchListeners() {
    gCanvas.addEventListener('touchstart', onDown);
    gCanvas.addEventListener('touchmove', onMove);
    gCanvas.addEventListener('touchend', onUp);
}

function onToggleMenu() {
    document.body.classList.toggle('menu-open');
}

function renderCanvas() {
    var img = new Image();
    const imgId = getSelectedImgId();
    img.src = getImg(imgId);
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
        var lines = getMeme().lines;
        lines.forEach((line, idx) => {
            drawText(line, idx);
        });
        var stickers = getMeme().stickers;
        stickers.forEach(sticker => {
            renderSticker(sticker);
        });
    }
}

function onSetText(ev) {
    setTextToMeme(ev.target.value, gCanvas);
    renderCanvas();
}


function drawText(line, idx) {
    gCtx.beginPath();
    gCtx.strokeStyle = line.strokeColor;
    gCtx.fillStyle = line.fillColor;
    gCtx.font = `${line.size}px ${line.font}`;
    gCtx.textAlign = line.align;
    gCtx.fillText(line.txt, line.positionX, line.positionY);
    gCtx.strokeText(line.txt, line.positionX, line.positionY);
    let currLine = getSelectedLine();
    if (currLine === idx) {
        let width = gCtx.measureText(line.txt).width;
        let height = line.size;
        gCtx.strokeStyle = "#FF0000";
        gCtx.strokeRect(line.positionX - 5, line.positionY - height, width + 10, height + 3);
    }
}


function onSetStrokeColor(ev) {
    setStrokeColorToMeme(ev.target.value);
    renderCanvas();
}

function onSetFillColor(ev) {
    setFillColorToMeme(ev.target.value);
    renderCanvas();
}

function onSetSize(size) {
    setSizeToMeme(size);
    renderCanvas();
}

function onSetAlign(alignTo) {
    setAlignToMeme(alignTo);
    renderCanvas();
}

function onSetFont(ev) {
    setFontToMeme(ev.target.value);
    renderCanvas();
}

function onDeleteLine() {
    if (gSelected === 'sticker') {
        deleteSticker();
        gSelected === '';
    } else {
        deleteLine();
        document.querySelector('input[name=freeText]').value = '';
        gSelected === '';
    }

    renderCanvas();
}

function onSwitchtLine() {
    let currLine = getSelectedLine();
    let linesLen = getMeme().lines.length;
    if (currLine + 1 < linesLen) {
        setSelectedLine(currLine + 1);
    } else setSelectedLine(0);
    document.querySelector('input[name=freeText]').value = getTextFromMeme();
    renderCanvas();
}

function onMoveText(distance) {
    moveText(distance);
    renderCanvas();
}

function onAddLine() {
    createLine(gCanvas);
    onSwitchtLine();
}

function onOpenModal(memeId) {
    document.querySelector('.main-content').style.display = 'none';
    // document.querySelector('.meme-modal').style.display = 'block';
    document.querySelector('.meme-modal').hidden = false;
    document.querySelector('input[name=freeText]').value = '';
    resetMeme();

    setSelectedImgId(memeId);
    setInitialPositions(gCanvas);
    renderCanvas();
}

function onShowGallery() {
    document.querySelector('.main-content').style.display = 'unset';
    document.querySelector('.meme-modal').hidden = true;
    document.querySelector('.saved-memes').hidden = true;
}

function onDown(ev) {
    const pos = getEvPos(ev);
    const stickerIdx = findStickerIdx(pos);
    const lineIdx = findMemeLine(pos);

    if (stickerIdx >= 0) gDragging = 'sticker';
    if (lineIdx >= 0) gDragging = 'line';
    if (stickerIdx < 0 && lineIdx < 0) {
        gDragging = '';
        return;
    }
    gIsDragging = true;
    gStartPos = pos;
    document.body.style.cursor = 'grabbing';
}

function getEvPos(ev) {
    const pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    if (gTouchEvs.includes(ev.type)) {
        ev.preventDefault();
        ev = ev.changedTouches[0];
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop
        }
    }
    return pos;
}

function onMove(ev) {
    if (gIsDragging) {
        const pos = getEvPos(ev);
        const dx = pos.x - gStartPos.x;
        const dy = pos.y - gStartPos.y;
        if (gDragging === 'line') setMemePosition(dx, dy);
        else setStickerPosition(dx, dy);
        gStartPos = pos;
        renderCanvas();
    }
}

function onUp() {
    gIsDragging = false;
    gDragging = '';
    document.body.style.cursor = 'grab';
}

function onClick(ev) {
    const pos = getEvPos(ev);
    let lineIdx = findMemeLine(pos);
    let stickerIdx = findStickerIdx(pos);
    if (lineIdx >= 0) {
        gSelected = 'line';
        setSelectedLine(lineIdx);
        document.querySelector('input[name=freeText]').value = getTextFromMeme();
        renderCanvas();
    } else if (stickerIdx >= 0) {
        gSelected = 'sticker';
        setSelectedSticker(stickerIdx);
    } else gSelected = '';
}

function onDownloadImg() {
    setSelectedLine(-1);
    renderCanvas();
    setTimeout(() => {
        console.log('down');
        var link = document.createElement('a');
        link.download = 'my-img.jpg';
        link.href = document.getElementById('meme-canvas').toDataURL();
        link.click();
    }, 1);
}

function onSaveImg() {
    setSelectedLine(-1);
    renderCanvas();
    setTimeout(() => {
        const imgContent = gCanvas.toDataURL();
        saveMeme(imgContent);
    }, 1);
}

function onShowMemes() {
    document.querySelector('.main-content').style.display = 'none';
    document.querySelector('.saved-memes').hidden = false;
    document.querySelector('.meme-modal').hidden = true;
    renderSavedMemes();
}

function renderSavedMemes() {
    var savedMemes = getSavedMemes();
    var elContainer = document.querySelector('.saved-memes-gallery');
    if (savedMemes !== undefined && savedMemes !== null) {
        var imgHtml = savedMemes.map(meme => {
            return `
            <div class="card">
            <img class="meme-img" src="${meme}"></img>
            </div>
            `;
        });
        elContainer.innerHTML = imgHtml.join('');
    } else elContainer.innerHTML = `<div>No saved memes</div>`;
}

function onSearchMeme(ev) {
    setFilter(ev.target.value);
    renderImages();
}

function onClickKey(key) {
    setFilter(key);
    renderImages();
}

function onSetSticker(sticker) {
    setStickerOnMeme(sticker.src, gCanvas.width / 5);
    var img = new Image();
    img.src = sticker.src;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width / 5, gCanvas.height / 5);
    }
}

function renderSticker(sticker) {
    var img = new Image();
    img.src = sticker.src;
    img.onload = () => {
        gCtx.drawImage(img, sticker.positionX, sticker.positionY, gCanvas.width / 5, gCanvas.height / 5);
    }
}