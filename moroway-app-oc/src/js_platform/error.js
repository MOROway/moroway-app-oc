window.addEventListener("load",function(){
    var elem = document.getElementById("backOption"),
        elemClone = elem.cloneNode(true);
    elem.parentNode.replaceChild(elemClone, elem);
    document.querySelector("#backOption").addEventListener("click", function(){followLink("html_platform/start.html","_self", LINK_STATE_INTERNAL_LICENSE_FILE);});
});
