let offsetPos = 23;
let amp;
let freq;
let waveLength;

var mic, vol;


const RECT = {
    width: 400,
    height: 900,
    x: 100,
    x1: 0, //parce que c'est ce qui va changer
    x2: undefined,
    offsetx: 0,
    y: 0,
    selected: false,
}

const AMPS = [1, 1, 1, 1];
let SELECTED = -1;

let LOGO;
let IMAGES = {};

function preload() {
    LOGO = loadImage('./rsrc/logo-1.png');
    IMAGES.ezra = loadImage('./rsrc/ezra.jpg');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    // mic = new p5.AudioIn();

    // const micButton = createButton('Enable Microphone');
    // micButton.center();

    // micButton.mouseClicked(() => {
    //     getAudioContext().resume().then(() => {
    //         mic.start();
    //         micButton.hide();
    //         console.log('Recording Audio');
    //     }).catch((e) => {});
    // });

    RECT.x2 = RECT.x + RECT.width;
    RECT.x1 = RECT.x;

}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function drawRectLogo() {

    push();
    stroke(255, 0, 255);
    strokeWeight(10);
    noFill();
    translate(RECT.x, RECT.y);
    rect(0, 0, RECT.width, RECT.height);


    pop();
}

function mousePressed() {


    // RECT.x1 = RECT.x;
    // RECT.x2 = RECT.x + RECT.width;
    // let y1 = RECT.y;
    // let y2 = RECT.y + RECT.height;

    // RECT.offsetx = RECT.x - mouseX;

    // // let coteDroit = 
    // if (mouseX > RECT.x1 && mouseX < RECT.x2) {
    //     if (mouseY > y1 && mouseY < y2) {
    //         RECT.selected = true;
    //     }
    // }
}

function mouseReleased() {
    RECT.selected = false;
}

function mouseDragged() {

    if (RECT.selected) {
        RECT.x = mouseX + RECT.offsetx;
        RECT.x1 = RECT.x;
        RECT.x2 = RECT.x + RECT.width;
    }

    // RECT.x = mouseX;
}

function draw() {

    let onTop;

    if (!mouseIsPressed) {
        SELECTED = -1; //reset selection
    } else {
        offsetPos += (pmouseX - mouseX);
    }

    freq = map(offsetPos, 0, width, 0, 0.1);

    RECT.width = width;
    RECT.height = height;

    RECT.x = width / 2 - RECT.width / 2;
    RECT.y = height / 2 - RECT.height / 2;

    // var vol = mic.getLevel();
    background(255);
    noStroke();
    noFill();

    // drawRectLogo();





    // freq = 0.01;
    amp = map(200, 0, height, 100, 0);
    waveLength = width / (freq * width) * TWO_PI; //i dont know how i found that haha


    let offsetY = height / 5;

    let posY = offsetY;


    fill(255, 0, 0);
    onTop = mouseOnTop(mouseY, posY, offsetY);
    if (SELECTED === 0 || (onTop && SELECTED === -1)) {

        fill(220, 0, 0);
        SELECTED = 0;
    }

    sine_triangle(posY, amp + AMPS[0], amp + AMPS[1]);


    posY += offsetY;

    fill(255, 0, 255);
    onTop = mouseOnTop(mouseY, posY, offsetY);
    if (SELECTED === 1 || (onTop && SELECTED === -1)) {
        fill(220, 0, 220);
        SELECTED = 1;
    }


    triangle_square(posY, amp + AMPS[1], amp + AMPS[2]);

    posY += offsetY;

    fill(IMAGES.ezra);
    square_tooth(posY, amp + AMPS[2], amp + AMPS[3]);
    fill(0, 255, 255);

    onTop = mouseOnTop(mouseY, posY, offsetY);
    if (SELECTED === 2 || (onTop && SELECTED === -1)) {
        // blendMode(LIGHTEST);
        fill(0, 220, 220);
        SELECTED = 2;
    }

    
    square_tooth(posY, amp + AMPS[2], amp + AMPS[3]);
    blendMode(BLEND);

    // posY += offsetY;

    fill(255);

    onTop = mouseOnTop(mouseY, posY + offsetY, offsetY);

    if (SELECTED === 3 || (onTop && SELECTED === -1)) {
        fill(220)
        SELECTED = 3;
    }

    tooth(posY, amp + AMPS[3]);

    push();
    scale(0.2);
    blendMode(MULTIPLY);
    image(LOGO, 0, 0);
    blendMode(BLEND);
    pop();
}

function mouseOnTop(y, targY, offsetY) {

    return (y > targY && y < targY + offsetY);
}

function sine_triangle(posY, amp1, amp2) {
    beginShape();
    for (var x = RECT.x; x < RECT.x + RECT.width; x++) {
        /* const angle = x * freq;
        const y = sin(angle)*amp;
        vertex(x, y); */
        const y = amp1 * sin(TWO_PI / waveLength * x)
        vertex(x, y + posY);

    }

    for (var x = RECT.x + RECT.width; x > RECT.x; x--) {
        const y = 2 * amp2 / PI * asin(sin(TWO_PI / waveLength * x)) + height / 5
        vertex(x, y + posY);
    }

    endShape();
}

function mouseDragged() {
    if (SELECTED === -1)
        return;

    let vel = mouseY - pmouseY;

    AMPS[SELECTED] = AMPS[SELECTED] + vel;
}

function triangle_square(posY, amp1, amp2) {
    //TRIANGE + SAWTOOTH
    beginShape();
    for (var x = RECT.x; x < RECT.x + RECT.width; x++) {

        const y = 2 * amp1 / PI * asin(sin(TWO_PI / waveLength * x))
        vertex(x, y + posY);


    }

    for (var x = RECT.x + RECT.width; x > RECT.x; x--) {
        var nSegment = (x) / (waveLength / 2);
        var direction = Math.floor(nSegment) % 2;
        if (direction == 0) { y = amp2 + height / 5 } else {

            y = -amp2 + height / 5
        }

        vertex(x, y + posY);
    }

    endShape();
    //TRIANGE + SAWTOOTH

}

function square_tooth(posY, amp1, amp2) {


    //SQUARE + SAWTOOTH

    beginShape();
    for (var x = RECT.x; x < RECT.x + RECT.width; x++) {
        var nSegment = (x) / (waveLength / 2);
        var direction = Math.floor(nSegment) % 2;
        if (direction == 0) { y = amp1 } else {

            y = -amp1


        }

        vertex(x, y + posY);
    }


    for (var x = RECT.x + RECT.width; x > RECT.x; x--) {

        var nSegment = (x) / (waveLength / 2);
        var y = (((nSegment - Math.floor(nSegment))) * 2) * -amp2 + amp2 / 2;
        vertex(x, y + posY + height / 5);
    }

    endShape();
    // SQUARE + SAWTOOTH

}

function tooth(posY, amp) {

    beginShape();

    for (var x = RECT.x + RECT.width; x > RECT.x; x--) {
        var nSegment = (x) / (waveLength / 2);
        var y = (((nSegment - Math.floor(nSegment))) * 2) * -amp + amp / 2;
        vertex(x, y + posY + height / 5);
    }

    vertex(RECT.x, height);
    vertex(RECT.x + RECT.width, height);
    endShape();
}

function drawTooth(amp, freq, waveLength) {

}

function drawTriangle(amp, freq, waveLength) {

}

function drawSquare(amp, freq, waveLength) {

}

function drawSine(amp, freq) {

}