"use strict";
window.addEventListener("load", function () {
    setSettingsHTML(document.querySelector("main"), true);
    document.querySelector("#backOption").addEventListener("click", function () {
        try {
            window.close();
        } catch (err) {}
        followLink("./", "_self", LINK_STATE_INTERNAL_HTML);
    });
});
