
CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
    return this;
};
var weight = [161, 180, 199, 218, 162, 205, 181, 200, 219, 163, 182, 220, 201, 177, 196, 215, 170, 178, 221, 197, 216, 171, 179, 198, 172, 217, 193, 212, 167, 186, 194, 173, 213, 168, 187, 195, 214, 188, 169, 209, 164, 183, 202, 210, 189, 165, 184, 203, 211, 166, 204, 185];
var round = 0;

function getResult() {
    round = 0;
    runLoop(true);
}

function runLoop(clear = false) {
    var parent = $("div#placeholder1");
    if (clear) {
        $(parent).empty();
    }
    for (var a = 0; a < 5; a++) {
        drawCard(parent);
        round++;
    }
}

function drawCard(parent) {
    var serverSeed = $("input#serverSeed").val();
    var clientSeed = $("input#clientSeed").val();
    var nonce = $("input#nonce").val();
    var descriptionFontSize = 14;
    var descriptionFontColor = "#999";
    var fontSize = 16;
    var lineHeight = 24;
    var rightSide = 120;
    var canvasWidth = 900;
    var canvasHeight = 420;
    var ctx = createCanvas($(parent), canvasWidth, canvasHeight, "#f8f8f8", true);
    ctx.font = descriptionFontSize + "px sans-serif";
    ctx.fillStyle = descriptionFontColor;
    var x = 10;
    drawWrapText(ctx, "Use SHA256 to calculate the hash value after combining Server Seed, Client Seed, Nonce and Round.  Sha256(Server_Seed:Client_Seed:Nonce:Round)", x, canvasWidth, lineHeight * 3, null, "  ");
    drawWrapText(ctx, "Take out the first 8 characters of the hash, and divide every 2 characters", x, 150, lineHeight * 6);
    drawWrapText(ctx, "Convert  hexadecimal  to decimal", 160, 250, lineHeight * 7.6, null, "  ");
    drawWrapText(ctx, "Separate calculation", 290, canvasWidth, lineHeight * 8.8);
    drawWrapText(ctx, "Add up the result,  multiply it by 52,  and round to an integer", 510, 630, lineHeight * 7.6, null, "  ");

    ctx.font = "bold 24px sans-serif";
    ctx.fillStyle = "#000";
    var hash = sha256(serverSeed + ":" + clientSeed + ":" + nonce + ":" + round);
    var firstEightChar = hash.substr(0, 8);
    drawWrapText(ctx, "Card " + (round + 1), x, canvasWidth, lineHeight * 1);
    ctx.font = fontSize + "px sans-serif";
    drawWrapText(ctx, "Round = " + round, x, canvasWidth, lineHeight * 2);
    drawWrapText(ctx, "Hash = " + hash, x, canvasWidth, lineHeight * 4.5);
    drawWrapText(ctx, firstEightChar, x, canvasWidth, lineHeight * 9);
    var txtSize = ctx.measureText(firstEightChar);
    var group = [];
    var sum = 0;
    for (var a = 0, b = 0; a < 4; a++, b += 2) {
        var _x = x + 100;
        group[a] = hash.substr(b, 2);
        var _y = lineHeight * (10 + a);
        drawWrapText(ctx, group[a], _x, canvasWidth, _y);
        group[a] = parseInt(group[a], 16);
        drawWrapText(ctx, group[a].toString(), _x += 30, 230, _y, "center");
        var num = group[a] / Math.pow(256, a + 1);
        sum += num;
        drawWrapText(ctx, group[a].toString() + " / 256 ^ " + (a + 1) + " = " + parseFloat((num).toPrecision(10)).toFixed(10), _x += 20, _x + 290, _y, "right");
        var dist = txtSize.width / 4;
        var startX = x + dist * 0.5 + (dist * a);
        var startY = lineHeight * 9.3;
        ctx.strokeStyle = "#999";
        ctx.lineCap = 'round';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        var endX = x + 95;
        var endY = _y - 5;
        ctx.quadraticCurveTo(Math.min(startX, endX), Math.max(startY, endY), endX, endY);
        ctx.moveTo(endX += 30, endY);
        ctx.lineTo(endX += 30, endY);
        ctx.moveTo(endX += 40, endY);
        ctx.lineTo(endX += 25, endY);
        startX = endX + 230;
        startY = endY;
        endX = startX + 30;
        endY = 235;
        ctx.moveTo(startX, startY);
        ctx.bezierCurveTo(startX + (endX - startX) / 2, startY, startX + (endX - startX) / 2, endY, endX, endY);
        ctx.stroke();
    }
    drawWrapText(ctx, "sum = " + parseFloat((sum).toPrecision(10)).toFixed(10), 500, 670, lineHeight * 10, "center");
    drawWrapText(ctx, "x 52 = " + parseFloat((sum *= 52).toPrecision(10)).toFixed(10), 500, 670, lineHeight * 11, "center");
    drawWrapText(ctx, "rounding = " + Math.floor(sum), 500, 670, lineHeight * 12, "center");
    ctx.fillStyle = "#fff";
    ctx.roundRect(680, 20, 200, 300, 15).fill();
    ctx.fillStyle = "#999";
    ctx.roundRect(680, 20, 200, 300, 15).stroke();
    var pattern = getPattern(Math.floor(sum));
    ctx.font = "bold 35px sans-serif";
    ctx.fillStyle = pattern.color;
    drawWrapText(ctx, pattern.num, 688, 715, 60, "center");
    var img = new Image();
    $(img).data("ctx", ctx);
    img.onload = function() {
        $(this).data("ctx").drawImage(this, 690, 70, 20, 20);
    };
    img.src = pattern.url;
    var img2 = new Image();
    $(img2).data("ctx", ctx);
    $(img2).data("width", pattern.width);
    $(img2).data("height", pattern.height);
    $(img2).data("centerX", 780);
    $(img2).data("centerY", 170);
    img2.onload = function() {
        var w = $(this).data("width");
        var h = $(this).data("height");
        var cx = $(this).data("centerX");
        var cy = $(this).data("centerY");
        var scale = 1;
        if (w / h > this.width / this.height) {
            scale = h / this.height;
        } else {
            scale = w / this.width;
        }
        this.width *= scale;
        this.height *= scale;
        $(this).data("ctx").drawImage(this, cx - this.width / 2, cy - this.height / 2, this.width, this.height);
        // $(this).data("ctx").strokeStyle = "#000";
        // $(this).data("ctx").strokeRect(cx - w / 2, cy - h / 2, w, h);
    };
    img2.src = pattern.bigUrl;
    for (var a = 0; a < weight.length; a++) {
        var cellWidth = canvasWidth / weight.length;
        ctx.strokeStyle = "#999";
        ctx.lineCap = 'round';
        ctx.lineWidth = 1;
        var _x = cellWidth * a;
        if (a == Math.floor(sum)) {
            var startX = 626;
            var startY = 293;
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            var endX = _x + cellWidth * 0.5;
            var endY = 360;
            ctx.bezierCurveTo(startX, startY + (endY - startY) + 20, endX, endY - 40, endX, endY);
            ctx.stroke();
            ctx.fillStyle = "#fff";
            ctx.fillRect(_x, 360, cellWidth, canvasHeight - 360);
            ctx.strokeRect(_x, 360, cellWidth, canvasHeight - 365);
        }

        ctx.font = "11px sans-serif";
        ctx.fillStyle = descriptionFontColor;
        drawWrapText(ctx, a.toString(), _x, _x + cellWidth, lineHeight * 15.5, "center");
        var pattern = getPattern(a);
        ctx.fillStyle = pattern.color;
        ctx.font = "20px sans-serif";
        drawWrapText(ctx, pattern.pattern, _x, _x + cellWidth, lineHeight * 16.3, "center");
        ctx.font = "bold 12px sans-serif";
        drawWrapText(ctx, pattern.num.toString(), _x, _x + cellWidth, lineHeight * 16.9, "center");
        // ctx.strokeStyle = "#ddd";
        // ctx.beginPath();
        // ctx.moveTo(_x, 360);
        // ctx.lineTo(_x, canvasHeight);
        // ctx.stroke();
    }
}

