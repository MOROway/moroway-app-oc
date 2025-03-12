/**
 * Copyright 2025 Jonathan Herrmann-Engel
 * SPDX-License-Identifier: GPL-3.0-only
 */
"use strict";
import {followLink, LINK_STATE_INTERNAL_HTML, LINK_STATE_INTERNAL_LICENSE, LINK_STATE_NORMAL} from "./common/follow_links.js";
function goBack() {
    followLink("html_platform/start.html", "_self", LINK_STATE_INTERNAL_HTML);
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
    document.querySelector("#legal-appoc-licenses").classList.remove("hidden");
    document.querySelector("#legal-appoc-cordova-license").addEventListener("click", function () {
        followLink("licenses_platform/cordova", "_self", LINK_STATE_INTERNAL_LICENSE);
    });
    document.querySelector("#legal-appoc-webintent-license").addEventListener("click", function () {
        followLink("licenses_platform/webintent", "_self", LINK_STATE_INTERNAL_LICENSE);
    });
    document.querySelector("#legal-appoc-dialogs-license").addEventListener("click", function () {
        followLink("licenses_platform/dialogs", "_self", LINK_STATE_INTERNAL_LICENSE);
    });
});
document.addEventListener("deviceready", function () {
    document.addEventListener("backbutton", goBack, false);
});
