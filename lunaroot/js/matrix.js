/* global TXT_POOL, COLUMN, ROW, CARD_BORDER, BORDER_STYLE, COLOR, FLIP_TIME_OUT, LOGO_PATH, UMBRA_URL, QRCODE_TOKEN, qrcodelib, PROJECT_TITLE, PROJECT_TITLE_SHORT, TITLE_RATIO, TOP_HEIGHT_RATIO */

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
    var cards = [];
    var is_logo = COLUMN * ROW;
    $.getScript("./js/libs/Card.js", () => {
        for (row = 0; row < ROW; row++) {
            cards[row] = [];
            var row_div = document.createElement("div");
            $(row_div).addClass("row");
            $("body").append(row_div);
            for (col = 0; col < COLUMN; col++) {
                var id = row + "_" + col;
                cards[row][col] = new Card(id);
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

    $.getScript("./js/libs/card_flip.js", function () {
        var socket = io({
            query: {
                role: 'luna'
            }
        });
        var data_pool = new Map();
        function Record_Display(str, img, txt) {
            this.query_str = str;
            this.img_path = img;
            this.content = txt;
        }
        deal_interval();

        socket.on("fire", (data) => {
            console.log('from ' + data.user);
            deal_card(new Record_Display(null, LOGO_PATH, QRCODE_TOKEN));
        });

        socket.on("result", (data) => {
            var priority_key;
            var replaced = 0;
            for (index = 0; index < data.record_set.length; index++) {
                var record = new Record_Display(
                        data.query_str,
                        data.record_set[index].img_url,
                        data.record_set[index].content);
                if (data_pool.has(record.img_path)) {
                    replaced++;
                }
                data_pool.set(record.img_path, record);
                if ((!priority_key)) {
                    priority_key = record.img_path;
                    if (data_pool.get(record.img_path).query_str !== data.query_str)
                        console.log("Not the same query.");
                }
            }
            console.log("data_pool size = " + data_pool.size +
                    "(" + replaced + ")");
            var priority = data_pool.get(priority_key);
            deal_card(priority);
//            if (!showID)
//                deal_interval();
        });

        function deal_interval() {
            var showID;
//            if (!showID) {
            showID = setInterval(function () {
                var key = data_pool.keys().next().value;
                if (key)
                    deal_card(data_pool.get(key));
                else {
                    deal_card(new Record_Display(null, LOGO_PATH, QRCODE_TOKEN));
//                        clearInterval(showID);
//                        showID = null;
                }
            }, 3000);
//            } else {
//                console.log("Show in process.");
//            }
        }

        function all_cards_locked() {
            for (row = 0; row < ROW; row++) {
                for (col = 0; col < COLUMN; col++) {
                    if (!cards[row][col].locked)
                        return false;
                }
            }
            return true;
        }

        function deal_card(record) {
            if (all_cards_locked())
                return;
            var card, row, col;
            do {
                row = parseInt(ROW * Math.random());
                col = parseInt(COLUMN * Math.random());
                card = cards[row][col];
                console.log(row, col, card.locked,
                        (record.content !== QRCODE_TOKEN && !card.is_logo && is_logo > 0));
            } while (card.locked === true ||
                    (record.content !== QRCODE_TOKEN && !card.is_logo && is_logo > 0));
            if (record.img_path === LOGO_PATH) {
                if (!card.is_logo) {
                    is_logo++;
                    card.is_logo = true;
                }
            } else {
                data_pool.delete(record.img_path);
                console.log("data_pool size after delete = " + data_pool.size);
                if (is_logo > 0) {
                    is_logo--;
                    card.is_logo = false;
                }
            }
            console.log('is_logo = ' + is_logo);
            card.locked = true;
            if (record.content === QRCODE_TOKEN) {
                var canvas = document.createElement("canvas");
                canvas.height = SIDE;
                canvas.width = SIDE;
                qrcodelib.toCanvas(canvas, UMBRA_URL, function (err) {
                    card.set_next(canvas.toDataURL("image/png"));
                    flip(card, SIDE, COLOR.CARD, CARD_BORDER,
                            BORDER_STYLE, COLOR.BORDER[1]);
                });
            } else {
                draw_text(SIDE, ((record.query_str) ? record.query_str + "::" : "")
                        + record.content,
                        COLOR.CARD, (txt) => {
                    card.set_next(txt);
                    flip(card, SIDE, COLOR.CARD, CARD_BORDER,
                            BORDER_STYLE, COLOR.BORDER[1]);
                });
            }
            setTimeout(() => {
                card.set_next(record.img_path);
                flip(card, SIDE, COLOR.CARD, CARD_BORDER,
                        BORDER_STYLE, COLOR.BORDER[0]);
                card.locked = false;
            }, FLIP_TIME_OUT);
        }
    });
});

