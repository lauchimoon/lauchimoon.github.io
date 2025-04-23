let buttonEnc = document.getElementById('buttonEnc');
let buttonDec = document.getElementById('buttonDec');
let buttonGo = document.getElementById('buttonGo');
let inputBox = document.getElementById('inputBox');
let outputBox = document.getElementById('outputBox');

let alphabet = {};
generateAlphabet();

buttonEnc.addEventListener("click", encode);
buttonDec.addEventListener("click", decode);

function zeroPad(string, len) {
    var pad = "0".repeat(len);
    return (pad+string).slice(-pad.length);
}

function generateAlphabet() {
    chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
    for (let i = 0; i < chars.length; i++) {
        chr = chars[i];
        iBin = zeroPad(i.toString(2), 6);
        alphabet[iBin] = chr;
    }

    alphabet['0'] = '=';
}

function encode() {
    let text = inputBox.value;
    if (text === "")
        return;

    let binString = getBinStringEnc(text);
    let chunks = get6BitChunks(binString);
    let textEncoded = "";

    for (let i = 0; i < chunks.length; i++)
        textEncoded += alphabet[chunks[i]];

    let outputText = outputBox.getElementsByClassName('outputText')[0];
    outputText.textContent = textEncoded;
}

function getBinStringEnc(text) {
    let binString = "";

    for (let i = 0; i < text.length; i++) {
        let ascii = text[i].charCodeAt(0);
        let bin = zeroPad(ascii.toString(2), 8);
        binString += bin;
    }

    return binString;
}

function get6BitChunks(binString) {
    let chunks = [];

    for (let i = 0; i < binString.length; i += 6)
        chunks.push(binString.slice(i, i + 6));

    // Add zeroes
    for (let i = 0; i < chunks.length; i++) {
        let lenChunk = chunks[i].length;
        if (lenChunk != 6) {
            let missingZeros = 6 - lenChunk;
            chunks[i] += '0'.repeat(missingZeros);
        }
    }

    // Padding
    if (binString.length % 24 != 0) {
        let missingPaddings = 4 - chunks.length % 4;
        for (let i = 0; i < missingPaddings; i++)
            chunks.push('0');
    }

    return chunks;
}

function decode() {
    text = inputBox.value;
    if (text === "")
        return;

    let binString = getBinStringDec(text);
    let textDecoded = "";

    for (let i = 0; i < binString.length; i += 8) {
        let chunk = binString.slice(i, i + 8);
        let chr = String.fromCharCode(parseInt(chunk, 2));
        textDecoded += chr;
    }

    let outputText = outputBox.getElementsByClassName('outputText')[0];
    outputText.textContent = textDecoded;
}

function getBinStringDec(text) {
    let binString = "";
    for (let i = 0; i < text.length; i++) {
        let chr = text[i];
        if (chr != '=')
            binString += getKey(chr);
    }

    return binString;
}

function getKey(chr) {
    for (key in alphabet) {
        let value = alphabet[key];
        if (chr === value)
            return key;
    }

    return null;
}
