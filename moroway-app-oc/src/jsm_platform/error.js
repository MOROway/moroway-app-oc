/**
 * Copyright 2024 Jonathan Herrmann-Engel
 * SPDX-License-Identifier: GPL-3.0-only
 */
"use strict";
import {followLink, LINK_STATE_INTERNAL_HTML} from "./common/follow_links.js";
function goBack() {
    followLink("html_platform/start.html", "_self", LINK_STATE_INTERNAL_HTML);
}
window.addEventListener("load", function () {
    var elem = document.getElementById("backOption"),
        elemClone = elem.cloneNode(true);
    elem.parentNode.replaceChild(elemClone, elem);
    document.querySelector("#backOption").addEventListener("click", goBack);
});
document.addEventListener("deviceready", function () {
    document.addEventListener("backbutton", goBack, false);
});
