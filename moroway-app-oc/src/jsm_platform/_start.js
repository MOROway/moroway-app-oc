/**
 * Copyright 2025 Jonathan Herrmann-Engel
 * SPDX-License-Identifier: GPL-3.0-only
 */
"use strict";
import {followLink, LINK_STATE_INTERNAL_HTML} from "./common/follow_links.js";
import {getLocalAppDataCopy, setLocalAppDataCopy, APP_DATA} from "../jsm/common/app_data.js";
import {getString, setHTMLStrings} from "../jsm/common/string_tools.js";
import {showServerNote} from "../jsm/common/web_tools.js";

function styleContent() {
    var content = document.getElementById("content");
    content.style.display = "";
    if (window.innerHeight < content.scrollHeight) {
        content.style.display = "block";
    }
    var icons = document.querySelectorAll("#content .text-icon-big .material-icons");
    var iconSize;
    for (var iC = 0; iC < icons.length; iC++) {
        icons[iC].style.fontSize = "";
        iconSize = icons[iC].offsetWidth;
        icons[iC].style.fontSize = iconSize + "px";
    }
    icons = document.querySelectorAll("#content .text-icon-small");
    for (var iC = 0; iC < icons.length; iC++) {
        var iconSizeSmall = (iconSize / 4) * window.getComputedStyle(icons[iC].parentNode.parentNode).getPropertyValue("flex-grow");
        icons[iC].style.width = iconSizeSmall + "px";
        icons[iC].style.height = iconSizeSmall + "px";
        icons[iC].querySelector(".material-icons").style.fontSize = iconSizeSmall * 0.9 + "px";
        icons[iC].style.left = icons[iC].parentNode.offsetLeft + icons[iC].parentNode.offsetWidth / 2 + icons[iC].offsetWidth / 2 + "px";
        icons[iC].style.top = icons[iC].parentNode.offsetTop + icons[iC].parentNode.offsetHeight / 2 + icons[iC].offsetHeight / 2 + "px";
    }
}
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("link_game").addEventListener("click", function () {
        followLink("./", "_self", LINK_STATE_INTERNAL_HTML);
    });
    document.getElementById("link_multiplayer").addEventListener("click", function () {
        followLink("./?mode=multiplay", "_self", LINK_STATE_INTERNAL_HTML);
    });
    document.getElementById("link_demo").addEventListener("click", function () {
        followLink("html_platform/start_demo_mode.html", "_self", LINK_STATE_INTERNAL_HTML);
    });
    document.getElementById("link_help").addEventListener("click", function () {
        followLink("help", "_self", LINK_STATE_INTERNAL_HTML);
    });
    document.getElementById("link_settings").addEventListener("click", function () {
        followLink("settings", "_self", LINK_STATE_INTERNAL_HTML);
    });

    setHTMLStrings();

    styleContent();
});

window.addEventListener("load", function () {
    styleContent();
    window.setTimeout(styleContent, 50);
});
window.addEventListener("resize", function () {
    styleContent();
    window.setTimeout(styleContent, 50);
});

document.addEventListener("deviceready", function () {
    document.addEventListener("backbutton", function () {
        navigator.app.exitApp();
    });
    navigator.splashscreen.hide();

    var localAppData = getLocalAppDataCopy();
    if (localAppData !== null && (localAppData.version.major != APP_DATA.version.major || localAppData.version.minor != APP_DATA.version.minor)) {
        navigator.notification.confirm(
            getString("platformOcAppUpdate"),
            function (button) {
                if (button == 1) {
                    followLink("whatsnew/#newest", "_blank", LINK_STATE_INTERNAL_HTML);
                }
            },
            getString("generalNewVersion"),
            [getString("platformOcAppUpdateYes"), getString("platformOcAppUpdateNo")]
        );
    } else {
        showServerNote(document.querySelector("#server-note"));
    }
    setLocalAppDataCopy();
});