function getPattern(index) {
    var color = "#000";
    var url, bigUrl, width = 100,
        height = 100;
    var result = weight[index];
    var pattern = result & 0xf0;
    if (pattern == 160) {
        pattern = "♠️";
        url = bigUrl = "images/spades.svg";
    } else if (pattern == 176) {
        pattern = "♥️";
        url = bigUrl = "images/hearts.svg";
        color = "#f00";
    } else if (pattern == 192) {
        pattern = "♣️";
        url = bigUrl = "images/clubs.svg";
    } else if (pattern == 208) {
        pattern = "♦️";
        url = bigUrl = "images/diamonds.svg";
        color = "#f00";
    }
    var num = result & 0x0f;
    if (num == 1) {
        num = "A";
    } else if (num == 11) {
        width = 160;
        height = 230;
        num = "J";
        if (url == "images/spades.svg" || url == "images/clubs.svg") {
            bigUrl = "images/j_black.svg";
        } else {
            bigUrl = "images/j_red.svg";
        }
    } else if (num == 12) {
        width = 160;
        height = 230;
        num = "Q";
        if (url == "images/spades.svg" || url == "images/clubs.svg") {
            bigUrl = "images/q_black.svg";
        } else {
            bigUrl = "images/q_red.svg";
        }
    } else if (num == 13) {
        width = 160;
        height = 230;
        num = "K";
        if (url == "images/spades.svg" || url == "images/clubs.svg") {
            bigUrl = "images/k_black.svg";
        } else {
            bigUrl = "images/k_red.svg";
        }
    } else {
        num = num.toString();
    }
    return { "pattern": pattern, "num": num, "color": color, "url": url, "bigUrl": bigUrl, "width": width, "height": height };
}

function drawWrapText(ctx, str, left, right, top, align = "left", cutter = " ") {
    var lines = getLines(ctx, str, right - left, cutter);
    var height = parseInt(ctx.font.match(/\d+/), 10);
    for (var a = 0; a < lines.length; a++) {
        var txtSize = ctx.measureText(lines[a]);
        var x = left;
        if (align == "right") {
            x = right - txtSize.width;
        } else if (align == "center") {
            x = left + (right - left - txtSize.width) / 2;
        }
        ctx.fillText(lines[a], x, top + height * a);
    }
}

function createCanvas(parent, width, height, color, visiable) {
    var canvas = document.createElement('canvas');
    if (!visiable) {
        $(canvas).hide();
    }
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
    ctx.translate(0.5, 0.5);
    $(parent).append(canvas);
    return ctx;
}

function getLines(ctx, text, maxWidth, cutter = " ") {
    var words = text.split(cutter);
    var lines = [];
    var currentLine = words[0];
    for (var i = 1; i < words.length; i++) {
        var word = words[i];
        var width = ctx.measureText(currentLine + cutter + word).width;
        if (width < maxWidth) {
            currentLine += cutter + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}