'use strict';


function makeRandKey() {
    var key = ['happy', 'funny', 'politics', 'tv'];

    var randIdx = getRandomIntInclusive(0, key.length - 1);
    return key[randIdx];
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}