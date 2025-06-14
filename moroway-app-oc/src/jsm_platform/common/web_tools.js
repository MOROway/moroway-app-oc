/**
 * Copyright 2025 Jonathan Herrmann-Engel
 * SPDX-License-Identifier: GPL-3.0-only
 */
"use strict";
import { getShareLinkServerName, LinkStates } from "../../jsm/common/web_tools.js";
export function followLink(input1, input2, input3) {
    switch (input3) {
        case LinkStates.Intent:
            var redirect = "./";
            if (typeof input1 == "string") {
                input1 = input1.replace(/^[a-z]*:[/][/]/, "");
            }
            var server = getShareLinkServerName() + "/";
            if (typeof input1 == "string" && input1.toLowerCase().indexOf(server) === 0) {
                input1 = input1.replace(server, "");
                var id = input1.replace(/[/].*$/, "");
                var key = input1.replace(/.*[/]([^/]+)([/])?$/, "$1");
                if (input1.length > 0 && id.match(/^[0-9]+$/) !== null && key.match(/^[a-zA-Z0-9]+$/) !== null) {
                    redirect += "?mode=multiplay&id=" + id + "&key=" + key;
                }
                followLink(redirect, "_blank", LinkStates.InternalHtml);
            }
            else {
                followLink(redirect + "html_platform/start.html", "_self", LinkStates.InternalHtml);
            }
            return;
        case LinkStates.External:
            input2 = "_system";
            break;
        case LinkStates.InternalHtml:
        case LinkStates.InternalReload:
            var hash, queryString;
            if (input1.includes("#")) {
                hash = input1.substr(input1.indexOf("#"));
                input1 = input1.substr(0, input1.length - (input1.length - input1.indexOf("#")));
            }
            if (input1.includes("?")) {
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
        case LinkStates.InternalLicense:
            input1 = "./license/index.html?license-file=" + input1;
            break;
    }
    if (typeof input2 !== "string") {
        input2 = "";
    }
    input2 = input2.replace(/\s/g, "");
    if (input2 === "") {
        window.open(input1);
    }
    else {
        window.open(input1, input2);
    }
}
