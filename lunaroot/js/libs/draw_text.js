function draw_text(size, text, color, callback) {
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    ctx.canvas.width = size;
    ctx.canvas.height = size;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, size, size);
    var font_size = parseInt(size / 10);
    ctx.font = font_size + 'px 標楷體';//serif 
    ctx.fillStyle = 'white';
    var margin = font_size * 0.8;
    var y = margin + font_size;
    var textArray = Array.from(text);
    var substr = '', substr_width = 0;
    for (i = 0; i < textArray.length; i++) {
        substr += textArray[i];
        substr_width = ctx.measureText(substr).width;
        if (substr_width > size - margin * 3 || i === text.length - 1) {
            ctx.fillText(substr, margin, y);
            substr = '';
            y += font_size * 1.2;
            if (y > size - margin)
                break;
        }
    }
    var img = new Image();
    img.src = canvas.toDataURL("image/png");
    img.onload = function () {
        callback(img.src);
    };
}