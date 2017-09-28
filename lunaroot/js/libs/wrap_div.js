function wrap_div(element) {
    var wrapper = document.createElement("div");
    $(wrapper).append(element);
    $(wrapper).css({
        width: element.width,
        height: element.height
    });
    return wrapper;
}
