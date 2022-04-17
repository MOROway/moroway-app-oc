function goBack() {
    if (document.referrer === document.baseURI + "help/index.html") {
        followLink("./help", "_self", LINK_STATE_INTERNAL_HTML);
    } else {
        followLink("html_platform/start.html", "_self", LINK_STATE_INTERNAL_LICENSE_FILE);
    }
}
window.addEventListener("load", function () {
    var elem = document.getElementById("backOption"),
        elemClone = elem.cloneNode(true);
    elem.parentNode.replaceChild(elemClone, elem);
    document.querySelector("#backOption").addEventListener("click", goBack);
});
function localDR() {
    document.addEventListener("backbutton", goBack, false);
}
