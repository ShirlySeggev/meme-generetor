'use strict';


var gCanvas;
var gCtx;
var gText = '';
var gStartPos;
var gIsDragging = false;
var gDragging;

function onInit() {
    createImages();
    renderImages();
    gCanvas = document.querySelector('#meme-canvas');
    gCtx = gCanvas.getContext('2d');
    setInitialPositions(gCanvas);
    addEventsListener();
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

function addEventsListener() {
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

    gCanvas.addEventListener('mousemove', onMove);
    gCanvas.addEventListener('mousedown', onDown);
    gCanvas.addEventListener('mouseup', onUp);
    gCanvas.addEventListener('click', onClick);
}

function onToggleMenu() {
    document.body.classList.toggle('menu-open');
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
    setTextToMeme(gText);
    renderCanvas();
}

function renderCanvas() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
    drawImg(getSelectedImgId());
    setTimeout(function() {
        var lines = getMeme().lines;
        lines.forEach((line, idx) => {
            drawText(line, idx);
        });
        var stickers = getMeme().stickers;
        stickers.forEach(sticker => {
            renderSticker(sticker);
        });
    }, 1);
}

function drawText(line, idx) {
    gCtx.beginPath();
    let currLine = getSelectedLine();
    if (currLine === idx) {
        let width = gCtx.measureText(line.txt).width;
        let height = line.size;
        gCtx.strokeStyle = "#FF0000";
        gCtx.strokeRect(line.positionX - 5, line.positionY - height, width + 10, height + 3);
    }
    gCtx.strokeStyle = line.strokeColor;
    gCtx.fillStyle = line.fillColor;
    gCtx.font = `${line.size}px ${line.font}`;
    gCtx.textAlign = line.align;
    gCtx.fillText(line.txt, line.positionX, line.positionY);
    gCtx.strokeText(line.txt, line.positionX, line.positionY);
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
    deleteMeme();
    gText = '';
    document.querySelector('input[name=freeText]').value = '';
    renderCanvas();
}

function onSwitchtLine() {
    let currLine = getSelectedLine();
    let linesLen = getMeme().lines.length;
    if (currLine + 1 < linesLen) {
        setSelectedLine(currLine + 1);
    } else setSelectedLine(0);
    gText = getTextFromMeme();
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
    gText = '';
    document.querySelector('input[name=freeText]').value = '';
    document.querySelector('.main-content').hidden = true;
    document.querySelector('.meme-modal').hidden = false;
    document.querySelector('.main-footer').style.bottom = '0';
    setSelectedImgId(memeId);
    drawImg(getSelectedImgId());
}

function onShowGallery() {
    document.querySelector('.meme-modal').hidden = true;
    document.querySelector('.main-content').hidden = false;
    document.querySelector('.saved-memes').hidden = true;
    document.querySelector('.main-footer').style.bottom = '';
}

function onDown(ev) {
    const pos = getEvPos(ev);
    const sticker = findStickerPosition(pos);
    const line = findMemeLine(pos);

    if (sticker !== undefined) gDragging = 'sticker';
    if (line >= 0) gDragging = 'line';
    if (sticker === undefined && line < 0) {
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
    return pos;
}

function onMove(ev) {
    if (gIsDragging) {
        const pos = getEvPos(ev);
        const dx = pos.x - gStartPos.x;
        const dy = pos.y - gStartPos.y;
        if (gDragging === 'line') setMemePosition(dx, dy);
        else setStickerPosition(dx, dy, findStickerPosition(pos));
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
    let currLine = findMemeLine(pos);
    if (currLine >= 0) {
        setSelectedLine(currLine);
        gText = getTextFromMeme();
        document.querySelector('input[name=freeText]').value = getTextFromMeme();
        renderCanvas();
    }
}

function onDownloadImg(elLink) {
    // setSelectedLine(-1);
    // renderCanvas();

    const imgContent = gCanvas.toDataURL();
    elLink.href = imgContent;
}

function onSaveImg(elLink) {
    const imgContent = gCanvas.toDataURL();
    saveMeme(imgContent);
}

function onShowMemes() {
    document.querySelector('.saved-memes').hidden = false;
    document.querySelector('.main-content').hidden = true;
    document.querySelector('.meme-modal').hidden = true;
    document.querySelector('.main-footer').style.bottom = '0';
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