function flip(card, side, bg_color, card_border, border_style, border_color) {
    if (card.back_img) {
        var id = card.id;
        var path = card.back_img;
        create_card(path, side, bg_color, (card_face) => {
            $(card_face).addClass("face flip out");
            var card_div = $("#" + id);
            card_div.find(".front").toggleClass("in").toggleClass("out");
            setTimeout(() => {
                card_div.append(card_face);
                $(card_face).toggleClass("in").toggleClass("out");
                card_div.find(".front").remove();
                $(card_face).toggleClass("front");
                setTimeout(() => {
                    card_div.css({
                        border: card_border + "px "
                                + border_style + " "
                                + border_color});
                }, 175);
            }, 225);
        });
    }
}


