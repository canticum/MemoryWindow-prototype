/* global PROJECT */

function Card(id, front, back) {
    this.id = id;
    this.is_logo = false;
    this.front_img;
    this.back_img;
    this.locked = false;
    if (front)
        this.front_img = front;
    else {
        this.front_img = PROJECT.LOGO_PATH;
        this.is_logo = true;
    }
    if (back)
        this.back_img = back;

    this.set_next = function (back) {
        if (back) {
            if (this.back_img)
                this.front_img = this.back_img;
            this.back_img = back;
        }
    };
}
