"use strict";
import {followLink, LINK_STATE_INTERNAL_HTML, LINK_STATE_INTERNAL_LICENSE, LINK_STATE_NORMAL} from "./common/follow_links.js";
import {handleServerJSONValues, getServerRedirectLink} from "../jsm/common/web_tools.js";
function goBack() {
    followLink("html_platform/start.html", "_self", LINK_STATE_INTERNAL_HTML);
}
document.addEventListener("DOMContentLoaded", function () {
    var pics = document.querySelector("#website-pics");
    pics.style.display = "none";
    handleServerJSONValues("webpics", function (res) {
        if (typeof res.pics == "object") {
            res.pics.forEach(function (pic) {
                var img = document.createElement("div");
                img.onclick = function () {
                    followLink(pic.links.normal, "_blank", LINK_STATE_NORMAL);
                };
                img.style.backgroundImage = "url('" + pic.urls.thumb.url + "')";
                pics.appendChild(img);
            });
            pics.style.display = "";
        }
    });
    var elem = document.getElementById("backOption"),
        elemClone = elem.cloneNode(true);
    elem.parentNode.replaceChild(elemClone, elem);
    document.querySelector("#backOption").addEventListener("click", goBack);
    document.querySelector("#legal-appoc-licenses").classList.remove("hidden");
    document.querySelector("#legal-appoc-cordova-license").addEventListener("click", function () {
        followLink("licenses_platform/cordova", "_self", LINK_STATE_INTERNAL_LICENSE);
    });
    document.querySelector("#legal-appoc-insomnia-license").addEventListener("click", function () {
        followLink("licenses_platform/insomnia", "_self", LINK_STATE_INTERNAL_LICENSE);
    });
    document.querySelector("#legal-appoc-webintent-license").addEventListener("click", function () {
        followLink("licenses_platform/webintent", "_self", LINK_STATE_INTERNAL_LICENSE);
    });
    document.querySelector("#legal-appoc-dialogs-license").addEventListener("click", function () {
        followLink("licenses_platform/dialogs", "_self", LINK_STATE_INTERNAL_LICENSE);
    });
    document.querySelector("#download-sourcelink").style.display = "none";
    document.querySelector("#download-sourcelink-oc").addEventListener("click", function () {
        followLink(getServerRedirectLink("source_code_appoc"), "_blank", LINK_STATE_NORMAL);
    });
});
document.addEventListener("deviceready", function () {
    document.addEventListener("backbutton", goBack, false);
});
