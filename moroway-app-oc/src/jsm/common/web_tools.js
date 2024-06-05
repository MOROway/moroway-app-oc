/**
 * Copyright 2024 Jonathan Herrmann-Engel
 * SPDX-License-Identifier: Apache-2.0
 */
"use strict";
import { followLink, LINK_STATE_NORMAL } from "../../jsm_platform/common/follow_links.js";
import { APP_DATA } from "./app_data.js";
import { formatJSString, getString, CURRENT_LANG } from "./string_tools.js";
//HANDLE QUERY String
export function getQueryString(key) {
    var value = "";
    window.location.search
        .substring(1)
        .split("&")
        .forEach(function (part) {
        if (part.indexOf("=") > 0 && part.substring(0, part.indexOf("=")) == key) {
            value = part.substring(part.indexOf("=") + 1);
        }
    });
    return value;
}
//HANDLE LINKS
export function getShareLink(id, key) {
    return formatJSString("https://app.moroway.de/{{0}}/{{1}}", id, key);
}
export function getShareLinkServerName() {
    return "app.moroway.de";
}
export function getServerLink(protocol) {
    if (protocol === void 0) { protocol = PROTOCOL_HTTP; }
    return protocol + "://herrmann-engel.de/projekte/moroway/moroway-app/server";
}
export function getServerRedirectLink(key) {
    var SERVER_REDIRECT_LINK = getServerLink() + "/redirect_to/index.php";
    return SERVER_REDIRECT_LINK + "?key=" + key + "&platform=" + APP_DATA.platform + "&lang=" + CURRENT_LANG;
}
export function getServerHTMLLink(key, showCloseButton) {
    if (showCloseButton === void 0) { showCloseButton = ""; }
    var SERVER_HTML_LINK = getServerLink() + "/html_content/index.php";
    return SERVER_HTML_LINK + "?key=" + key + "&platform=" + APP_DATA.platform + "&lang=" + CURRENT_LANG + "&closeButton=" + showCloseButton;
}
export function getServerDataLink(path) {
    var SERVER_DATA_LINK = getServerLink() + "/data";
    return SERVER_DATA_LINK + path;
}
export function handleServerJSONValues(key, func) {
    var SERVER_JSON_LINK = getServerLink() + "/json_content/index.php";
    fetch(SERVER_JSON_LINK + "?key=" + key + "&platform=" + APP_DATA.platform + "&lang=" + CURRENT_LANG)
        .then(function (response) {
        return response.json();
    })
        .catch(function (error) {
        if (APP_DATA.debug) {
            console.log("Fetch-Error:", error);
        }
    })
        .then(function (response) {
        if (typeof response == "object" && response != null && typeof response.error == "undefined") {
            func(response);
        }
        else if (APP_DATA.debug) {
            console.log(typeof response != "undefined" && response != null && typeof response.error != "undefined" ? "ERROR: " + response.error : "ERROR: Can't handle request!");
        }
    });
}
export function getServerNote(func) {
    function getServerNoteImage(id, background) {
        return getServerDataLink("/server-note/img/") + id + (background ? "-background-image" : "-image") + ".png";
    }
    var serverNoteLastQuery = window.localStorage.getItem("morowayAppLastServerNoteLastQuery");
    if (serverNoteLastQuery == null || Date.now() - parseInt(serverNoteLastQuery, 10) >= 86400000 || window.localStorage.getItem("morowayAppLastServerNoteShowAgain") == "1") {
        window.localStorage.setItem("morowayAppLastServerNoteLastQuery", Date.now().toString());
        handleServerJSONValues("news-msg", function (serverMsg) {
            if (typeof serverMsg == "object" && serverMsg.id != undefined && typeof serverMsg.id == "number" && serverMsg.title != undefined && typeof serverMsg.title == "string" && serverMsg.text != undefined && typeof serverMsg.text == "string" && serverMsg.validUntil != undefined && typeof serverMsg.validUntil == "number" && Date.now() / 1000 <= serverMsg.validUntil && (window.localStorage.getItem("morowayAppLastServerNoteShown") != serverMsg.id || window.localStorage.getItem("morowayAppLastServerNoteShowAgain") == "1")) {
                window.localStorage.setItem("morowayAppLastServerNoteShown", serverMsg.id);
                window.localStorage.setItem("morowayAppLastServerNoteShowAgain", "0");
                if (serverMsg.image != undefined && serverMsg.image === true) {
                    serverMsg.imageSrc = getServerNoteImage(serverMsg.id, false);
                    delete serverMsg.image;
                }
                if (serverMsg.backgroundImage != undefined && serverMsg.backgroundImage === true) {
                    serverMsg.backgroundImageSrc = getServerNoteImage(serverMsg.id, true);
                    delete serverMsg.backgroundImage;
                }
                func(serverMsg);
            }
        });
    }
}
export function showServerNote(serverNoteElementRoot) {
    getServerNote(function (serverMsg) {
        function styleShowAgain() {
            window.localStorage.setItem("morowayAppLastServerNoteShowAgain", showAgain ? "1" : "0");
            serverNoteElementLaterCheckBox.textContent = showAgain ? "check_box" : "check_box_outline_blank";
        }
        var showAgain = false;
        serverNoteElementRoot.classList.add("server-note");
        var serverNoteElementMain = document.createElement("div");
        serverNoteElementMain.className = "server-note-main";
        var serverNoteElementTitle = document.createElement("div");
        serverNoteElementTitle.className = "server-note-title";
        serverNoteElementTitle.textContent = serverMsg.title;
        var serverNoteElementInner = document.createElement("div");
        serverNoteElementInner.className = "server-note-inner";
        var serverNoteElementText = document.createElement("div");
        serverNoteElementText.className = "server-note-text";
        serverNoteElementText.textContent = serverMsg.text;
        var serverNoteElementImageContainer = document.createElement("div");
        serverNoteElementImageContainer.className = "server-note-img";
        var serverNoteElementImage = document.createElement("img");
        var serverNoteElementLater = document.createElement("div");
        serverNoteElementLater.className = "server-note-later";
        var serverNoteElementLaterCheckBox = document.createElement("i");
        serverNoteElementLaterCheckBox.className = "server-note-later-box material-icons";
        var serverNoteElementLaterCheckBoxLabel = document.createElement("span");
        serverNoteElementLaterCheckBoxLabel.textContent = getString("generalServerNoteButtonLater");
        var serverNoteElementLaterInfo = document.createElement("div");
        serverNoteElementLaterInfo.className = "server-note-later-info";
        serverNoteElementLaterInfo.textContent = getString("generalServerNoteInfoLater");
        var serverNoteElementButtons = document.createElement("div");
        serverNoteElementButtons.className = "server-note-buttons";
        var serverNoteElementButtonGo = document.createElement("div");
        serverNoteElementButtonGo.className = "server-note-button-go";
        serverNoteElementButtonGo.textContent = getString("generalServerNoteButtonGo", "", "upper");
        var serverNoteElementButtonNo = document.createElement("div");
        serverNoteElementButtonNo.className = "server-note-button-no";
        serverNoteElementButtonNo.textContent = getString("generalOK", "", "upper");
        styleShowAgain();
        serverNoteElementLater.onclick = function () {
            showAgain = !showAgain;
            styleShowAgain();
        };
        if (serverMsg.link != undefined && serverMsg.link != null && typeof serverMsg.link == "string") {
            serverNoteElementButtonGo.style.display = "block";
            serverNoteElementButtonGo.onclick = function () {
                followLink(getServerRedirectLink(serverMsg.link), "_blank", LINK_STATE_NORMAL);
            };
        }
        serverNoteElementButtonNo.onclick = function () {
            serverNoteElementRoot.style.display = "";
        };
        if (serverMsg.imageSrc != undefined && typeof serverMsg.imageSrc == "string") {
            serverNoteElementImageContainer.style.display = "flex";
            serverNoteElementImage.src = serverMsg.imageSrc;
            if (serverMsg.imageLink != undefined && serverMsg.imageLink != null && typeof serverMsg.imageLink == "string") {
                serverNoteElementImage.style.cursor = "pointer";
                serverNoteElementImage.onclick = function () {
                    followLink(getServerRedirectLink(serverMsg.imageLink), "_blank", LINK_STATE_NORMAL);
                };
            }
        }
        if (serverMsg.backgroundImageSrc != undefined && typeof serverMsg.backgroundImageSrc == "string") {
            serverNoteElementRoot.style.backgroundImage = "url(" + serverMsg.backgroundImageSrc + ")";
        }
        serverNoteElementMain.appendChild(serverNoteElementTitle);
        serverNoteElementInner.appendChild(serverNoteElementText);
        serverNoteElementImageContainer.appendChild(serverNoteElementImage);
        serverNoteElementInner.appendChild(serverNoteElementImageContainer);
        serverNoteElementLater.appendChild(serverNoteElementLaterCheckBox);
        serverNoteElementLater.appendChild(serverNoteElementLaterCheckBoxLabel);
        serverNoteElementInner.appendChild(serverNoteElementLater);
        serverNoteElementInner.appendChild(serverNoteElementLaterInfo);
        serverNoteElementButtons.appendChild(serverNoteElementButtonGo);
        serverNoteElementButtons.appendChild(serverNoteElementButtonNo);
        serverNoteElementInner.appendChild(serverNoteElementButtons);
        serverNoteElementMain.appendChild(serverNoteElementInner);
        serverNoteElementRoot.appendChild(serverNoteElementMain);
        serverNoteElementRoot.style.display = "block";
    });
}
export var PROTOCOL_HTTP = "https";
export var PROTOCOL_WS = "wss";
