function Card(id, img, next_img) {
    this.id = id;
    this.img = img;
    this.next_img = next_img;

    this.set_next = function (new_img) {
        if (this.next_img) {
            img = this.next_img;
        }
        this.next_img = new_img;
    };
}
