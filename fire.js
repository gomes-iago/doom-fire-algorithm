const firePixelsArray = [];
const fireColorsPalette = [{"r":7,"g":7,"b":7},{"r":31,"g":7,"b":7},{"r":47,"g":15,"b":7},{"r":71,"g":15,"b":7},{"r":87,"g":23,"b":7},{"r":103,"g":31,"b":7},{"r":119,"g":31,"b":7},{"r":143,"g":39,"b":7},{"r":159,"g":47,"b":7},{"r":175,"g":63,"b":7},{"r":191,"g":71,"b":7},{"r":199,"g":71,"b":7},{"r":223,"g":79,"b":7},{"r":223,"g":87,"b":7},{"r":223,"g":87,"b":7},{"r":215,"g":95,"b":7},{"r":215,"g":95,"b":7},{"r":215,"g":103,"b":15},{"r":207,"g":111,"b":15},{"r":207,"g":119,"b":15},{"r":207,"g":127,"b":15},{"r":207,"g":135,"b":23},{"r":199,"g":135,"b":23},{"r":199,"g":143,"b":23},{"r":199,"g":151,"b":31},{"r":191,"g":159,"b":31},{"r":191,"g":159,"b":31},{"r":191,"g":167,"b":39},{"r":191,"g":167,"b":39},{"r":191,"g":175,"b":47},{"r":183,"g":175,"b":47},{"r":183,"g":183,"b":47},{"r":183,"g":183,"b":55},{"r":207,"g":207,"b":111},{"r":223,"g":223,"b":159},{"r":239,"g":239,"b":199},{"r":255,"g":255,"b":255}]
const fireVelocityList = [12.5, 25, 50, 75, 100]
let debug = false
let fireWidth = 40;
let fireHeight = 40;
let windDirection = ''
let fireIntensity = 3
let fireVelocity = 2

function start() {
    createColorPalette();
    createFireDataStructure();
    createFireSource();
    renderFire();

    setTimeout(calculateFirePropagation, fireVelocityList[fireVelocity]);
};

function createFireDataStructure() {
    const numberOfPixels = fireWidth * fireHeight

    for (let i = 0; i < numberOfPixels; i++) {
        firePixelsArray[i] =  0
    }
};

function calculateFirePropagation() {
    for (let column = 0; column < fireWidth; column++) {
        for (let row = 0; row < fireHeight; row++) {
            const pixelIndex = column + (fireWidth * row);

            updateFireIntensityPerPixel(pixelIndex);
        }
    }

    renderFire();
    setTimeout(calculateFirePropagation, fireVelocityList[fireVelocity]);
};

function updateFireIntensityPerPixel(currentPixelIndex) {
    const belowPixelIndex = currentPixelIndex + fireWidth;

    if (belowPixelIndex >= fireWidth * fireHeight) {
        return;
    };

    const decay = Math.floor(Math.random() * fireIntensity);
    const belowPixelFireIntensity = firePixelsArray[belowPixelIndex];
    const newFireIntensity =
        belowPixelFireIntensity - decay >= 0 ? belowPixelFireIntensity - decay : 0;

    if (windDirection === 'right') currentPixelIndex += decay
    else if (windDirection === 'left') currentPixelIndex -= decay
    firePixelsArray[currentPixelIndex] = newFireIntensity;
}

function renderFire() {
    let html = '<table ellpadding=0 cellspacing=0>';

    for (let row = 0; row < fireHeight; row++) {
        html += '<tr>';

        for (let column = 0; column < fireWidth; column++) {
            const pixelIndex = column + (fireWidth * row);
            const fireIntensity = firePixelsArray[pixelIndex];
            const color = fireColorsPalette[fireIntensity];
            const colorString = `${color.r},${color.g},${color.b}`;

            if (debug) {
                html += '<td class="debug-mode">';
                html += `<div class='pixel-index'>${pixelIndex}</div>`;
                html += `<p style="color: rgb(${colorString})">${fireIntensity}</p>`
                html += '';
                html += '</td>';
            } else {
                html += `<td class="pixel" style="background-color: rgb(${colorString})">`;
                html += '</td>';
            }

        }

        html += '</tr>';
    }

    html += '</table>';

    document.querySelector('#fire-canvas').innerHTML = html;
};

function createFireSource() {
    for (let column = 0; column < fireWidth; column++) {
        const overFlowPixelIndex = fireWidth * fireHeight
        const pixelIndex = (overFlowPixelIndex - fireWidth) + column

        firePixelsArray[pixelIndex] = 36;
    }
}

function setWindDirection(direction) {
    windDirection = direction
}

function setFireIntensity(intensity) {
    if (intensity === 'subtract') {
        if (fireIntensity < 20) fireIntensity++
    } else if (intensity === 'add') {
        if (fireIntensity > 3) fireIntensity--
    } else fireIntensity = intensity
}

function toggleDebugMode() {
    debug =!debug;
}

function createColorPalette() {
    let html = '<div class="color-palette-container">'

    for(i = 0; i < fireColorsPalette.length; i++) {
        html += `<div class="color-palette-pixel" style="background-color:rgb(${fireColorsPalette[i].r},${fireColorsPalette[i].g},${fireColorsPalette[i].b})"></div>`
    }

    html += '</div>'

    document.querySelector("#color-palette").innerHTML = html
}

function updateFireVelocity(velocity) {
    if (velocity === "subtract") {
        fireVelocity >= 0 && fireVelocity < 4 ? fireVelocity++ : fireVelocity
    } else if (velocity === "add") {
        fireVelocity > 0 ? fireVelocity-- : fireVelocity
    } else if (velocity === 'min') {
        fireVelocity = 4;
    } else if (velocity === 'max') {
        fireVelocity = 0;
    } else {
        fireVelocity = fireVelocity
    };
}

function applyGrayscale() {
    const grayscaleValue = document.querySelector("#grayscale-input").value
    const fireCanvas = document.querySelector("#fire-canvas")

    fireCanvas.style.filter = `grayscale(${grayscaleValue/10})`;
}

start();