/**
 * 
 * @param {string} img_path Path to the image to be included.
 * @param {int} side Lenth of the card border.
 * @param {string} bg_color Background color.
 * @param {function(card)} callback function to process the card.
 * @returns {undefined}
 */
function create_card(img_path, side, bg_color, callback) {
    var img = new Image();
    img.crossOrigin = "anonymous";
    img.src = img_path;

    var card_face = document.createElement("div");
    $(card_face).css({
        width: side,
        height: side,
        'background-color': bg_color
    }).addClass("face");

    img.onload = function () {
        var max = (img.width > img.height) ?
                img.width * side / img.height :
                img.height * side / img.width;
        window.EXIF.getData(img, function () {
//            var orientation = window.EXIF.getTag(this, "Orientation");
            var img_transformed = window.loadImage.scale(img, {
//                orientation: orientation || 0, 
                canvas: false,
                maxWidth: max, maxHeight: max
            });
            $(img_transformed).addClass('img');
            $(card_face).append(img_transformed);
            callback(card_face);
        });
    };
}

var create_block = function (width, height, color, callback) {
    var block_canvas = document.createElement("canvas");
    block_canvas.width = width;
    block_canvas.height = height;
    var ctx = block_canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
    var block = new Image();
    block.src = block_canvas.toDataURL("image/png");
    block.onload = function () {
        var div = wrap_div(block);
        callback(div);
    };
};