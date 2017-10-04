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
    $(card_face).css({width: side, height: side}).addClass("card");

    var card_part = 5;
    function mark_finished(minus, msg) {
        card_part -= minus;
//        console.log("card_part = " + card_part + ", " + msg);
        if (card_part === 0) {
//            console.log("card finished.");
            callback(card_face);
        }
    }

    img.onload = function () {

        window.EXIF.getData(img, function () {
            var orientation = window.EXIF.getTag(this, "Orientation");
            var img_transformed = window.loadImage.scale(img, {
                orientation: orientation || 0, canvas: true,
                maxWidth: side, maxHeight: side});
            var img_loaded = new Image();
            img_loaded.src = img_transformed.toDataURL("image/png");

            img_loaded.onload = function () {
//                console.log('orientation: ' + orientation);
                var img_wrapper = wrap_div(img_loaded);
                $(img_wrapper).addClass("left card_image");
                var middle = document.createElement("div");
                $(middle).addClass("card_middle");
                $(middle).css({
                    width: side,
                    height: img_transformed.height
                });
                $(middle).append(img_wrapper);
                mark_finished(1, "card image added.");

                var top_block, bottom_block;
                var top_margin = (side - img_transformed.height) / 2;
                var bottom_margin = side - top_margin - img_transformed.height;
                if (top_margin > 1) {
                    create_block(side, top_margin, bg_color, function (block) {
                        top_block = block;
                        $(top_block).addClass("top_block");
                        $(card_face).prepend(top_block).append(middle);
                        mark_finished(1, "top block finished.");

                        create_block(side, bottom_margin, bg_color, function (block) {
                            bottom_block = block;
                            $(bottom_block).addClass("bottom_block");
                            $(card_face).append(bottom_block);
                            mark_finished(1, "bottom block finished.");
                        });
                    });
                } else {
                    $(card_face).append(middle);
                    mark_finished(2, "top and bottom blocks skipped.");
                }

                var left_margin = (side - img_transformed.width) / 2;
                if (left_margin > 1) {
                    var right_margin = side - left_margin - img_transformed.width;
                    var left_block, right_block;
                    create_block(left_margin, img_transformed.height, bg_color, function (block) {
                        left_block = block;
                        $(left_block).addClass("left_block left");
                        $(middle).prepend(left_block);
                        mark_finished(1, "left block finished.");
                    });
                    create_block(right_margin, img_transformed.height, bg_color, function (block) {
                        right_block = block;
                        $(right_block).addClass("right_block left");
                        $(middle).append(right_block);
                        mark_finished(1, "right block finished.");
                    });
                } else {
                    mark_finished(2, "left and right blocks skipped.");
                }

            };
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