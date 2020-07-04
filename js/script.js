var canvas = document.getElementById("mainCanvas");
var ctx =  canvas.getContext("2d");
var init_x = 20
var init_y = 20

time_icon_url = 'https://wiki.factorio.com/images/Time.png'

function build() {
    var inputs = parseInt(document.getElementById("inputs").value)
    var outputs = parseInt(document.getElementById("outputs").value)
    var add_time = document.getElementById("add_time").checked 
    console.log("inputs=%d outputs=%d add_time=%s", inputs, outputs, add_time)

    drawElemets(inputs)
    drawText('🡆')
    drawElemets(outputs)

    init_x = 20
    init_y += 60
}

function drawElemets(num) {
    for (i = 0; i < num; i++) {
        drawRect(init_x, init_y)
        
        if (i < num - 1) {
            init_x += 60
            drawText('🞧')
        }
        else {
            init_x += 60
        }
    }
}

function draw_new_rect() {
    drawRect(init_x, init_y)
    init_x += 60
}

function draw_new_sign() {
    init_x += 25
    drawSign(init_x, init_y)
    init_x += 60
}

function drawRect(x, y) {
    ctx.beginPath();
    ctx.rect(x, y, 50, 50);
    ctx.stroke();
}

function drawSign(x, y) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 25, y + 25);
    ctx.lineTo(x , y + 50);
    ctx.lineTo(x, y);
    ctx.stroke();
}

function drawText(str) {
    ctx.font = "30px Arial";
    ctx.fillText(str, init_x, init_y + 35);
    init_x += 35
}
