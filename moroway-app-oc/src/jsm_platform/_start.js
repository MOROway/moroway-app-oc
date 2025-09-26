/**
 * Copyright 2025 Jonathan Herrmann-Engel
 * SPDX-License-Identifier: GPL-3.0-only
 */
"use strict";
import { SYSTEM_TOOLS } from "../jsm_platform/common/system_tools.js";
import { APP_DATA, getLocalAppDataCopy, setLocalAppDataCopy } from "../jsm/common/app_data.js";
import { getString, setHTMLStrings } from "../jsm/common/string_tools.js";
import { followLink, LinkStates, showServerNote } from "../jsm/common/web_tools.js";
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
        var iconSizeSmall = (iconSize / 4) * parseFloat(window.getComputedStyle(icons[iC].parentElement.parentElement).getPropertyValue("flex-grow"));
        icons[iC].style.width = iconSizeSmall + "px";
        icons[iC].style.height = iconSizeSmall + "px";
        icons[iC].querySelector(".material-icons").style.fontSize = iconSizeSmall * 0.9 + "px";
        icons[iC].style.left = icons[iC].parentElement.offsetLeft + icons[iC].parentElement.offsetWidth / 2 + icons[iC].offsetWidth / 2 + "px";
        icons[iC].style.top = icons[iC].parentElement.offsetTop + icons[iC].parentElement.offsetHeight / 2 + icons[iC].offsetHeight / 2 + "px";
    }
}
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("link_game").addEventListener("click", function () {
        followLink("./", "_self", LinkStates.InternalHtml);
    });
    document.getElementById("link_multiplayer").addEventListener("click", function () {
        followLink("./?mode=multiplayer", "_self", LinkStates.InternalHtml);
    });
    document.getElementById("link_demo").addEventListener("click", function () {
        followLink("html_platform/start_demo_mode.html", "_self", LinkStates.InternalHtml);
    });
    document.getElementById("link_help").addEventListener("click", function () {
        followLink("help", "_self", LinkStates.InternalHtml);
    });
    document.getElementById("link_settings").addEventListener("click", function () {
        followLink("settings", "_self", LinkStates.InternalHtml);
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
        SYSTEM_TOOLS.exitApp();
    });
    // Cordova wrapper contains this function
    // @ts-ignore
    navigator.splashscreen.hide();
    var localAppData = getLocalAppDataCopy();
    if (localAppData !== null && (localAppData.version.major != APP_DATA.version.major || localAppData.version.minor != APP_DATA.version.minor)) {
        // Cordova wrapper contains this function
        // @ts-ignore
        navigator.notification.confirm(getString("platformOcAppUpdate"), function (button) {
            if (button == 1) {
                followLink("whatsnew/#newest", "_blank", LinkStates.InternalHtml);
            }
        }, getString("generalNewVersion"), [getString("platformOcAppUpdateYes"), getString("platformOcAppUpdateNo")]);
    }
    else {
        showServerNote(document.querySelector("#server-note"));
    }
    setLocalAppDataCopy();
});
