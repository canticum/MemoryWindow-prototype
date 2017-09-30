/* global TXT_POOL, COLUMN, ROW, CARD_BORDER, BORDER_STYLE, COLOR, FLIP_TIME_OUT, LOGO_TOKEN, LOGO_PATH */
function MOD(row) {
    return (row > 2) ? 1 : ((row === 1) ? 0.72 : 0.95);
}
$(function () {
    const WT = window.screen.availWidth - 10, HT = window.screen.availHeight;
    const SIDE = (WT / COLUMN > HT / ROW) ?
            HT / ROW * MOD(ROW) - CARD_BORDER * 2 :
            WT / COLUMN - CARD_BORDER * 2;
    var top_box = document.createElement("div");
    $(top_box).css({
        height: (HT - (SIDE + CARD_BORDER * 2) * ROW) / 2,
        width: (SIDE + CARD_BORDER * 2) * COLUMN
    });
    $("body").prepend(top_box);
    var cards = [];
    var is_logo = COLUMN * ROW;
    $.getScript("./js/libs/Card.js", () => {
        for (row = 0; row < ROW; row++) {
            cards[row] = [];
            var row_div = document.createElement("div");
            $(row_div).addClass("row");
            $("body").append(row_div);
            for (col = 0; col < COLUMN; col++) {
//                var index = parseInt(img_pool.length * Math.random());
//                cards[i][j] = new Card(i + "_" + j, img_pool[index]);
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
        cards.forEach(function (row) {
            row.forEach(function (card) {
                var id = card.id;
                create_card(card.front_img, SIDE, COLOR.CARD, (card_face) => {
                    $(card_face).addClass("face front flip in");
                    $("#" + id).append(card_face);
                });
            });
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
        socket.on("fire", (data) => {
            var key, record;
            if (data_pool.size > 0) {
                key = data_pool.keys().next().value;
                record = data_pool.get(key);
                console.log(data.user, data_pool.size);
            } else {
                record = new Record_Display(null, LOGO_PATH, LOGO_TOKEN);
            }
            deal_card(record);
        });

        socket.on("result", (data) => {
            var priority_key;
            for (index = 0; index < data.record_set.length; index++) {
                var record = new Record_Display(
                        data.query_str,
                        data.record_set[index].img_url,
                        data.record_set[index].content);
                if (data_pool.has(record.img_path)) {
                    console.log("Duplicate image. Replaced. " + data_pool.size);
                } else {
                    console.log("here. " + data_pool.size);
                }
                data_pool.set(record.img_path, record);
                if ((!priority_key)) {
                    priority_key = record.img_path;
                    if (data_pool.get(record.img_path).query_str !== data.query_str)
                        console.log("Not the same query.");
                }
            }
            var priority = data_pool.get(priority_key);
            deal_card(priority);
        });

        function deal_card(record) {
            data_pool.delete(record.img_path);
            console.log("data_pool size after delete = " + data_pool.size);
            var card, row, col;
            do {
                row = parseInt(ROW * Math.random());
                col = parseInt(COLUMN * Math.random());
                console.log(row, col);
                card = cards[row][col];
//                if (!card.is_logo && is_logo > 0)
//                    console.log('chosen is not logo but logos still here.');
            } while (card.locked === true ||
                    (!card.is_logo && is_logo > 0));
            if (is_logo > 0) {
                is_logo--;
                card.is_logo = false;
            }
            card.locked = true;
            draw_text(SIDE, ((record.query_str) ? record.query_str + "::" : "")
                    + record.content,
                    COLOR.CARD, (txt) => {
                card.set_next(txt);
                flip(card, SIDE, COLOR.CARD, CARD_BORDER,
                        BORDER_STYLE, COLOR.BORDER[1]);
            });
            setTimeout(() => {
                card.set_next(record.img_path);
                flip(card, SIDE, COLOR.CARD, CARD_BORDER,
                        BORDER_STYLE, COLOR.BORDER[0]);
                card.locked = false;
            }, FLIP_TIME_OUT);
        }
    });
});

