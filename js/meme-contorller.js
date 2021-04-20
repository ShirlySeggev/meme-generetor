'use strict';


var gCanvas;
var gCtx;
var gText = '';
var gStartPos;
var gIsDragging = false;
// const gTouchEvs = ['touchstart', 'touchmove', 'touchend'];

function onInit() {
    createImages();
    renderImages();
    gCanvas = document.querySelector('#meme-canvas');
    gCtx = gCanvas.getContext('2d');
    setInitialPositions(gCanvas);
    addEventsListener();
}

function renderImages() {
    var images = getImages();
    var imgHtml = images.map(function(image) {
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

    // window.addEventListener('resize', onResizeCanvas);
    gCanvas.addEventListener('mousemove', onMove);
    gCanvas.addEventListener('mousedown', onDown);
    gCanvas.addEventListener('mouseup', onUp);
    gCanvas.addEventListener('click', onClick);

    var elFont = document.querySelector('select[name=font]');
    elFont.addEventListener('change', onSetFont);
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
        lines.forEach(line => {
            drawText(line);
        });
    }, 1);
}

function drawText(line) {
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
    let line = getSelectedLine();
    let linesLen = getMeme().lines.length;
    if (line + 1 < linesLen) {
        setSelectedLine(line + 1);
    } else setSelectedLine(0);
    gText = getTextFromMeme();
    document.querySelector('input[name=freeText]').value = getTextFromMeme();
    // gCtx.strokeRect(pos.x, pos.y, 150, 100);
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
    document.querySelector('.main-content').hidden = true;
    document.querySelector('.meme-modal').hidden = false;
    document.querySelector('.main-footer').style.bottom = '0';
    setSelectedImgId(memeId);
    drawImg(getSelectedImgId());
}

function onShowGallery() {
    document.querySelector('.meme-modal').hidden = true;
    document.querySelector('.main-content').hidden = false;
    document.querySelector('.main-footer').style.bottom = '';
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

function onDown(ev) {
    const pos = getEvPos(ev)
    if (!isTextClicked(pos)) return;
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

function isTextClicked(clickedPos) {
    const pos = getMemePosition();
    const distance = Math.sqrt((pos.x - clickedPos.x) ** 2 + (pos.y - clickedPos.y) ** 2);
    return distance <= 50;
}

function onMove(ev) {
    if (gIsDragging) {
        const pos = getEvPos(ev)
        const dx = pos.x - gStartPos.x
        const dy = pos.y - gStartPos.y
        setMemePosition(dx, dy);
        gStartPos = pos;
        renderCanvas();
    }
}

function onUp() {
    gIsDragging = false;
    document.body.style.cursor = 'grab';
}

function onClick(ev) {
    const pos = getEvPos(ev);
    if (!isTextClicked(pos)) return;
    gCtx.lineTo(pos.x, pos.y);
    // markLine(pos);
}

function markLine(pos) {
    gCtx.beginPath()
    gCtx.lineWidth = 2
    gCtx.moveTo(pos.x, pos.y)
    gCtx.lineTo(pos.x + 50, pos.y)
    gCtx.closePath()
    gCtx.strokeStyle = 'red';
    gCtx.stroke()
}

function onSaveImg(elLink) {
    const imgContent = gCanvas.toDataURL();
    saveMeme(imgContent);
}

function onShowMemes() {
    document.querySelector('.saved-memes').hidden = false;
    document.querySelector('.main-content').hidden = true;
    document.querySelector('.main-footer').style.bottom = '0';
    renderSavedMemes();
}

function renderSavedMemes() {
    var canvas = document.querySelector('#saved-meme-canvas');
    var ctx = canvas.getContext('2d');

    var img = new Image;
    img.src = getSavedMemes();
    img.onload = () => {
        ctx.drawImage(img, 0, 0);
    };

}

function onToggleMenu() {
    document.body.classList.toggle('menu-open');
}