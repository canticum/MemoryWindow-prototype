/* global IMG_POOL, TXT_POOL */

const COLUMN = 10, ROW = 5;
const CARD_BORDER = 10, BORDER_STYLE = 'inset';
const WT = window.screen.availWidth - 10, HT = window.screen.availHeight;
const SIDE = (WT / COLUMN > HT / ROW) ?
        HT / ROW * MOD(ROW) - CARD_BORDER * 2 :
        WT / COLUMN - CARD_BORDER * 2;
const COLOR = {
    CARD: '#373737', //rgb(55,55,55)
    BORDER: ['#cecece', '#3333ff']
};
const TIME_OUT = 5000; //ms

function MOD(row) {
    switch (row) {
        case 1:
            return 0.72;
        case 2:
            return 0.95;
    }
    return 1;
}

$(function () {
    var top_box = document.createElement("div");
    $(top_box).css({
        height: (HT - (SIDE + CARD_BORDER * 2) * ROW) / 2,
        width: (SIDE + CARD_BORDER * 2) * COLUMN
    });
    $("body").prepend(top_box);
    var img_pool, txt_pool;
    img_pool = IMG_POOL;
    txt_pool = TXT_POOL;
    var cards = [];
    $.getScript("./js/libs/Card.js", () => {
        for (i = 0; i < ROW; i++) {
            cards[i] = [];
            var row = document.createElement("div");
            $(row).addClass("row");
            $("body").append(row);
            for (j = 0; j < COLUMN; j++) {
                var index = parseInt(img_pool.length * Math.random());
                cards[i][j] = new Card(i + "_" + j, img_pool[index]);
                var card = document.createElement("div");
                $(card).addClass('card viewport-flip left');
                $(card).attr("id", cards[i][j].id);
                $(row).append(card);
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
                create_card(card.img, SIDE, COLOR.CARD, (c) => {
                    $(c).addClass("face front flip in");
                    $("#" + id).append(c);
                });
            });
        });
        $(".face").css({width: SIDE, height: SIDE});
    });
    $(".card").css({width: SIDE, height: SIDE}); //, border: CARD_BORDER + "px solid #aaaaaa"

    $.getScript("./js/libs/card_flip.js", function () {
        var socket = io({
            query: {
                role: 'result'
            }
        });
        socket.on("result", function (data) {
            var card, i, j;
            do {
                i = parseInt(ROW * Math.random());
                j = parseInt(COLUMN * Math.random());
                console.log(i, j);
                card = cards[i][j];
            } while (card.locked === true);
            card.locked = true;

            draw_text(SIDE, data.text, COLOR.CARD, (txt) => {
                card.set_next(txt);
                flip(card, SIDE, COLOR.CARD, CARD_BORDER, BORDER_STYLE, COLOR.BORDER[1]);
            });
            setTimeout(() => {
                card.set_next(data.url);
                flip(card, SIDE, COLOR.CARD, CARD_BORDER, BORDER_STYLE, COLOR.BORDER[0]);

                card.locked = false;
            }, TIME_OUT);
        });
    });
});

