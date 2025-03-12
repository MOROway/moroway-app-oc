/**
 * Copyright 2025 Jonathan Herrmann-Engel
 * SPDX-License-Identifier: GPL-3.0-only
 */
"use strict";
import {followLink, LINK_STATE_INTERNAL_HTML} from "./common/follow_links.js";
function goBack() {
    if (document.referrer === document.baseURI + "help/index.html") {
        followLink("./help", "_self", LINK_STATE_INTERNAL_HTML);
    } else {
        followLink("html_platform/start.html", "_self", LINK_STATE_INTERNAL_HTML);
    }
}
document.addEventListener("DOMContentLoaded", function () {
    const elem = document.getElementById("backOption");
    if (elem) {
        const elemClone = elem.cloneNode(true);
        elem.parentNode.replaceChild(elemClone, elem);
        const elemNew = document.getElementById("backOption");
        if (elemNew) {
            elemNew.addEventListener("click", goBack);
        }
    }
});
document.addEventListener("deviceready", function () {
    document.addEventListener("backbutton", goBack, false);
});
