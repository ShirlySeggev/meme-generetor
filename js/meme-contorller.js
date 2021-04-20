'use strict';


var gCanvas;
var gCtx;
var gText = '';

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
        console.log(lines);
    }, 1);
    console.log(gMeme);
}

function drawText(line) {
    console.log('line', line);
    gCtx.strokeStyle = line.strokeColor;
    gCtx.fillStyle = line.fillColor;
    gCtx.font = `${line.size}px Impact`;
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

function onDeleteLine() {
    deleteMeme();
    gText = '';
    document.querySelector('input[name=freeText]').value = '';
    renderCanvas();
}

// function onClearCanvas() {
//     gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
//     drawImg(getSelectedImgId());
//     setTextToMeme(getSelectedLine(), '');
//     gText = '';
//     document.querySelector('input[name=freeText]').value = '';
// }

function onSwitchtLine() {
    let line = getSelectedLine();
    let linesLen = getMeme().lines.length;
    if (line + 1 < linesLen) {
        setSelectedLine(line + 1);
    } else setSelectedLine(0);
    gText = getTextFromMeme();
    document.querySelector('input[name=freeText]').value = getTextFromMeme();
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
    // document.body.classList.toggle('modal-open');
    document.querySelector('.main-content').hidden = true;
    document.querySelector('.meme-modal').hidden = false;
    document.querySelector('.main-footer').style.bottom = '0';
    setSelectedImgId(memeId);
    drawImg(getSelectedImgId());
}

function onCloseModal() {
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