/* global UMBRA, qrcodelib, PROJECT, LUNA */

var socket = io({
    query: {
        role: 'luna'
    }
});

$(function () {
    'use strict';
    var WT = window.screen.availWidth - 10, HT = window.screen.availHeight;
    var top_height = HT * LUNA.TOP_HEIGHT_RATIO;
    var bottom_height = HT * LUNA.BOTTOM_HEIGHT_RATIO;
    var SIDE = (WT / LUNA.COLUMN > (HT - top_height - bottom_height) / LUNA.ROW)
            ? (HT - top_height - bottom_height) / LUNA.ROW * LUNA.MOD(LUNA.ROW)
            - LUNA.CARD.BORDER_WIDTH * 2
            : WT * LUNA.MOD(LUNA.COLUMN) / LUNA.COLUMN - LUNA.CARD.BORDER_WIDTH * 2;
    $("#title_text").text(PROJECT.TITLE);
    $("#version_text").text('Ver. ' + PROJECT.VERSION);
    var font_size_top = parseInt((PROJECT.TITLE.length > WT / top_height) ?
            WT / top_height * LUNA.TITLE_RATIO : top_height * LUNA.TITLE_RATIO);
    var font_size_bottom = parseInt(bottom_height * LUNA.TITLE_RATIO);
    $(".box").css({
        width: WT,
        'font-family': LUNA.FONT
    });
    $(".box.top").css({
        height: top_height,
        'font-size': font_size_top + "px"
    });
    $(".box.bottom").css({
        height: bottom_height,
        'font-size': font_size_bottom + "px"
    });

    var cards = new Array(LUNA.ROW);
    var is_logo = LUNA.COLUMN * LUNA.ROW;
    for (var row = 0; row < LUNA.ROW; row++) {
        cards[row] = new Array(LUNA.COLUMN);
        var row_div = document.createElement("div");
        $(row_div).addClass("row");
        $("#display").append(row_div);
        for (var col = 0; col < LUNA.COLUMN; col++) {
            var id = row + "_" + col;
            cards[row][col] = new Card(id, null, null);
            var card_div = document.createElement("div");
            $(card_div).addClass("card viewport-flip left");
            $(card_div).attr("id", id);
            $(row_div).append(card_div);
        }
    }
    $(".card").css({
        width: SIDE,
        height: SIDE,
        border: LUNA.CARD.BORDER_WIDTH + "px " + LUNA.CARD.BORDER_STYLE + " " +
                LUNA.CARD.BORDER_COLOR[0]});
    $(".row").css({
        height: SIDE + LUNA.CARD.BORDER_WIDTH * 2,
        width: (SIDE + LUNA.CARD.BORDER_WIDTH * 2) * LUNA.COLUMN
    });
    // initialize cards
    create_card(PROJECT.LOGO_PATH, SIDE, LUNA.CARD.COLOR, (card_face) => {
        $(card_face).addClass("face front flip in");
        $(".card").append(card_face);
    });
    $(".face").css({width: SIDE, height: SIDE});

    $(".card").css({width: SIDE, height: SIDE}); //, border: LUNA.CARD.BORDER_WIDTH + "px solid #aaaaaa"

    var data_pool = new Map();
    var is_locked = 0;
    var deleted_keys = [];
    setInterval(() => {
        if (data_pool.size - deleted_keys.length > 0
                && is_locked < LUNA.COLUMN * LUNA.ROW) {
//            console.log('this way:' + data_pool.size + ', ' + deleted_keys.length);
            var key;
            do {
                key = Array.from(data_pool.keys())[parseInt(Math.random() * data_pool.size) - 1];
                if (key && data_pool.get(key).used) {
//                    console.log(key, data_pool.get(key).used);
                    data_pool.delete(key);
                    key = null;
                }
            } while (!key)
            var rec = data_pool.get(key);
            rec.used = true;
            deleted_keys.push(key);
            deal_card(rec.query_str, rec.img_path, rec.content);
        } else {
//            console.log('that way');
            if (deleted_keys.length > 0) {
                deleted_keys.forEach((key) => {
                    data_pool.delete(key);
                });
                console.log(deleted_keys.length + " dumped. data_pool size = "
                        + data_pool.size);
                deleted_keys = [];
            }
            deal_card('', PROJECT.LOGO_PATH, LUNA.QRCODE);
        }
    }, LUNA.SHOW_INTERVAL);

    socket.on("fire", (data) => {
        console.log('from ' + data.user);
        deal_card('', PROJECT.LOGO_PATH, LUNA.QRCODE);
    });

    socket.on("result", (data) => {
        var pri;
        var replaced = 0;
        for (var index = 0; index < data.record_set.length; index++) {
            var record = new LUNA.Record_Display(
                    data.query_str,
                    data.record_set[index].img_url,
                    data.record_set[index].content);
            if (data_pool.has(record.img_path))
                replaced++;
            if (index === 0)
                pri = record;
            else
                data_pool.set(record.img_path, record);
        }
        console.log("data_pool size = " + data_pool.size + "(" + replaced + ")");
        deal_card(pri.query_str, pri.img_path, pri.content);
    });

    function deal_card(query_str, img_path, content) {
        var card, row, col;
        do {
            row = parseInt(LUNA.ROW * Math.random());
            col = parseInt(LUNA.COLUMN * Math.random());
            card = cards[row][col];
//            console.log(row, col, cards.length, cards[row].length, card.is_logo, is_logo);
        } while (card.locked === true ||
                (is_logo > LUNA.MIN_LOGO && content !== LUNA.QRCODE && !card.is_logo));
        //當卡片不是logo，並且版面上的logo多於LUNA.MIN_LOGO
        if (img_path == PROJECT.LOGO_PATH || content == LUNA.QRCODE) {
            if (!card.is_logo) {
                is_logo++;
                card.is_logo = true;
            }
        } else {
            if (card.is_logo) {
                is_logo--;
                card.is_logo = false;
            }
        }
        card.locked = true;
        is_locked++;
        if (content === LUNA.QRCODE) {
            var canvas = document.createElement("canvas");
//            canvas.height = SIDE;
//            canvas.width = SIDE;
            qrcodelib.toCanvas(canvas, UMBRA.URL, function (err) {
                var canvas_adj = document.createElement("canvas");
                var ctx = canvas_adj.getContext('2d');
                var ratio = 1.5;
                canvas_adj.width = canvas.width * ratio;
                canvas_adj.height = canvas.height * ratio;
                ctx.fillStyle = LUNA.CARD.COLOR;
                ctx.fillRect(0, 0, canvas.width * ratio, canvas.height * ratio);
                ctx.drawImage(canvas, canvas.width * (ratio - 1) / 2, canvas.height * (ratio - 1) / 2);
                card.set_next(canvas_adj.toDataURL("image/png"));
                flip(card, SIDE, LUNA.CARD.COLOR, LUNA.CARD.BORDER_WIDTH,
                        LUNA.CARD.BORDER_STYLE, LUNA.CARD.BORDER_COLOR[1]);
            });
        } else {
            draw_text(SIDE, ((query_str) ? "[" + query_str + "] " : "")
                    + content,
                    LUNA.CARD.COLOR, (txt) => {
                card.set_next(txt);
                flip(card, SIDE, LUNA.CARD.COLOR, LUNA.CARD.BORDER_WIDTH,
                        LUNA.CARD.BORDER_STYLE, LUNA.CARD.BORDER_COLOR[1]);
            });
        }
        setTimeout(() => {
            card.set_next(img_path);
            flip(card, SIDE, LUNA.CARD.COLOR, LUNA.CARD.BORDER_WIDTH,
                    LUNA.CARD.BORDER_STYLE, LUNA.CARD.BORDER_COLOR[0]);
            setTimeout(() => {
                card.locked = false;
                is_locked--;
//                console.log((img_path == PROJECT.LOGO_PATH) ? 0 : LUNA.SHOW_STAY);
            }, (img_path == PROJECT.LOGO_PATH) ? 0 : LUNA.SHOW_STAY);
        }, LUNA.FLIP_TIME_OUT);
    }
});
