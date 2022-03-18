function init() {
    document.querySelector("#backOption").addEventListener("click", function () {
        followLink("./", "_self", LINK_STATE_INTERNAL_HTML);
    });

    var elems = document.querySelectorAll(".content");
    for (var i = 0; i < elems.length; i++) {
        var elemString = elems[i].dataset.stringidContent;
        var j = 0;
        do {
            if (getString([elemString, j]) != "undefined") {
                var selem = document.createElement("p");
                selem.setAttribute("data-stringid-content", elemString);
                selem.setAttribute("data-stringid-content-arrayno", j);
                elems[i].appendChild(selem);
                j++;
            } else {
                j = 0;
            }
        } while (j > 0);
        elems[i].removeAttribute("data-stringid-content");
    }
    setHTMLStrings();
}
