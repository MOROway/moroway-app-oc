"use strict";
import {getShareLinkServerName} from "../../jsm/common/web_tools.js";
export function followLink(input1, input2, input3) {
    switch (input3) {
        case LINK_STATE_NORMAL:
            input2 = "_system";
            break;
        case LINK_STATE_INTERNAL_HTML:
            var hash, queryString;
            if (input1.indexOf("#") != -1) {
                hash = input1.substr(input1.indexOf("#"));
                input1 = input1.substr(0, input1.length - (input1.length - input1.indexOf("#")));
            }
            if (input1.indexOf("?") != -1) {
                queryString = input1.substr(input1.indexOf("?"));
                input1 = input1.substr(0, input1.length - (input1.length - input1.indexOf("?")));
            }
            input1 = input1.length == 0 ? "./index.html" : input1.substr(input1.length - 1, 1) == "/" ? input1 + "index.html" : input1.substr(input1.length - 5, 5) == ".html" ? input1 : input1 + "/index.html";
            if (queryString !== undefined) {
                input1 += queryString;
            }
            if (hash !== undefined) {
                input1 += hash;
            }
            break;
        case LINK_STATE_INTERNAL_LICENSE:
            input1 = "./license/index.html?license-file=" + input1;
            break;
        case LINK_STATE_INTERNAL_LICENSE_FILE:
            history.replaceState(null, "", input1);
            location.reload();
            return;
    }
    window.open(input1, input2);
}

export function followIntent(url) {
    var redirect = "./";
    if (url !== null) {
        url = url.replace(/^[a-z]*:[/][/]/, "");
    }
    var server = getShareLinkServerName() + "/";
    if (url !== null && url.toLowerCase().indexOf(server) === 0) {
        url = url.replace(server, "");
        var id = url.replace(/[/].*$/, "");
        var key = url.replace(/.*[/]([^/]+)([/])?$/, "$1");
        if (url.length > 0 && id.match(/^[0-9]+$/) !== null && key.match(/^[a-zA-Z0-9]+$/) !== null) {
            redirect += "?mode=multiplay&id=" + id + "&key=" + key;
        }
        followLink(redirect, "_blank", LINK_STATE_INTERNAL_HTML);
    } else {
        followLink(redirect + "html_platform/start.html", "_self", LINK_STATE_INTERNAL_HTML);
    }
}

export const LINK_STATE_NORMAL = 0;
export const LINK_STATE_INTERNAL_HTML = 1;
export const LINK_STATE_INTERNAL_LICENSE_FILE = 2;
export const LINK_STATE_INTERNAL_LICENSE = 3;
