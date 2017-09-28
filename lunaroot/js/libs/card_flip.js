function flip(card, side, bg_color, card_border, border_style, border_color) {
    if (card.next_img) {
        var id = card.id;
        var path = card.next_img;
        create_card(path, side, bg_color, (c) => {
            $(c).addClass("face flip out");
            var card_element = $("#" + id);
            card_element.find(".front").toggleClass("in").toggleClass("out");
            setTimeout(() => {
                card_element.append(c);
                $(c).toggleClass("in").toggleClass("out");
                card_element.find(".front").remove();
                $(c).toggleClass("front");
                setTimeout(() => {
                    card_element.css({
                        border: card_border + "px "
                                + border_style + " "
                                + border_color});
                }, 175);
            }, 225);
        });
    }
}


