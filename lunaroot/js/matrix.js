/* global TXT_POOL, COLUMN, ROW, CARD_BORDER, BORDER_STYLE, COLOR, FLIP_TIME_OUT, LOGO_PATH, UMBRA_URL, QRCODE_TOKEN, qrcodelib, PROJECT_TITLE, PROJECT_TITLE_SHORT, TITLE_RATIO, TOP_HEIGHT_RATIO, SHOW_INTERVAL, SHOW_STAY */
'use strict';

function Record_Display(str, img, txt) {
    this.query_str = str;
    this.img_path = img;
    this.content = txt;
    this.used = false;
}
var cards, is_logo;
var data_pool = new Map();
var is_locked = 0;

var socket = io({
    query: {
        role: 'luna'
    }
});

$(function () {
    const WT = window.screen.availWidth - 10, HT = window.screen.availHeight;
    var top_height = HT * TOP_HEIGHT_RATIO;
    const SIDE = (WT / COLUMN > (HT - top_height) / ROW) ?
            (HT - top_height) / ROW * MOD(ROW) - CARD_BORDER * 2 :
            WT * MOD(COLUMN) / COLUMN - CARD_BORDER * 2;
    $(".top-box").find("#text").text(PROJECT_TITLE);
    var font_size = parseInt((PROJECT_TITLE.length > WT / top_height) ?
            WT / top_height * TITLE_RATIO : top_height * TITLE_RATIO);
    $(".top-box").css({
        height: top_height,
        width: WT,
        'font-size': font_size + "px"
    });
    cards = new Array(ROW);
    is_logo = COLUMN * ROW;
    for (var row = 0; row < ROW; row++) {
        cards[row] = new Array(COLUMN);
        var row_div = document.createElement("div");
        $(row_div).addClass("row");
        $("body").append(row_div);
        for (var col = 0; col < COLUMN; col++) {
            var id = row + "_" + col;
            cards[row][col] = new Card(id, null, null);
            var card_div = document.createElement("div");
            $(card_div).addClass('card viewport-flip left');
            $(card_div).attr("id", id);
            $(row_div).append(card_div);
        }
    }
    $(".card").css({
        width: SIDE,
        height: SIDE,
        border: CARD_BORDER + "px " + BORDER_STYLE + " " + COLOR.BORDER[0]});
    $(".row").css({
        height: SIDE + CARD_BORDER * 2,
        width: (SIDE + CARD_BORDER * 2) * COLUMN
    });
    // initialize cards
    $.getScript("./js/libs/create_card.js", function () {
        create_card(LOGO_PATH, SIDE, COLOR.CARD, (card_face) => {
            $(card_face).addClass("face front flip in");
            $(".card").append(card_face);
        });
        $(".face").css({width: SIDE, height: SIDE});
    });
    $(".card").css({width: SIDE, height: SIDE}); //, border: CARD_BORDER + "px solid #aaaaaa"

    var deleted_keys = [];
    setInterval(() => {
        if (data_pool.size - deleted_keys.length > 0 && is_locked < COLUMN * ROW) {
            var key;
            do {
                key = Array.from(data_pool.keys())[parseInt(Math.random() * data_pool.size) - 1];
                if (key && data_pool.get(key).used) {
                    data_pool.delete(key);
                    key = null;
                }
            } while (!key)
            var rec = data_pool.get(key);
            rec.used = true;
            deleted_keys.push(key);
            deal_card(rec.query_str, rec.img_path, rec.content);
        } else {
            if (deleted_keys.length > 0) {
                deleted_keys.forEach((key) => {
                    data_pool.delete(key);
                });
                console.log(deleted_keys.length + " used data dumped. data_pool size = "
                        + data_pool.size + ":" + is_logo);
                deleted_keys = [];
            }
            deal_card('', LOGO_PATH, QRCODE_TOKEN);
        }
    }, SHOW_INTERVAL);

    socket.on("fire", (data) => {
        console.log('from ' + data.user);
        deal_card('', LOGO_PATH, QRCODE_TOKEN);
    });

    socket.on("result", (data) => {
        var pri;
        var replaced = 0;
        for (var index = 0; index < data.record_set.length; index++) {
            var record = new Record_Display(
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
        console.log("data_pool size = " + data_pool.size + "(" + replaced + "):" + is_logo);
        deal_card(pri.query_str, pri.img_path, pri.content);
    });

    function deal_card(query_str, img_path, content) {
        var card, row, col;
        do {
            row = parseInt(ROW * Math.random());
            col = parseInt(COLUMN * Math.random());
            card = cards[row][col];
            console.log(row, col, cards.length, cards[row].length, card.is_logo, is_logo);
        } while (card.locked === true || (!card.is_logo && is_logo > 5 && content !== QRCODE_TOKEN));
        //當卡片不是logo，並且版面上的logo多於5
        if (img_path == LOGO_PATH || content == QRCODE_TOKEN) {
            if (!card.is_logo) {
                is_logo++;
                card.is_logo = true;
            }
        } else {
            if (is_logo > 0) {
                is_logo--;
                card.is_logo = false;
            }
        }
//            console.log('is_logo = ' + is_logo);
        card.locked = true;
        is_locked++;
        if (content === QRCODE_TOKEN) {
            var canvas = document.createElement("canvas");
            canvas.height = SIDE;
            canvas.width = SIDE;
            qrcodelib.toCanvas(canvas, UMBRA_URL, function (err) {
                card.set_next(canvas.toDataURL("image/png"));
                flip(card, SIDE, COLOR.CARD, CARD_BORDER,
                        BORDER_STYLE, COLOR.BORDER[1]);
            });
        } else {
            draw_text(SIDE, ((query_str) ? "[" + query_str + "] " : "")
                    + content,
                    COLOR.CARD, (txt) => {
                card.set_next(txt);
                flip(card, SIDE, COLOR.CARD, CARD_BORDER,
                        BORDER_STYLE, COLOR.BORDER[1]);
            });
        }
        setTimeout(() => {
            card.set_next(img_path);
            flip(card, SIDE, COLOR.CARD, CARD_BORDER,
                    BORDER_STYLE, COLOR.BORDER[0]);
            setTimeout(() => {
                card.locked = false;
                is_locked--;
//                console.log((img_path == LOGO_PATH) ? 0 : SHOW_STAY);
            }, (img_path == LOGO_PATH) ? 0 : SHOW_STAY);
        }, FLIP_TIME_OUT);
    }
});
